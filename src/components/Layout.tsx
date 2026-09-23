import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/products', label: 'Productos' },
  { to: '/sales', label: 'Ventas' },
  { to: '/reports', label: 'Reportes' },
]

export function Layout() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-slate-900 text-slate-100">
        <div className="flex h-16 items-center border-b border-slate-700 px-6 text-lg font-semibold uppercase tracking-wide">
          Inventario
        </div>

        <nav className="space-y-2 p-4">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  )
}
