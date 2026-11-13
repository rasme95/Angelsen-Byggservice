import { test } from 'node:test';
import assert from 'node:assert/strict';
import siteData from '../netlify/functions/site-data.mjs';
import media from '../netlify/functions/media.mjs';
import { isAdministrator, storageName } from '../netlify/lib/access.mjs';

test('kun anerkjente administratorroller gir tilgang', () => {
  assert.equal(isAdministrator({ roles: ['admin'] }), true);
  assert.equal(isAdministrator({ roles: ['administrator'] }), true);
  assert.equal(isAdministrator({ roles: ['editor'] }), false);
  assert.equal(isAdministrator(null), false);
  assert.equal(isAdministrator({ roles: 'administrator' }), false);
});

test('forhåndsvisninger bruker egne lagre uten tilgang til produksjonslagrene', () => {
  const preview = { deploy: { context: 'deploy-preview' } }, production = { deploy: { context: 'production' } };
  for (const kind of ['content', 'images']) assert.notEqual(storageName(preview, kind), storageName(production, kind));
});

test('ukjente miljøer kan ikke endre innhold eller laste opp bilder', async () => {
  const unknown = { deploy: { context: 'branch-deploy' } };
  const dataResponse = await siteData(new Request('https://example.test/.netlify/functions/site-data', { method: 'PUT' }), unknown);
  const imageResponse = await media(new Request('https://example.test/.netlify/functions/media', { method: 'POST' }), unknown);
  assert.equal(dataResponse.status, 403);
  assert.equal(imageResponse.status, 403);
});

test('ugyldige bildeadresser avvises før lagring brukes', async () => {
  const response = await media(new Request('https://example.test/.netlify/functions/media?id=../x'), { deploy: { context: 'production' } });
  assert.equal(response.status, 404);
});
