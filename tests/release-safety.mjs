import { test } from 'node:test';
import assert from 'node:assert/strict';
import siteData from '../netlify/functions/site-data.mjs';
import media from '../netlify/functions/media.mjs';

test('forhåndsvisninger kan ikke endre felles innhold eller laste opp bilder', async () => {
  const preview = { deploy: { context: 'deploy-preview' } };
  const dataResponse = await siteData(new Request('https://example.test/.netlify/functions/site-data', { method: 'PUT' }), preview);
  const imageResponse = await media(new Request('https://example.test/.netlify/functions/media', { method: 'POST' }), preview);
  assert.equal(dataResponse.status, 403);
  assert.equal(imageResponse.status, 403);
});

test('ugyldige bildeadresser avvises før lagring brukes', async () => {
  const response = await media(new Request('https://example.test/.netlify/functions/media?id=../x'), { deploy: { context: 'production' } });
  assert.equal(response.status, 404);
});
