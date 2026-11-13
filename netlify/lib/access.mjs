export function isAdministrator(user) {
  return Array.isArray(user?.roles) && user.roles.some((role) => role === 'admin' || role === 'administrator');
}

export function storageName(context, kind) {
  if (!['content', 'images'].includes(kind)) return null;
  if (context?.deploy?.context === 'production') return `angelsen-${kind}`;
  if (context?.deploy?.context === 'deploy-preview') return `angelsen-preview-${kind}`;
  return null;
}
