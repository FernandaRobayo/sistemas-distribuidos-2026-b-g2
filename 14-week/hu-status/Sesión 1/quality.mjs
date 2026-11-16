import fs from 'node:fs';
import path from 'node:path';
import {randomBytes} from 'node:crypto';
import {run, writeJson} from '../../../13-week/hu-status/Sesión 2/tools.mjs';

const source = path.resolve(process.argv[2]);
const output = path.resolve(process.argv[3]);
fs.mkdirSync(output, {recursive: true});
const results = [];
const database = `week14-quality-${randomBytes(6).toString('hex')}`;
const password = randomBytes(24).toString('hex');
const environment = {...process.env, POSTGRES_PASSWORD: password};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function execute(name, command, args, env = environment) {
  const result = run(command, args, source, env);
  fs.writeFileSync(path.join(output, `${name}.log`), result.output.replaceAll(password, '[REDACTED]'));
  results.push({name, exitCode: result.code});
  if (result.code !== 0) throw new Error(`${name} failed; see its log.`);
  return result.output;
}
try {
  execute('build', 'go', ['build', './...']);
  const formatted = execute('format', 'gofmt', ['-l', '.']);
  if (formatted.trim()) throw new Error('gofmt reported unformatted files.');
  execute('static-analysis', 'go', ['vet', './...']);
  // Compiles production AND test packages, including static type checking, without running tests.
  execute('types', 'go', ['test', '-run=^$', './...']);
  execute('database-start', 'docker', ['run', '-d', '--rm', '--name', database,
    '-e', 'POSTGRES_PASSWORD', '-p', '127.0.0.1::5432', 'postgres:18-alpine']);
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    const probe = run('docker', ['exec', database, 'pg_isready', '-h', '127.0.0.1', '-U', 'postgres'], source);
    if (probe.code === 0) { ready = true; break; }
    await sleep(500);
  }
  if (!ready) throw new Error('PostgreSQL did not become ready.');
  const port = execute('database-port', 'docker', ['port', database, '5432/tcp']).trim().split(':').at(-1);
  const profile = path.join(output, 'coverage.out');
  const tests = execute('tests', 'go', ['test', '-count=1', '-json', '-coverpkg=./...', `-coverprofile=${profile}`, './...'],
    {...environment, TEST_DATABASE_URL: `postgres://postgres:${password}@127.0.0.1:${port}/postgres?sslmode=disable`});
  const events = tests.split(/\r?\n/).filter(line => line.startsWith('{')).map(line => JSON.parse(line));
  const passed = events.filter(event => event.Action === 'pass' && event.Test);
  const skipped = events.filter(event => event.Action === 'skip' && event.Test);
  if (!passed.length || skipped.length) throw new Error('Tests must run with zero skipped cases.');
  const coverage = execute('coverage', 'go', ['tool', 'cover', `-func=${profile}`]);
  const total = Number(coverage.match(/total:\s+\(statements\)\s+([\d.]+)%/)?.[1]);
  if (!Number.isFinite(total) || total < 93) throw new Error(`Statement coverage ${total}% is below 93%.`);
  execute('coverage-html', 'go', ['tool', 'cover', `-html=${profile}`, '-o', path.join(output, 'coverage.html')]);
  writeJson(path.join(output, 'quality-summary.json'), {checkedAt: new Date().toISOString(), status: 'passed',
    scope: 'Multi Tour security service, pinned source export', coveragePercent: total,
    minimumCoveragePercent: 93, passedTestEvents: passed.length, skippedTestEvents: skipped.length, results});
  console.log(`Quality passed: ${total}% statements, ${passed.length} test events, zero skipped.`);
} catch (error) {
  writeJson(path.join(output, 'quality-summary.json'), {checkedAt: new Date().toISOString(), status: 'blocked',
    reason: error.message, minimumCoveragePercent: 93, results});
  console.error(error.message);
  process.exitCode = 1;
} finally {
  run('docker', ['rm', '-f', database], source);
}
