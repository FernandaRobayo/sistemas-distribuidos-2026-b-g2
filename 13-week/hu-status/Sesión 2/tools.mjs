import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

export function sourceHash(file) {
  const text = fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
  return createHash('sha256').update(text).digest('hex');
}

export function reviewedFinding(finding, sources, reviewed) {
  const relative = path.relative(sources, finding.File).replaceAll('\\', '/');
  if (relative.startsWith('../') || path.isAbsolute(relative)) throw new Error('Scanner path is outside the source export.');
  const hash = sourceHash(finding.File);
  return reviewed.some(item => item.file === relative && item.rule === finding.RuleID
    && item.line === finding.StartLine && item.sha256 === hash);
}

export function run(command, args, cwd, env = process.env) {
  const result = spawnSync(command, args, {
    cwd, env, encoding: 'utf8', windowsHide: true, maxBuffer: 32 * 1024 * 1024
  });
  if (result.error) throw result.error;
  return {code: result.status ?? 2, output: result.stdout + result.stderr};
}

export function checked(command, args, cwd) {
  const result = run(command, args, cwd);
  if (result.code !== 0) throw new Error(`${command} failed with exit ${result.code}\n${result.output.slice(-2500)}`);
  return result.output.trim();
}

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}

function findMaven(directory) {
  if (!fs.existsSync(directory)) return undefined;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const full = path.join(directory, entry.name);
    if (entry.isFile() && entry.name === 'mvn.cmd' && full.includes('3.9.')) return path.dirname(path.dirname(full));
    if (entry.isDirectory()) {
      const found = findMaven(full);
      if (found) return found;
    }
  }
}

export function maven(args, cwd, env = process.env) {
  const home = process.env.MAVEN_HOME || (process.platform === 'win32'
    ? findMaven(path.join(os.homedir(), '.m2/wrapper/dists')) : undefined);
  if (!home) return run('mvn', ['-B', '-ntp', ...args], cwd, env);
  const boot = fs.readdirSync(path.join(home, 'boot')).find(name => /^plexus-classworlds.*\.jar$/.test(name));
  return run('java', ['-Xmx384m', '-classpath', path.join(home, 'boot', boot),
    `-Dclassworlds.conf=${path.join(home, 'bin/m2.conf')}`, `-Dmaven.home=${home}`,
    `-Dmaven.multiModuleProjectDirectory=${cwd}`, 'org.codehaus.plexus.classworlds.launcher.Launcher',
    '-B', '-ntp', ...args], cwd, env);
}

export function executable(name) {
  const variable = name === 'osv-scanner' ? 'OSV_SCANNER' : 'GITLEAKS';
  return process.env[variable] || name;
}
