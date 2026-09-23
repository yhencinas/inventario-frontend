import type { UserRole } from '../types'

type JwtPayload = {
  exp?: number
  email?: string
  preferred_username?: string
  groups?: string[] | string
  roles?: string[] | string
  role?: string
  user_role?: string
  role_code?: string
  authorities?: string[] | string
  [key: string]: unknown
}

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  return decodeURIComponent(
    atob(normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=')
      .split('')
      .map((character) => `%${`00${character.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')),
  )
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1]
    return payload ? JSON.parse(decodeBase64Url(payload)) as JwtPayload : null
  } catch {
    return null
  }
}

export function getTokenRoles(token: string): UserRole[] {
  const payload = decodeToken(token)
  const rawRoles = payload?.groups ?? payload?.roles ?? payload?.authorities ?? payload?.role ?? payload?.user_role ?? payload?.role_code ?? []
  const roles = Array.isArray(rawRoles) ? rawRoles : [rawRoles]

  return roles
    .flatMap((role) => String(role).split(/[,\s]+/))
    .map((role) => role.replace(/^ROLE_/, '').toUpperCase())
    .filter((role): role is UserRole => ['ADMIN', 'DUENO', 'VENDEDOR'].includes(role))
}

export function isTokenExpired(token: string) {
  const exp = decodeToken(token)?.exp
  return typeof exp === 'number' && exp * 1000 <= Date.now()
}
