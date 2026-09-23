import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function ScreenRoute({ route }: { route: string }) {
  const menu = useAuthStore((state) => state.menu)
  const menuLoading = useAuthStore((state) => state.menuLoading)
  const menuLoaded = useAuthStore((state) => state.menuLoaded)
  const location = useLocation()

  if (menuLoading || !menuLoaded) {
    return <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">Cargando permisos...</div>
  }

  if (!menu.some((screen) => screen.route === route)) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return <Outlet />
}
