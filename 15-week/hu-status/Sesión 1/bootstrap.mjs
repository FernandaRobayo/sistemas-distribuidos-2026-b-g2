import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {checked, readJson, writeJson} from '../../../13-week/hu-status/Sesión 2/tools.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const sources = path.resolve(process.argv[2]);
const lock = readJson(path.join(sources, 'sources.json'));
const suffix = (process.env.GITHUB_SHA || 'local').slice(0, 12);
const images = {};
for (const [name, dockerfile] of [['cash-reporting', 'Dockerfile'], ['security', 'Dockerfile'], ['gateway', 'deploy/Dockerfile']]) {
  const tag = `multi-tour-${name}:week15-${suffix}`;
  checked('docker', ['build', '--label', `org.opencontainers.image.revision=${lock[name].revision}`, '-f', dockerfile, '-t', tag, '.'], path.join(sources, name));
  images[name] = {tag, imageId: checked('docker', ['image', 'inspect', tag, '--format', '{{.Id}}']), source: lock[name]};
}
const output = path.join(here, 'harness/target/evidence');
writeJson(path.join(output, 'images.json'), images);
writeJson(path.join(output, 'sources.json'), lock);
const env = {SOURCES_DIR: sources, CASH_IMAGE: images['cash-reporting'].tag, SECURITY_IMAGE: images.security.tag, GATEWAY_IMAGE: images.gateway.tag};
if (process.env.GITHUB_ENV) fs.appendFileSync(process.env.GITHUB_ENV, Object.entries(env).map(([key, value]) => `${key}=${value}`).join('\n') + '\n');
console.log(JSON.stringify(env));
