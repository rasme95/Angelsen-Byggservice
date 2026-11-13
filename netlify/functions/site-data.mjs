import { getStore } from '@netlify/blobs';
import { getUser, verifyRequestOrigin } from '@netlify/identity';

const headers = { 'Cache-Control': 'no-store' };
const isString = (value, max = 500) => typeof value === 'string' && value.length <= max;
function valid(data) {
  return data && isString(data.businessName) && isString(data.brandSubline) && isString(data.heroTitle) &&
    isString(data.heroLead, 2000) && data.contact && isString(data.contact.phone, 100) &&
    isString(data.contact.email, 254) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email) &&
    isString(data.contact.area) && Array.isArray(data.projects) && data.projects.length <= 100 &&
    data.projects.every((p) => p && isString(p.title) && isString(p.category) && typeof p.showOnHomepage === 'boolean' &&
      Array.isArray(p.images) && p.images.length > 0 && p.images.length <= 100 && p.images.every((image) =>
        isString(image, 2000) && (/^Bilder\//.test(image) || /^\/\.netlify\/functions\/media\?id=[a-f0-9-]+$/.test(image) || /^https:\/\//.test(image))));
}

export default async (request, context) => {
  try {
    if (request.method === 'PUT' && context?.deploy?.context !== 'production') return new Response('Endringer kan bare lagres på produksjonssiden.', { status: 403, headers });
    if (request.method === 'GET') {
      const store = getStore({ name: 'angelsen-content', region: 'eu-central-1', consistency: 'strong' });
      const entry = await store.getWithMetadata('site', { type: 'json', consistency: 'strong' });
      return Response.json({ data: entry?.data ?? null, version: entry?.etag ?? null }, { headers });
    }
    if (request.method !== 'PUT') return new Response('Metoden støttes ikke', { status: 405, headers });
    verifyRequestOrigin(request);
    const user = await getUser();
    if (!user?.roles?.includes('admin')) return new Response('Ikke tilgang', { status: 403, headers });
    const store = getStore({ name: 'angelsen-content', region: 'eu-central-1', consistency: 'strong' });
    if (Number(request.headers.get('content-length') || 0) > 500000) return new Response('For mye innhold', { status: 413, headers });
    const text = await request.text();
    if (text.length > 500000) return new Response('For mye innhold', { status: 413, headers });
    const { data, version } = JSON.parse(text);
    if (!valid(data) || !(version === null || isString(version, 300))) return new Response('Ugyldig innhold', { status: 400, headers });
    if (version !== null) {
      const current = await store.getWithMetadata('site', { type: 'json', consistency: 'strong' });
      if (!current || current.etag !== version) return new Response('Innholdet er endret av en annen. Last siden på nytt før du lagrer.', { status: 409, headers });
      await store.setJSON('history/' + crypto.randomUUID(), { savedAt: new Date().toISOString(), data: current.data }, { onlyIfNew: true });
    }
    const result = await store.setJSON('site', data, version === null ? { onlyIfNew: true } : { onlyIfMatch: version });
    if (!result.modified) return new Response('Innholdet er endret av en annen. Last siden på nytt før du lagrer.', { status: 409, headers });
    return Response.json({ version: result.etag }, { headers });
  } catch (error) {
    console.error('Lagring feilet', error?.name);
    return new Response('Kunne ikke behandle innholdet', { status: 500, headers });
  }
};
