import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn, execFileSync} from 'node:child_process';
import {randomBytes, generateKeyPairSync} from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const product = process.env.WORKSHOP_PRODUCT_ROOT || path.resolve(here, '../../../../MultiTour');
const evidence = process.env.SESSION1_EVIDENCE || path.join(here, 'evidence');
const contractOnly = process.env.SESSION1_CONTRACT_ONLY === 'true';
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'week13-security-'));
const containers = [], networks = [], images = [], children = [], results = [];
const redact = s => s.replace(/eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*/g, '[JWT]')
  .replace(/postgres(?:ql)?:\/\/[^\s"']+/g, '[TEST_DATABASE_URL]');
const sync = (tool, args, cwd = temp, env = process.env, input) => execFileSync(tool, args, {cwd, env, input, encoding:'utf8', maxBuffer:64*1024*1024}).trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const records = [
  ['security','transversales/multi-tour-security','HEAD'],
  ['commercial','d02-comercial-reservas/multi-tour-commercial-reservation-api','HEAD'],
  ['identity-audit','d01-plataforma/multi-tour-identity-audit-api','HEAD'],
  ['cash-reporting','d04-caja-reportes/multi-tour-cash-reporting-api','HEAD'],
  ['cash-db','d04-caja-reportes/multi-tour-cash-reporting-db','origin/develop'],
  ['operations-cost','d03-operacion-costos/multi-tour-operations-cost-api','origin/develop'],
  ['relay','transversales/multi-tour-worker-event-relay','HEAD'],
  ['gateway','transversales/multi-tour-api-gateway','HEAD']
];
const sources = {};
const lockFile=process.env.SESSION1_SOURCES_LOCK || path.join(here,'sources-lock.json');
const locked=fs.existsSync(lockFile)?JSON.parse(fs.readFileSync(lockFile,'utf8')):{};
const previous=fs.existsSync(path.join(evidence,'sources.json'))?JSON.parse(fs.readFileSync(path.join(evidence,'sources.json'),'utf8').replace(/^\uFEFF/,'')):{};
fs.mkdirSync(evidence,{recursive:true});
fs.rmSync(path.join(evidence,'completion.json'),{force:true});
for (const [name, relative, ref] of records) {
  const repo = path.join(product,relative), sha = sync('git',['-C',repo,'rev-parse',locked[name]?.revision||ref]);
  const dest = path.join(temp,name); fs.mkdirSync(dest);
  const archive = path.join(temp,`${name}.tar`);
  execFileSync('git',['-c','core.autocrlf=false','-C',repo,'archive','--format=tar',`--output=${archive}`,sha]);
  sync('tar',['-xf',archive,'-C',dest]); fs.unlinkSync(archive);
  sources[name] = {repository:relative, revision:sha, directory:dest};
}
fs.writeFileSync(path.join(evidence,'sources.json'),JSON.stringify(Object.fromEntries(Object.entries(sources).map(([k,{directory,...v}])=>[k,v])),null,2)+'\n');

function start(tool,args,cwd,env=process.env) {
  const child = spawn(tool,args,{cwd,env,windowsHide:true,detached:process.platform!=='win32',stdio:['ignore','pipe','pipe']});
  let output=''; child.stdout.on('data',b=>output+=b); child.stderr.on('data',b=>output+=b);
  const done = new Promise(resolve=>{child.on('error',e=>{output+=e.message;resolve(127)});child.on('exit',code=>resolve(code??1))});
  const job={child,done,get output(){return output}}; children.push(job); return job;
}
function save(name,job,code) {
  const lines=redact(job.output).split(/\r?\n/).filter(l=>/^(\s*--- (PASS|SKIP|FAIL):|PASS$|FAIL|ok\s|PASS  |ALL CHECKS|\[INFO\] (Running |Tests run:|BUILD |Total time:)|\[ERROR\])/.test(l));
  const result={component:name,exitCode:code,checkedAt:new Date().toISOString(),
    passedGoTests:lines.filter(l=>l.startsWith('--- PASS:')).length,
    passedSubtests:lines.filter(l=>/^\s+--- PASS:/.test(l)).length,
    skippedGoTests:lines.filter(l=>l.startsWith('--- SKIP:')).length,
    passedSmokeChecks:lines.filter(l=>l.startsWith('PASS  ')).length};
  fs.writeFileSync(path.join(evidence,`${name}.log`),`Exit code: ${code}\n${lines.join('\n')}\n`);
  fs.writeFileSync(path.join(evidence,`${name}.json`),JSON.stringify(result,null,2)+'\n');
  results.push(result); console.log(`${name}: exit ${code}`);
  if(code) fs.writeFileSync(path.join(temp,`${name}-failure.log`),redact(job.output));
}
async function run(name,tool,args,cwd,env=process.env) { const job=start(tool,args,cwd,env),code=await job.done;save(name,job,code);return code; }
async function waitFile(file,job,seconds=180) {
  const end=Date.now()+seconds*1000;
  while(!fs.existsSync(file)) {if(job.child.exitCode!==null)throw Error(`Process exited before ${path.basename(file)}; ${redact(job.output).slice(-1800)}`);if(Date.now()>end)throw Error(`Timeout: ${path.basename(file)}`);await sleep(500)}
  return fs.readFileSync(file,'utf8').trim();
}
function findMaven(root) {
  if(!fs.existsSync(root))return;
  for(const e of fs.readdirSync(root,{withFileTypes:true})) {
    const p=path.join(root,e.name);
    if(e.isFile()&&e.name==='mvn.cmd'&&p.includes('3.9.'))return path.dirname(path.dirname(p));
    if(e.isDirectory()){const found=findMaven(p);if(found)return found}
  }
}
const mavenHome=process.env.MAVEN_HOME || (process.platform==='win32'?findMaven(path.join(os.homedir(),'.m2/wrapper/dists')):null);
function maven(tests,repo,env=process.env) {
  const args=['-B','-ntp','-Dstyle.color=never','-DargLine=-Xmx384m -XX:MaxMetaspaceSize=192m',`-Dtest=${tests}`,'-Dsurefire.failIfNoSpecifiedTests=false','test'];
  if(!mavenHome)return start('mvn',args,repo,env);
  const boot=path.join(mavenHome,'boot',fs.readdirSync(path.join(mavenHome,'boot')).find(x=>/^plexus-classworlds.*\.jar$/.test(x)));
  return start('java',['-Xmx384m','-XX:MaxMetaspaceSize=192m','-classpath',boot,`-Dclassworlds.conf=${path.join(mavenHome,'bin/m2.conf')}`,`-Dmaven.home=${mavenHome}`,`-Dmaven.multiModuleProjectDirectory=${repo}`,'org.codehaus.plexus.classworlds.launcher.Launcher',...args],repo,env);
}
function resumed(name) {
  if(!process.argv.includes('--resume'))return false;
  const p=path.join(evidence,`${name}.json`);if(!fs.existsSync(p))return false;
  const result=JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
  if(previous[name]?.revision!==sources[name].revision||result.exitCode!==0)return false;
  if(name==='cash-reporting'&&previous['cash-db']?.revision!==sources['cash-db'].revision)return false;
  if(name==='security'&&result.skippedGoTests)return false;
  results.push(result);console.log(`${name}: retaining passing evidence for identical source revision`);return true;
}
async function javaCheck(name,tests,env=process.env) {
  if(resumed(name))return 0;
  const job=maven(tests,sources[name].directory,env); let code=await job.done;
  for(const test of tests.split(','))if(!new RegExp(`Tests run: [1-9][0-9]*,.* -- in .*\\.${test}\\r?$`,'m').test(job.output))code=1;
  save(name,job,code);return code;
}
const openssl=process.env.OPENSSL || (process.platform==='win32'?'C:/Program Files/Git/usr/bin/openssl.exe':'openssl');
const bash=process.platform==='win32'?'C:/Program Files/Git/bin/bash.exe':'bash';
try {
  console.log('Exported immutable product revisions; working checkouts remain untouched.');
  const pgName=`week13-pg-${randomBytes(5).toString('hex')}`;containers.push(pgName);
  const pgPassword=randomBytes(24).toString('hex');
  sync('docker',['run','-d','--rm','--name',pgName,'-e','POSTGRES_PASSWORD','-p','127.0.0.1::5432','postgres:18-alpine'],temp,{...process.env,POSTGRES_PASSWORD:pgPassword});
  let pgReady=false;
  // The entrypoint starts a temporary socket-only server for initialization.
  // TCP readiness selects the final server after that temporary process exits.
  for(let i=0;i<60;i++){try{sync('docker',['exec',pgName,'pg_isready','-h','127.0.0.1','-U','postgres']);pgReady=true;break}catch{}await sleep(500)}
  if(!pgReady)throw Error('PostgreSQL did not become ready');
  const pgPort=sync('docker',['port',pgName,'5432/tcp']).split(':').at(-1);
  const testEnv={...process.env,TEST_DATABASE_URL:`postgres://postgres:${pgPassword}@127.0.0.1:${pgPort}/postgres?sslmode=disable`};
  const sqlFiles = dir => fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(e=>
    e.isDirectory()?sqlFiles(path.join(dir,e.name)):e.name.endsWith('.sql')?[path.join(dir,e.name)]:[]);
  sync('docker',['exec','-i',pgName,'psql','-U','postgres','-v','ON_ERROR_STOP=1'],temp,process.env,'CREATE DATABASE cash_reporting_test;');
  const cashDdl=sqlFiles(path.join(sources['cash-db'].directory,'01_ddl')).map(p=>fs.readFileSync(p,'utf8')).join('\n');
  const cashPassword=randomBytes(24).toString('hex');
  sync('docker',['exec','-i',pgName,'psql','-U','postgres','-d','cash_reporting_test','-v','ON_ERROR_STOP=1'],temp,process.env,
    cashDdl+`\nCREATE ROLE cash_reporting_app LOGIN PASSWORD '${cashPassword}';\nGRANT USAGE ON SCHEMA cash_reporting TO cash_reporting_app;\nGRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA cash_reporting TO cash_reporting_app;\nGRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA cash_reporting TO cash_reporting_app;`);
  const cashEnv={...process.env,DB_URL:`jdbc:postgresql://127.0.0.1:${pgPort}/cash_reporting_test`,DB_USER:'cash_reporting_app',DB_PASSWORD:cashPassword};
  const mongoName=`week13-mongo-${randomBytes(5).toString('hex')}`;containers.push(mongoName);
  sync('docker',['run','-d','--rm','--name',mongoName,'-p','127.0.0.1::27017','mongo:8.0']);
  const mongoPort=sync('docker',['port',mongoName,'27017/tcp']).split(':').at(-1);
  const identityEnv={...process.env,TEST_DATABASE_URL:`mongodb://127.0.0.1:${mongoPort}/week13_session1`};
  if (!contractOnly) {
  const checks=await Promise.all([
    resumed('security')?0:run('security','go',['test','-count=1','-v','./...'],sources.security.directory,testEnv),
    resumed('relay')?0:run('relay','go',['test','-count=1','-v','./...'],sources.relay.directory),
    resumed('gateway')?0:run('gateway',bash,['tests/smoke.sh'],sources.gateway.directory,{...process.env,MSYS_NO_PATHCONV:'1'})
  ]);
  // Bound memory use: only one Maven/Surefire pair runs at a time.
  checks.push(await javaCheck('commercial','CatalogSecurityThreatsHttpTest,CatalogHttpTest,OutboxHttpTest,Rs256VerifierExceptionalAccessTest'));
  checks.push(await javaCheck('cash-reporting','RestEnvelopeTest,InternalRoutesControllersTest,OutboxRelayRoutesControllersTest',cashEnv));
  checks.push(await javaCheck('identity-audit','JwtFilterTest,JwtIssuerAudienceTest,RouteAuthorizationTest',identityEnv));
  checks.push(await javaCheck('operations-cost','JwtFilterTest,RouteAuthorizationTest,InternalOutboxRouteTest,HttpShellTest'));
  if(checks.some(x=>x))throw Error('A product check failed; see evidence logs');
  if(results.find(x=>x.component==='security').skippedGoTests)throw Error('Security integration tests were skipped');
  }

  // The additional tests run only in exported snapshots, never in product checkouts.
  const javaDir=path.join(sources.commercial.directory,'commercial-reservation-app/src/test/java/co/edu/corhuila/multi_tour/commercial_reservation/app');
  fs.copyFileSync(path.join(here,'Session1LiveServerTest.java'),path.join(javaDir,'Session1LiveServerTest.java'));
  const fixture=path.join(javaDir,'CatalogHttpFixture.java');
  fs.writeFileSync(fixture,fs.readFileSync(fixture,'utf8').replace('Clock.fixed(TestJwtKeys.NOW, ZoneOffset.UTC)','Clock.systemUTC()'));
  fs.copyFileSync(path.join(here,'session1_e2e_test.go'),path.join(sources.security.directory,'cmd/security/session1_e2e_test.go'));
  const keys=path.join(temp,'keys');fs.mkdirSync(keys);
  const pair=generateKeyPairSync('rsa',{modulusLength:2048,privateKeyEncoding:{type:'pkcs8',format:'pem'},publicKeyEncoding:{type:'spki',format:'pem'}});
  fs.writeFileSync(path.join(keys,'private.pem'),pair.privateKey,{mode:0o600});fs.writeFileSync(path.join(keys,'public.pem'),pair.publicKey);
  sync(openssl,['req','-x509','-newkey','rsa:2048','-nodes','-days','1','-keyout',path.join(keys,'tls.key'),'-out',path.join(keys,'tls.crt'),'-subj','/CN=localhost','-addext','subjectAltName=DNS:localhost,IP:127.0.0.1']);
  const liveEnv={...process.env,SESSION1_DIR:temp,JWT_PUBLIC_KEY_FILE:path.join(keys,'public.pem')};
  const startJava=()=>maven('Session1LiveServerTest',sources.commercial.directory,liveEnv);
  let java=startJava();const javaPort=await waitFile(path.join(temp,'java-ready'),java);
  const go=start('go',['test','-count=1','-v','./cmd/security','-run','^TestSession1LiveSecurity$','-timeout','15m'],sources.security.directory,{...testEnv,SESSION1_DIR:temp});
  const securityPort=await waitFile(path.join(temp,'security-ready'),go);
  const gateway=sources.gateway.directory;
  const upstreamHost=process.platform==='win32'?'host.docker.internal':sync('docker',['network','inspect','bridge','--format','{{(index .IPAM.Config 0).Gateway}}']);
  for(const [file,host,port] of [['security.conf','multi-tour-security:8086',securityPort],['commercial-reservation.conf','multi-tour-commercial-reservation-api:8083',javaPort]]) {
    const p=path.join(gateway,'nginx/routes',file);fs.writeFileSync(p,fs.readFileSync(p,'utf8').replaceAll(host,`${upstreamHost}:${port}`));
  }
  const server=path.join(gateway,'nginx/conf.d/20-server.conf');
  fs.writeFileSync(server,fs.readFileSync(server,'utf8').replace('listen 8080;','listen 8443 ssl;\n    ssl_certificate /tmp/tls.crt;\n    ssl_certificate_key /tmp/tls.key;\n    ssl_protocols TLSv1.2 TLSv1.3;'));
  // Locations that add headers must repeat HSTS under NGINX inheritance rules.
  const headers=path.join(gateway,'nginx/snippets/headers.conf');fs.appendFileSync(headers,'\nadd_header Strict-Transport-Security "max-age=31536000" always;\n');
  const gwName=`week13-live-${randomBytes(5).toString('hex')}`;containers.push(gwName);
  const network=`${gwName}-network`;networks.push(network);sync('docker',['network','create',network]);
  images.push(gwName);sync('docker',['build','-q','-f','deploy/Dockerfile','-t',gwName,'.'],gateway);
  sync('docker',['create','--name',gwName,'--network',network,'-p','127.0.0.1::8443','-e','ALLOWED_ORIGIN=https://localhost',gwName]);
  for(const file of ['tls.crt','tls.key'])sync('docker',['cp',path.join(keys,file),`${gwName}:/tmp/${file}`]);
  sync('docker',['start',gwName]);
  if(sync('docker',['inspect','--format','{{.State.Running}}',gwName])!=='true')throw Error(redact(sync('docker',['logs',gwName])));
  const gwPort=sync('docker',['port',gwName,'8443/tcp']).split(':').at(-1);
  fs.writeFileSync(path.join(temp,'gateway-ready'),`https://localhost:${gwPort}`);
  await waitFile(path.join(temp,'rotate-ready'),go,300);
  fs.writeFileSync(path.join(temp,'java-stop'),'stop');await java.done;
  fs.unlinkSync(path.join(temp,'java-stop'));fs.unlinkSync(path.join(temp,'java-ready'));
  java=startJava();const secondPort=await waitFile(path.join(temp,'java-ready'),java);
  const route=path.join(gateway,'nginx/routes/commercial-reservation.conf');fs.writeFileSync(route,fs.readFileSync(route,'utf8').replaceAll(`${upstreamHost}:${javaPort}`,`${upstreamHost}:${secondPort}`));
  sync('docker',['cp',route,`${gwName}:/etc/nginx/routes/commercial-reservation.conf`]);
  sync('docker',['exec',gwName,'nginx','-s','reload']);fs.writeFileSync(path.join(temp,'rotation-ready'),'ready');
  const code=await go.done;save('live-integration',go,code);
  fs.writeFileSync(path.join(evidence,'live-gateway.log'),redact(sync('docker',['logs',gwName]))+'\n');
  fs.writeFileSync(path.join(temp,'java-stop'),'stop');const javaCode=await java.done;save('live-java-server',java,javaCode);
  if(code||javaCode)throw Error('Live integration failed');
  if(results.find(x=>x.component==='live-integration').passedSubtests < 29)throw Error('Cross-service contract coverage decreased');
  fs.writeFileSync(path.join(evidence,'completion.json'),JSON.stringify({checkedAt:new Date().toISOString(),status:'passed',results,scope:contractOnly?'security producer to commercial consumer contracts over HTTPS; no production deployment':'session-1 local integration; no production deployment'},null,2)+'\n');
  console.log('SESSION 1: ALL CHECKS PASSED, with no skipped security integration tests.');
} catch(error) { console.error(redact(error.message));console.error(`Diagnostic directory: ${temp}`);process.exitCode=1; }
finally {
  for(const job of children)if(job.child.exitCode===null) {
    try {if(process.platform==='win32')sync('taskkill',['/PID',String(job.child.pid),'/T','/F']);else process.kill(-job.child.pid,'SIGTERM')}catch{}
  }
  for(const name of containers.reverse())try{sync('docker',['rm','-f',name])}catch{}
  for(const name of networks.reverse())try{sync('docker',['network','rm',name])}catch{}
  for(const name of images.reverse())try{sync('docker',['rmi',name])}catch{}
  const ownedTemp=path.dirname(path.resolve(temp))===path.resolve(os.tmpdir())&&path.basename(temp).startsWith('week13-security-');
  if(!ownedTemp)throw Error('Refusing cleanup outside the generated test directory');
  if(fs.existsSync(path.join(temp,'keys')))fs.rmSync(path.join(temp,'keys'),{recursive:true,force:true});
  // Keep only redacted evidence; transient keys, databases and source exports are discarded.
  if(!process.exitCode)fs.rmSync(temp,{recursive:true,force:true});
}
