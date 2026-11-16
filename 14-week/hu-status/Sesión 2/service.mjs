import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import {run, maven, readJson, writeJson} from '../../../13-week/hu-status/Sesión 2/tools.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const name = process.argv[2], sources = path.resolve(process.argv[3]), output = path.resolve(process.argv[4]);
const source = path.join(sources, name), baseline = readJson(path.join(here, 'coverage-baselines.json'))[name];
if (!['security', 'commercial', 'identity-audit', 'operations-cost', 'cash-reporting', 'relay'].includes(name)) throw new Error('Unknown service.');
fs.mkdirSync(output, {recursive: true});
const prefix = `week14-${name}-${randomBytes(5).toString('hex')}`;
const containers = [], env = {...process.env, MSYS_NO_PATHCONV: '1', MAVEN_OPTS: '-Xmx512m'};
const redact = text => text.replace(/(?:jdbc:)?(?:postgres(?:ql)?|mongodb):\/\/[^\s"'<>]+/gi, '[TEST_DATABASE_URL]');
const walk = directory => fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry =>
  entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function command(label, tool, args) {
  const result = run(tool, args, source, env);
  fs.writeFileSync(path.join(output, `${label}.log`), redact(result.output));
  if (result.code) throw new Error(`${label} failed; inspect its redacted log.`);
  return result.output.trim();
}
let coverage, tests = 0, skipped = 0, coverageUnit;
try {
  if (name === 'security') {
    command('quality', 'node', [path.join(here, '../Sesión 1/quality.mjs'), source, output]);
    const result = readJson(path.join(output, 'quality-summary.json'));
    coverage = result.coveragePercent; tests = result.passedTestEvents; skipped = result.skippedTestEvents;
    coverageUnit = 'statements';
  } else if (name === 'relay') {
    command('build', 'go', ['build', './...']);
    if (command('format', 'gofmt', ['-l', '.'])) throw new Error('Unformatted source.');
    command('static', 'go', ['vet', './...']);
    const text = command('tests', 'go', ['test', '-count=1', '-json', `-coverprofile=${path.join(output, 'coverage.out')}`, './...']);
    const events = text.split(/\r?\n/).filter(line => line.startsWith('{')).map(line => JSON.parse(line));
    tests = events.filter(event => event.Action === 'pass' && event.Test).length;
    skipped = events.filter(event => event.Action === 'skip' && event.Test).length;
    coverage = Number(command('coverage', 'go', ['tool', 'cover', `-func=${path.join(output, 'coverage.out')}`]).match(/total:\s+\(statements\)\s+([\d.]+)%/)?.[1]);
    coverageUnit = 'statements';
  } else {
    const databaseKey = {'identity-audit': 'identity-db', 'operations-cost': 'operations-db', commercial: 'commercial-db', 'cash-reporting': 'cash-db'}[name];
    const dbSource = path.join(sources, databaseKey);
    if (['identity-audit', 'operations-cost'].includes(name)) {
      const script = 'scripts/prepare-test-db.sh';
      containers.push(prefix);
      Object.assign(env, {TEST_DB_NAME: prefix, DB_REPO: dbSource,
        DB_REPO_REF: readJson(path.join(sources, 'sources.json'))[databaseKey].revision,
        MONGO_IMAGE: 'public.ecr.aws/docker/library/mongo:8.0.32', LIQUIBASE_BASE: 'ghcr.io/liquibase/liquibase:5.0.4'});
      env.TEST_DATABASE_URL = command('database-setup', 'sh', [script, 'up']).split(/\r?\n/).at(-1);
    } else {
      containers.push(prefix);
      const password = randomBytes(24).toString('hex'); env.POSTGRES_PASSWORD = password;
      command('database-start', 'docker', ['run', '-d', '--rm', '--name', prefix, '-e', 'POSTGRES_PASSWORD', '-p', '127.0.0.1::5432', 'postgres:18-alpine']);
      let ready = false;
      for (let i = 0; i < 120; i++) {
        if (run('docker', ['exec', prefix, 'pg_isready', '-h', '127.0.0.1', '-U', 'postgres'], source).code === 0) { ready = true; break; }
        await sleep(500);
      }
      if (!ready) throw new Error('PostgreSQL is not ready.');
      const port = command('database-port', 'docker', ['port', prefix, '5432/tcp']).split(':').at(-1);
      const domain = name === 'commercial' ? 'commercial_reservation' : 'cash_reporting';
      const sql = walk(path.join(dbSource, '01_ddl')).filter(file => file.endsWith('.sql')).sort().map(file => fs.readFileSync(file, 'utf8')).join('\n');
      execFileSync('docker', ['exec', '-i', prefix, 'psql', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1'], {
        input: `CREATE EXTENSION IF NOT EXISTS pgcrypto;\n${sql}\nCREATE ROLE ${domain}_app LOGIN PASSWORD '${password}';\nGRANT USAGE ON SCHEMA ${domain} TO ${domain}_app;\nGRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA ${domain} TO ${domain}_app;\nGRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA ${domain} TO ${domain}_app;`,
        encoding: 'utf8', windowsHide: true, maxBuffer: 16 * 1024 * 1024});
      Object.assign(env, {TEST_DATABASE_URL: `jdbc:postgresql://127.0.0.1:${port}/postgres`,
        TEST_DATABASE_USER: `${domain}_app`, TEST_DATABASE_PASSWORD: password,
        DB_URL: `jdbc:postgresql://127.0.0.1:${port}/postgres`, DB_USER: `${domain}_app`, DB_PASSWORD: password});
    }
    const build = maven(['org.jacoco:jacoco-maven-plugin:0.8.14:prepare-agent', 'verify', 'org.jacoco:jacoco-maven-plugin:0.8.14:report'], source, env);
    fs.writeFileSync(path.join(output, 'verify.log'), redact(build.output));
    if (build.code) throw new Error('mvn verify failed; inspect verify.log.');
    const files = walk(source);
    const reports = files.filter(file => /surefire-reports[\\/]TEST-.*\.xml$/.test(file));
    for (const file of reports) {
      const suite = fs.readFileSync(file, 'utf8').match(/<testsuite\b[^>]+>/)?.[0] || '';
      tests += Number(suite.match(/\btests="(\d+)"/)?.[1] || 0);
      skipped += Number(suite.match(/\bskipped="(\d+)"/)?.[1] || 0);
    }
    if (!reports.some(file => file.includes(name === 'commercial' ? 'CatalogContractTest' : 'ContractGateTest'))) throw new Error('API First contract gate report is absent.');
    let covered = 0, missed = 0;
    for (const file of files.filter(file => /target[\\/]site[\\/]jacoco[\\/]jacoco.xml$/.test(file))) {
      const counter = [...fs.readFileSync(file, 'utf8').matchAll(/<counter type="INSTRUCTION" missed="(\d+)" covered="(\d+)"\/>/g)].at(-1);
      if (counter) { missed += Number(counter[1]); covered += Number(counter[2]); }
    }
    coverage = Math.floor(1000 * covered / (covered + missed)) / 10; coverageUnit = 'instructions';
  }
  if (!tests || skipped) throw new Error(`Expected executed tests and zero skipped, got ${tests} / ${skipped}.`);
  if (!Number.isFinite(coverage)) throw new Error('Coverage report is missing or invalid.');
  const status = baseline === null ? 'baseline-required' : coverage < baseline ? 'blocked' : 'passed';
  writeJson(path.join(output, 'service-summary.json'), {name, status, checkedAt: new Date().toISOString(), tests, skipped,
    coverage, coverageUnit, baseline, sources: readJson(path.join(sources, 'sources.json'))});
  if (status !== 'passed') throw new Error(`${status}: measured coverage ${coverage}%, baseline ${baseline}.`);
  console.log(`${name}: ${tests} tests, zero skipped; coverage ${coverage}% ${coverageUnit}.`);
} catch (error) {
  if (!fs.existsSync(path.join(output, 'service-summary.json'))) writeJson(path.join(output, 'service-summary.json'), {name, status: 'blocked', reason: redact(error.message)});
  console.error(redact(error.message)); process.exitCode = 1;
} finally {
  for (const container of containers) run('docker', ['rm', '-f', container], source);
}
