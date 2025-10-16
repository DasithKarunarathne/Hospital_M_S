const ROLE_DEFAULT_PATHS = {
  patient: '/records/preview',
  doctor: '/records/preview',
  staff: '/records/preview',
  manager: '/reports',
  admin: '/reports'
}

export function getDefaultPathForRole(role) {
  if (!role) {
    return '/records/preview'
  }

  return ROLE_DEFAULT_PATHS[role] || '/records/preview'
}
