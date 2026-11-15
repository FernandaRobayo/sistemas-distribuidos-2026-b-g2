import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {executable, run, writeJson} from './tools.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'multi-tour-session2-selftest-'));
const output = path.resolve(process.argv[2] || path.join(here, 'evidence'));
const results = [];

function expect(name, expected, command, args) {
  const observed = run(command, args);
  results.push({name, expectedExitCode: expected, observedExitCode: observed.code});
  if (observed.code !== expected) throw new Error(`Gate self-test failed for ${name}. Exit ${observed.code}.`);
}

function bom(name, purl) {
  const file = path.join(temporary, `${name}.cdx.json`);
  writeJson(file, {bomFormat: 'CycloneDX', specVersion: '1.5', version: 1,
    components: [{type: 'library', name, version: '1.0.0', purl}]});
  return file;
}

try {
  const clean = path.join(temporary, 'clean');
  const leak = path.join(temporary, 'leak');
  fs.mkdirSync(clean);
  fs.mkdirSync(leak);
  fs.writeFileSync(path.join(clean, 'README.md'), 'Public configuration with no credentials.\n');
  // Assemble an inert test credential at runtime so the repository contains no token fixture.
  const fake = ['gh', 'p_', randomBytes(18).toString('hex')].join('');
  fs.writeFileSync(path.join(leak, 'test.env'), `GITHUB_TOKEN=${fake}\n`, {mode: 0o600});
  const flags = ['--config', path.join(here, 'gitleaks.toml'), '--redact=100', '--no-banner'];
  expect('clean source passes secret scanning', 0, executable('gitleaks'), ['dir', clean, ...flags]);
  expect('new synthetic credential blocks secret scanning', 1, executable('gitleaks'), ['dir', leak, ...flags]);

  const cleanBom = bom('gate-clean-fixture', 'pkg:maven/org.example.securitygate/gate-clean-fixture@1.0.0');
  const vulnerableBom = bom('log4j-core', 'pkg:maven/org.apache.logging.log4j/log4j-core@2.14.1');
  const osvFlags = ['scan', 'source', '--config', path.join(here, 'osv-scanner.toml'), '--format=json'];
  expect('synthetic dependency with no advisory passes', 0, executable('osv-scanner'), [...osvFlags, '--lockfile', cleanBom]);
  expect('known vulnerable Log4j fixture blocks dependency scanning', 1, executable('osv-scanner'), [...osvFlags, '--lockfile', vulnerableBom]);
  writeJson(path.join(output, 'gate-self-test.json'), {checkedAt: new Date().toISOString(), status: 'passed', results});
  console.log('All four security-gate self-tests passed.');
} finally {
  const owned = path.dirname(path.resolve(temporary)) === path.resolve(os.tmpdir())
    && path.basename(temporary).startsWith('multi-tour-session2-selftest-');
  if (!owned) throw new Error('Refusing cleanup outside the generated fixture directory.');
  fs.rmSync(temporary, {recursive: true, force: true});
}
