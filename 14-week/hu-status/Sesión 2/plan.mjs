import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {checked, readJson, writeJson} from '../../../13-week/hu-status/Sesión 2/tools.mjs';
export const services = ['security', 'commercial', 'identity-audit', 'operations-cost', 'cash-reporting', 'relay'];
export function validateBaselines(before, after) {
  for (const name of services) {
    const current = after[name], previous = before[name];
    if (current !== null && (!Number.isFinite(current) || current < 0 || current > 100)) throw new Error(`Invalid coverage baseline ${name}`);
    if (Number.isFinite(previous) && (current === null || current < previous)) throw new Error(`Coverage baseline decreased: ${name}`);
  }
  if (after.security < 93) throw new Error('Security coverage must retain the measured 93% baseline.');
}
export function select(paths, changedLocks = [], force = false) {
  const selected = new Set(); let contracts = false, smoke = false;
  const affect = name => {
    if (name === 'security') services.forEach(item => selected.add(item));
    else if (name === 'gateway') { /* gateway is checked by smoke */ }
    else { selected.add(name); if (name !== 'relay') selected.add('relay'); }
    contracts = smoke = true;
  };
  if (force) services.forEach(name => affect(name));
  for (const name of changedLocks) affect(name);
  for (const file of paths) {
    if (/sources-lock\.json$/.test(file)) continue; // actual object changes are compared separately
    if (/\.(md|png|svg|jpg|pdf)$/.test(file) || /^14-week\/hu-status\/Sesión [12]\/evidence\//.test(file)) continue;
    const component = /multi-tour-(security|commercial-reservation-api|identity-audit-api|operations-cost-api|cash-reporting-api|worker-event-relay|api-gateway)(?:\/|$)/.exec(file)?.[1];
    if (component) affect(({security: 'security', 'commercial-reservation-api': 'commercial', 'identity-audit-api': 'identity-audit', 'operations-cost-api': 'operations-cost', 'cash-reporting-api': 'cash-reporting', 'worker-event-relay': 'relay', 'api-gateway': 'gateway'})[component]);
    else services.forEach(name => affect(name)); // shared or unknown executable inputs fail closed
  }
  return {services: services.filter(name => selected.has(name)), contracts, smoke};
}
const here = path.dirname(fileURLToPath(import.meta.url));
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const event = process.env.GITHUB_EVENT_NAME;
  const metadata = process.env.GITHUB_EVENT_PATH ? readJson(process.env.GITHUB_EVENT_PATH) : {};
  const force = event !== 'pull_request';
  const base = metadata.pull_request?.base.sha, head = metadata.pull_request?.head.sha;
  const baselinePath = '14-week/hu-status/Sesión 2/coverage-baselines.json';
  const before = base ? (() => { try { return JSON.parse(checked('git', ['show', `${base}:${baselinePath}`], here)); } catch { return {}; } })() : {};
  validateBaselines(before, readJson(path.join(here, 'coverage-baselines.json')));
  const paths = force ? [] : checked('git', ['diff', '--name-only', '--no-renames', base, head], here).split(/\r?\n/).filter(Boolean);
  const changed = new Set();
  for (const file of paths.filter(file => /sources-lock\.json$/.test(file))) {
    const before = (() => { try { return JSON.parse(checked('git', ['show', `${base}:${file}`], here)); } catch { return {}; } })();
    const after = (() => { try { return JSON.parse(checked('git', ['show', `${head}:${file}`], here)); } catch { return {}; } })();
    for (const name of new Set([...Object.keys(before), ...Object.keys(after)])) if (JSON.stringify(before[name]) !== JSON.stringify(after[name])) {
      const owner = {'cash-db': 'cash-reporting', 'commercial-db': 'commercial', 'identity-db': 'identity-audit', 'operations-db': 'operations-cost'}[name] || name;
      if (!services.includes(owner) && owner !== 'gateway') throw new Error(`Unknown lock entry ${name}`);
      changed.add(owner);
    }
  }
  const result = {...select(paths, [...changed], force), paths, changedLocks: [...changed], forced: force};
  const output = process.argv[2] || path.join(here, 'evidence/plan.json'); writeJson(output, result);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT,
    `matrix=${JSON.stringify({service: result.services.length ? result.services : ['none']})}\nservices=${result.services.length > 0}\ncontracts=${result.contracts}\nsmoke=${result.smoke}\n`);
  console.log(JSON.stringify(result));
}
