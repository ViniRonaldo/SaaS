export type AccessLevel = 'admin' | 'user';

export const ADMIN_ROLES = ['ADMIN', 'PREFECTURE', 'RECEPTIONIST', 'DOCTOR', 'NURSE'];
export const USER_ROLES = ['PATIENT'];

export function isAdminRole(role?: string | null) {
  return !!role && ADMIN_ROLES.includes(role);
}

export function isUserRole(role?: string | null) {
  return !!role && USER_ROLES.includes(role);
}

export function getAccessLevel(role?: string | null): AccessLevel {
  return isAdminRole(role) ? 'admin' : 'user';
}

export function getDefaultRoute(role?: string | null) {
  return isAdminRole(role) ? '/dashboard' : '/usuario';
}

export function canAccessAdminArea(role?: string | null) {
  return isAdminRole(role);
}

export function canAccessUserArea(role?: string | null) {
  return isUserRole(role);
}
