import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {generateKeyPairSync, randomBytes} from 'node:crypto';
import {run, writeJson} from '../../../13-week/hu-status/Sesión 2/tools.mjs';

const source = path.resolve(process.argv[2]);
const output = path.resolve(process.argv[3]);
const image = process.argv[4];
if (!image || !/:[A-Za-z0-9][A-Za-z0-9_.-]+$/.test(image) || image.endsWith(':latest')) throw new Error('An explicit image tag is required.');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'week14-preview-'));
fs.chmodSync(directory, 0o755);
const prefix = `week14-${randomBytes(6).toString('hex')}`;
const database = `${prefix}-pg`, service = `${prefix}-security`;
const password = randomBytes(24).toString('hex');
const appPassword = randomBytes(24).toString('hex');
const env = {...process.env, POSTGRES_PASSWORD: password,
  DATABASE_URL: `postgres://security_app:${appPassword}@${database}:5432/postgres?sslmode=disable`};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let deployment;
function docker(args) {
  const result = run('docker', args, source, env);
  if (result.code) throw new Error(`Docker operation ${args[0]} failed.`);
  return result.output.trim();
}
try {
  fs.mkdirSync(output, {recursive: true});
  const id = docker(['image', 'inspect', image, '--format', '{{.Id}}']);
  docker(['network', 'create', prefix]);
  docker(['run', '-d', '--rm', '--name', database, '--network', prefix,
    '-e', 'POSTGRES_PASSWORD', 'postgres:18-alpine']);
  let ready = false;
  for (let i = 0; i < 120; i++) {
    if (run('docker', ['exec', database, 'pg_isready', '-h', '127.0.0.1', '-U', 'postgres'], source).code === 0) { ready = true; break; }
    await sleep(500);
  }
  if (!ready) throw new Error('Preview PostgreSQL is not ready.');
  // Disposable exercise setup only; existing QA/production migrations and volumes are never touched.
  execFileSync('docker', ['exec', '-i', database, 'psql', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1'], {
    input: `CREATE ROLE security_app LOGIN PASSWORD '${appPassword}';`, encoding: 'utf8', windowsHide: true});
  const keys = generateKeyPairSync('rsa', {modulusLength: 2048,
    privateKeyEncoding: {type: 'pkcs8', format: 'pem'}, publicKeyEncoding: {type: 'spki', format: 'pem'}});
  fs.writeFileSync(path.join(directory, 'private.pem'), keys.privateKey, {mode: 0o644});
  fs.writeFileSync(path.join(directory, 'public.pem'), keys.publicKey, {mode: 0o644});
  // Parent directory remains private; the non-root container gets a read-only mount.
  docker(['run', '-d', '--rm', '--name', service, '--network', prefix, '-e', 'DATABASE_URL',
    '-e', 'JWT_PRIVATE_KEY_FILE=/run/keys/private.pem', '-e', 'JWT_PUBLIC_KEY_FILE=/run/keys/public.pem',
    '--mount', `type=bind,source=${directory},target=/run/keys,readonly`, image]);
  let healthy = false;
  for (let i = 0; i < 60; i++) {
    if (run('docker', ['exec', service, 'wget', '-qO-', 'http://127.0.0.1:8086/health'], source).code === 0) { healthy = true; break; }
    await sleep(1000);
  }
  if (!healthy) throw new Error('Tagged image failed its health probe.');
  const user = docker(['inspect', service, '--format', '{{.Config.User}}']);
  if (!user || user === '0' || user === 'root') throw new Error('Preview image must run as non-root.');
  const bindings = docker(['inspect', service, '--format', '{{json .HostConfig.PortBindings}}']);
  if (!['{}', 'null'].includes(bindings)) throw new Error('Business API must not publish host ports.');
  const actual = docker(['inspect', service, '--format', '{{.Image}}']);
  if (actual !== id) throw new Error('Running container differs from the selected tagged image.');
  const denied = run('docker', ['exec', service, 'wget', '-S', '-O-', 'http://127.0.0.1:8086/accounts'], source);
  if (!/HTTP\/1\.[01] 401/.test(denied.output)) throw new Error('Unauthenticated account access must return 401.');
  deployment = {checkedAt: new Date().toISOString(), status: 'passed',
    environment: 'isolated disposable exercise; no QA/production deployment', image, imageId: id,
    runtimeUser: user, hostPortBindings: bindings, health: 'passed', unauthenticatedAccounts: 401,
    cleanup: 'containers/network/temporary keys removed in finally'};
} finally {
  run('docker', ['rm', '-f', service, database], source);
  run('docker', ['network', 'rm', prefix], source);
  if (path.dirname(directory) !== path.resolve(os.tmpdir()) || !path.basename(directory).startsWith('week14-preview-')) throw new Error('Unsafe temporary directory.');
  fs.rmSync(directory, {recursive: true, force: true});
}
if (run('docker', ['inspect', service], source).code === 0
  || run('docker', ['inspect', database], source).code === 0
  || run('docker', ['network', 'inspect', prefix], source).code === 0) throw new Error('Preview cleanup is incomplete.');
writeJson(path.join(output, 'deployment.json'), deployment);
console.log('Tagged Multi Tour image deployed; image identity, non-root user, internal port, health, 401 and cleanup verified.');
