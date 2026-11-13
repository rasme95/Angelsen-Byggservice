import { getStore } from '@netlify/blobs';
import { getUser, verifyRequestOrigin } from '@netlify/identity';
import { isAdministrator } from '../lib/access.mjs';

export default async (request, context) => {
  try {
    if (request.method === 'POST' && context?.deploy?.context !== 'production') return new Response('Bilder kan bare lastes opp på produksjonssiden.', { status: 403 });
    if (request.method === 'GET') {
      const id = new URL(request.url).searchParams.get('id') || '';
      if (!/^[a-f0-9-]{36}$/.test(id)) return new Response('Ikke funnet', { status: 404 });
      const store = getStore({ name: 'angelsen-images', region: 'eu-central-1', consistency: 'strong' });
      const entry = await store.getWithMetadata(id, { type: 'arrayBuffer' });
      if (!entry) return new Response('Ikke funnet', { status: 404 });
      return new Response(entry.data, { headers: { 'Content-Type': entry.metadata.type, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
    }
    if (request.method !== 'POST') return new Response('Metoden støttes ikke', { status: 405 });
    verifyRequestOrigin(request);
    const user = await getUser();
    if (!isAdministrator(user)) return new Response('Ikke tilgang', { status: 403 });
    const store = getStore({ name: 'angelsen-images', region: 'eu-central-1', consistency: 'strong' });
    if (Number(request.headers.get('content-length') || 0) > 4000000) return new Response('Bildet er for stort', { status: 413 });
    const data = new Uint8Array(await request.arrayBuffer());
    if (data.length > 4000000) return new Response('Bildet er for stort', { status: 413 });
    const jpeg = data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
    const png = data.length >= 8 && [137,80,78,71,13,10,26,10].every((v, i) => data[i] === v);
    const webp = data.length >= 12 && String.fromCharCode(...data.slice(0, 4)) === 'RIFF' && String.fromCharCode(...data.slice(8, 12)) === 'WEBP';
    const type = jpeg ? 'image/jpeg' : png ? 'image/png' : webp ? 'image/webp' : null;
    if (!type) return new Response('Velg et bilde i JPEG, PNG eller WebP', { status: 400 });
    const id = crypto.randomUUID();
    await store.set(id, data.buffer, { metadata: { type }, onlyIfNew: true });
    return Response.json({ url: '/.netlify/functions/media?id=' + id }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Bildebehandling feilet', error?.name);
    return new Response('Kunne ikke behandle bildet', { status: 500 });
  }
};
