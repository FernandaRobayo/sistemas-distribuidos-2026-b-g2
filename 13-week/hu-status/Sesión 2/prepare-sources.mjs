import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {checked, readJson, writeJson} from './tools.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const destination = path.resolve(process.argv[2] || fs.mkdtempSync(path.join(os.tmpdir(), 'multi-tour-session2-')));
fs.mkdirSync(destination, {recursive: true});
if (fs.readdirSync(destination).length) throw new Error('Choose an empty source-export directory.');
const lock = readJson(path.join(here, '../Sesión 1/sources-lock.json'));
const manifest = {};

for (const name of ['commercial', 'security', 'gateway']) {
  const source = lock[name];
  let repository;
  if (process.env.WORKSHOP_PRODUCT_ROOT) {
    repository = path.join(process.env.WORKSHOP_PRODUCT_ROOT, source.repository);
  } else {
    repository = path.join(destination, '.repositories', name);
    fs.mkdirSync(repository, {recursive: true});
    checked('git', ['init', repository]);
    checked('git', ['-C', repository, 'remote', 'add', 'origin',
      `https://github.com/code-corhuila/${path.basename(source.repository)}.git`]);
    checked('git', ['-C', repository, 'fetch', '--depth=1', 'origin', source.revision]);
  }
  const revision = checked('git', ['-C', repository, 'rev-parse', source.revision]);
  if (revision !== source.revision) throw new Error(`Source mismatch for ${name}`);
  const directory = path.join(destination, name);
  const archive = path.join(destination, `${name}.tar`);
  fs.mkdirSync(directory);
  checked('git', ['-C', repository, 'archive', '--format=tar', `--output=${archive}`, revision]);
  checked('tar', ['-xf', archive, '-C', directory]);
  fs.unlinkSync(archive);
  manifest[name] = source;
}
writeJson(path.join(destination, 'sources.json'), manifest);
console.log(`Multi Tour source exports are ready at ${destination}`);
