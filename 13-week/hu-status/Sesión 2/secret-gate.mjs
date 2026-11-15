import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {checked, executable, readJson, run, writeJson} from './tools.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const sources = path.resolve(process.argv[2]);
const output = path.resolve(process.argv[3] || path.join(here, 'evidence'));
fs.mkdirSync(output, {recursive: true});
const results = [];
const reviewed = readJson(path.join(here, 'reviewed-fixtures.json'));
const common = ['--config', path.join(here, 'gitleaks.toml'), '--redact=100', '--no-banner', '--report-format=json'];

for (const name of ['commercial', 'security', 'gateway']) {
  const file = path.join(output, `secrets-${name}.json`);
  const scan = run(executable('gitleaks'), ['dir', path.join(sources, name), ...common, '--report-path', file]);
  if (![0, 1].includes(scan.code) || !fs.existsSync(file)) throw new Error(`Secret scanner failed for ${name}`);
  const findings = readJson(file);
  let reviewedCount = 0;
  for (const finding of findings) {
    const relative = path.relative(sources, finding.File).replaceAll('\\', '/');
    if (relative.startsWith('../') || path.isAbsolute(relative)) throw new Error('Scanner path is outside the source export.');
    const hash = createHash('sha256').update(fs.readFileSync(finding.File)).digest('hex');
    const benign = reviewed.some(item => item.file === relative && item.rule === finding.RuleID
      && item.line === finding.StartLine && item.sha256 === hash);
    if (benign) reviewedCount++;
  }
  results.push({target: name, findings: findings.length, reviewedFixtures: reviewedCount,
    unreviewedFindings: findings.length - reviewedCount, exitCode: findings.length === reviewedCount ? 0 : 1});
}
const repository = checked('git', ['rev-parse', '--show-toplevel'], here);
const base = checked('git', ['merge-base', 'HEAD', 'origin/main'], repository);
const historyFile = path.join(output, 'secrets-delivery-history.json');
const history = run(executable('gitleaks'), ['git', repository, `--log-opts=${base}..HEAD`,
  ...common, '--report-path', historyFile]);
if (![0, 1].includes(history.code) || !fs.existsSync(historyFile)) throw new Error('Secret scanner failed for the delivery history.');
results.push({target: 'delivery changes since origin/main', base, findings: readJson(historyFile).length,
  unreviewedFindings: readJson(historyFile).length, exitCode: history.code});
const code = results.some(result => result.exitCode !== 0) ? 1 : 0;
writeJson(path.join(output, 'secret-summary.json'), {
  checkedAt: new Date().toISOString(), scanner: 'Gitleaks 8.30.1',
  policy: 'Zero unreviewed findings. Benign fixtures require an exact file hash, line and rule match. Detected values are redacted.',
  status: code === 0 ? 'passed' : 'blocked', results
});
console.log(`Secret gate ${code === 0 ? 'passed' : 'blocked'} across ${results.length} scan targets.`);
process.exitCode = code;
