import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {executable, maven, readJson, run, writeJson} from './tools.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const sources = path.resolve(process.argv[2]);
const output = path.resolve(process.argv[3] || path.join(here, 'evidence'));
fs.mkdirSync(output, {recursive: true});
const commercial = path.join(sources, 'commercial');
const generated = maven(['org.cyclonedx:cyclonedx-maven-plugin:2.9.1:makeAggregateBom',
  '-DincludeTestScope=false', '-DincludeProvidedScope=false', '-DincludeSystemScope=false',
  '-DoutputFormat=json'], commercial);
fs.writeFileSync(path.join(output, 'sbom-generation.log'), generated.output);
if (generated.code !== 0) throw new Error('Maven could not resolve the commercial runtime dependency graph.');
const bomFile = path.join(commercial, 'target/bom.json');
const bom = readJson(bomFile);
if (!Array.isArray(bom.components) || bom.components.length === 0) throw new Error('The dependency inventory is empty.');
const exportedBom = path.join(output, 'commercial.bom.cdx.json');
fs.copyFileSync(bomFile, exportedBom);

const resultFile = path.join(output, 'dependencies.json');
const scan = run(executable('osv-scanner'), ['scan', 'source',
  '--config', path.join(here, 'osv-scanner.toml'), '--format=json', '--all-packages',
  '--output-file', resultFile, '--lockfile', exportedBom,
  '--lockfile', path.join(sources, 'security/go.mod')]);
fs.writeFileSync(path.join(output, 'dependency-scan.log'), scan.output);
if (![0, 1].includes(scan.code) || !fs.existsSync(resultFile)) throw new Error('Dependency scanner failed to complete.');
const report = readJson(resultFile);
if (!Array.isArray(report.results)) throw new Error('Invalid dependency scanner report.');
const findings = [];
for (const group of report.results) {
  for (const entry of group.packages || []) {
    for (const vulnerability of entry.vulnerabilities || []) {
      const affected = (vulnerability.affected || []).filter(item => item.package?.name === entry.package.name);
      const fixedVersions = [...new Set(affected.flatMap(item => (item.ranges || [])
        .flatMap(range => (range.events || []).filter(event => event.fixed).map(event => event.fixed))))];
      findings.push({package: entry.package, id: vulnerability.id, aliases: vulnerability.aliases,
        summary: vulnerability.summary, severity: vulnerability.database_specific?.severity,
        severityVectors: vulnerability.severity, fixedVersions,
        url: `https://osv.dev/${vulnerability.id}`});
    }
  }
}
writeJson(path.join(output, 'dependency-summary.json'), {
  checkedAt: new Date().toISOString(), scanner: 'OSV-Scanner 2.7.1', sources: readJson(path.join(sources, 'sources.json')),
  policy: 'Every reported vulnerability blocks CI. Scanner errors also fail the job.',
  runtimeBomComponents: bom.components.length, scannerExitCode: scan.code,
  status: scan.code === 0 ? 'passed' : 'blocked', findings
});
console.log(`Dependency gate ${scan.code === 0 ? 'passed' : 'blocked'} with ${findings.length} package-advisory matches.`);
process.exitCode = scan.code;
