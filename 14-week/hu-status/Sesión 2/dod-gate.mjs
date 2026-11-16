import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {readJson, writeJson} from '../../../13-week/hu-status/Sesión 2/tools.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const bytes = Buffer.from(fs.readFileSync(path.join(here, 'definition-of-done.source.md'), 'utf8').replaceAll('\r\n', '\n'));
const policy = readJson(path.join(here, 'dod-policy.json'));
const blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
assert.equal(blob, policy.source.blob, 'The original DoD snapshot changed without review.');
const criteria = [...bytes.toString('utf8').matchAll(/^- \[ \] (.+)$/gm)].map(match => match[1].replace(/\r$/, ''));
assert.equal(policy.items.length, criteria.length, 'DoD mapping is incomplete.');
assert.equal(new Set(policy.items.map(item => item.id)).size, criteria.length, 'Duplicate DoD item.');
policy.items.forEach((item, index) => {
  assert.equal(item.criterion, criteria[index], `Changed or unmapped criterion ${item.id}`);
  assert.ok(item.gates.length > 0 && item.gates.every(gate => policy.gateDefinitions[gate]), `Undefined blocking gate ${item.id}`);
  assert.ok(item.gates.includes('branch-review') && item.reviewEvidence, `Missing semantic review ${item.id}`);
});
writeJson(process.argv[2] || path.join(here, 'evidence/dod-audit.json'), {status: 'passed', mappedCriteria: criteria.length,
  sourceBlob: blob, scope: 'Completeness of DoD traceability; story acceptance remains subject to its evidence and required branch review.'});
console.log(`All ${criteria.length} DoD criteria map to defined blocking gates and mandatory branch review.`);
