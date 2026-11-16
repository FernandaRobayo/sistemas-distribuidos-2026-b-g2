import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {checked, readJson, writeJson} from '../../../13-week/hu-status/Sesión 2/tools.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const destination = path.resolve(process.argv[2]);
const component = process.argv[3] || 'all';
const lock = readJson(process.env.WORKSHOP_SOURCES_LOCK || path.join(here, 'sources-lock.json'));
const databases = {commercial: 'commercial-db', 'identity-audit': 'identity-db', 'operations-cost': 'operations-db', 'cash-reporting': 'cash-db'};
const names = component === 'all' ? Object.keys(lock) : [component, databases[component]].filter(Boolean);
if (names.some(name => !lock[name])) throw new Error('Unknown component.');
fs.mkdirSync(destination, {recursive: true});
if (fs.readdirSync(destination).length) throw new Error('Source destination must be empty.');
const manifest = {};
for (const name of names) {
  const item = lock[name];
  let repository = process.env.WORKSHOP_PRODUCT_ROOT && path.join(process.env.WORKSHOP_PRODUCT_ROOT, item.repository);
  if (!repository) {
    repository = path.join(destination, '.repositories', name);
    fs.mkdirSync(repository, {recursive: true});
    checked('git', ['init', repository]);
    checked('git', ['-C', repository, 'remote', 'add', 'origin', `https://github.com/code-corhuila/${path.basename(item.repository)}.git`]);
    checked('git', ['-C', repository, 'fetch', '--depth=1', 'origin', item.revision]);
  }
  const directory = path.join(destination, name), archive = path.join(destination, `${name}.tar`);
  fs.mkdirSync(directory);
  checked('git', ['-c', 'core.autocrlf=false', '-C', repository, 'archive', '--format=tar', `--output=${archive}`, item.revision]);
  checked('tar', ['-xf', archive, '-C', directory]);
  fs.unlinkSync(archive);
  manifest[name] = item;
}
writeJson(path.join(destination, 'sources.json'), manifest);
console.log(`Exported ${names.join(', ')} at the locked revisions.`);
