export function isAdministrator(user) {
  return Array.isArray(user?.roles) && user.roles.some((role) => role === 'admin' || role === 'administrator');
}
