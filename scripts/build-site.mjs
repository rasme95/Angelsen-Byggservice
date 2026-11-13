import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const path of ['index', 'index.html', 'assets', 'auth', 'prosjekter', 'Bilder']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
console.log('Nettsiden er klargjort i dist/.');
