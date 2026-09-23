import {useState} from 'react'
import {NavLink, Outlet, useNavigate} from 'react-router-dom'
import {useAuthStore} from '../store/authStore'
export function Layout() {
    const navigate = useNavigate()
    const email = useAuthStore((state) => state.email)
    const logout = useAuthStore((state) => state.logout)
    const menu = useAuthStore((state) => state.menu)
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = () => {
        logout();
        navigate('/login')
    }
    const navClass = ({isActive}: { isActive: boolean }) =>
        `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            {mobileOpen ? <button type="button" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)}
                                  className="fixed inset-0 z-20 bg-slate-900/50 md:hidden"/> : null}
            <aside
                className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-100 transition-all duration-200 ${collapsed ? 'md:w-20' : 'md:w-64'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
                    {!collapsed ? <span className="text-lg font-semibold uppercase tracking-wide">Inventario</span> :
                        <span className="mx-auto text-lg font-bold">I</span>}
                    <button type="button" onClick={() => setCollapsed((value) => !value)}
                            className="hidden rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:block"
                            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}>{collapsed ? '»' : '«'}</button>
                </div>
                <nav className="flex-1 space-y-2 p-4">{menu.map(({route, name}) => <NavLink key={route} to={route}
                                                                                           onClick={() => setMobileOpen(false)}
                                                                                           className={navClass}><span
                    className="md:hidden">{name}</span><span
                    className="hidden md:block">{collapsed ? name.charAt(0) : name}</span></NavLink>)}</nav>
            </aside>

            <main className={`min-h-screen transition-all duration-200 ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <header
                    className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-8">
                    <button type="button" onClick={() => setMobileOpen(true)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 md:hidden"
                            aria-label="Abrir menú">☰
                    </button>
                    <div className="ml-auto flex items-center gap-3">
                        <div className="hidden text-right sm:block"><p className="text-xs text-slate-500">Usuario
                            conectado</p><p
                            className="text-sm font-semibold text-slate-900">{email || 'Sesión activa'}</p></div>
                        <button type="button" onClick={handleLogout}
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Cerrar
                            sesión
                        </button>
                    </div>
                </header>
                <div className="p-4 md:p-8"><Outlet/></div>
            </main>
        </div>
    )
}
