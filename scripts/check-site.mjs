import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { Script } from 'node:vm';

const pages = ['index.html', 'prosjekter/index.html', 'auth/admin/index.html'];
const scripts = ['assets/js/shared-data.js', 'assets/js/site.js', 'assets/js/admin.js'];
let errors = 0;

for (const file of scripts) {
  try {
    new Script(readFileSync(file, 'utf8'), { filename: file });
    console.log(`OK JavaScript: ${file}`);
  } catch (error) {
    console.error(`JavaScript-feil i ${file}:\n${error.message}`);
    errors++;
  }
}

for (const page of pages) {
  if (!existsSync(page)) {
    console.error(`Mangler side: ${page}`);
    errors++;
    continue;
  }
  const html = readFileSync(page, 'utf8');
  for (const match of html.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
    const ref = match[1];
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#|\/)/i.test(ref)) continue;
    const path = ref.split(/[?#]/, 1)[0];
    try {
      if (path && !existsSync(resolve(dirname(page), decodeURIComponent(path)))) {
        console.error(`${page}: mangler lokal fil ${ref}`);
        errors++;
      }
    } catch {
      console.error(`${page}: ugyldig filreferanse ${ref}`);
      errors++;
    }
  }
  console.log(`Kontrollert lokale referanser: ${page}`);
}

if (errors) {
  console.error(`${errors} kontroll(er) feilet.`);
  process.exitCode = 1;
} else {
  console.log('Alle automatiske kontroller besto.');
}
