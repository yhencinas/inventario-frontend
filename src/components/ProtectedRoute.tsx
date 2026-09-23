import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import type { UserRole } from '../types'
import { isTokenExpired } from '../lib/jwt'

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: UserRole[] }) {
  const token = useAuthStore((state) => state.token)
  const roles = useAuthStore((state) => state.roles)
  const logout = useAuthStore((state) => state.logout)
  const fetchMenu = useAuthStore((state) => state.fetchMenu)
  const menuLoaded = useAuthStore((state) => state.menuLoaded)

  useEffect(() => {
    if (token && !menuLoaded) fetchMenu().catch(() => undefined)
  }, [token, menuLoaded, fetchMenu])

  if (!token || isTokenExpired(token)) {
    if (token) logout()
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.some((role) => roles.includes(role))) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
