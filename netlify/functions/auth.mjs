import { acceptInvite, getUser, login, logout, recoverPassword, verifyRequestOrigin } from '@netlify/identity';
import { isAdministrator } from '../lib/access.mjs';

export default async (request) => {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    if (request.method === 'GET') {
      const user = await getUser();
      return Response.json({ authenticated: isAdministrator(user) }, { headers });
    }
    if (request.method !== 'POST') return new Response('Metoden støttes ikke', { status: 405, headers });
    verifyRequestOrigin(request);
    const { action, email, password, token } = await request.json();
    if (action === 'login') {
      if (typeof email !== 'string' || typeof password !== 'string') return new Response('Ugyldig forespørsel', { status: 400, headers });
      await login(email, password);
      return Response.json({ ok: true }, { headers });
    }
    if (action === 'logout') {
      await logout();
      return Response.json({ ok: true }, { headers });
    }
    if (action === 'invite' || action === 'recovery') {
      if (typeof token !== 'string' || token.length > 4096 || typeof password !== 'string' || password.length < 12 || password.length > 256) return new Response('Ugyldig forespørsel', { status: 400, headers });
      if (action === 'invite') await acceptInvite(token, password);
      else await recoverPassword(token, password);
      return Response.json({ ok: true }, { headers });
    }
    return new Response('Ugyldig forespørsel', { status: 400, headers });
  } catch (error) {
    console.error('Innlogging feilet', error?.name);
    return Response.json({ error: 'Innloggingen kunne ikke fullføres. Kontroller opplysningene og prøv igjen.' }, { status: 401, headers });
  }
};
