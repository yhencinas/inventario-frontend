import { useEffect, useMemo, useState } from 'react'
import { Pagination } from '../../components/Pagination'
import { useAdminStore } from '../../store/adminStore'
import type { Permission, Role, Screen, User } from '../../types'

type Tab = 'users' | 'roles' | 'screens' | 'permissions'
const tabs: Array<[Tab, string]> = [['users', 'Usuarios'], ['roles', 'Roles'], ['screens', 'Pantallas'], ['permissions', 'Permisos']]

function Field({ label, value, onChange, error, type = 'text', placeholder }: { label: string; value: string; onChange: (value: string) => void; error?: string; type?: string; placeholder?: string }) {
  return <div>
    <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
    <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 outline-none focus:ring-2 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'}`} />
    {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
  </div>
}

function slicePage<T>(items: T[], page: number, size: number) {
  return { list: items.slice(page * size, (page + 1) * size), totalPage: Math.ceil(items.length / size), totalRecord: items.length }
}

export function AdminPage() {
  const state = useAdminStore()
  const fetchUsers = useAdminStore((current) => current.fetchUsers)
  const fetchAccess = useAdminStore((current) => current.fetchAccess)
  const [tab, setTab] = useState<Tab>('users')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [editing, setEditing] = useState<any>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { fetchUsers().catch(() => undefined); fetchAccess().catch(() => undefined) }, [fetchUsers, fetchAccess])

  const collection = tab === 'users' ? state.users : tab === 'roles' ? state.roles : tab === 'screens' ? state.screens : state.permissions
  const localPage = tab === 'users' ? { list: state.users, totalPage: state.totalPage, totalRecord: state.totalRecord } : slicePage<any>(collection as any[], page, size)
  const items = localPage.list

  const startEdit = (item: User | Role | Screen | Permission) => {
    setEditing(item)
    if ('email' in item) setValues({ email: item.email, roleId: item.roleId ?? '', password: '' })
    else if ('route' in item) setValues({ code: item.code, name: item.name, route: item.route })
    else if ('screenId' in item) setValues({ code: item.code, name: item.name, screenId: item.screenId })
    else setValues({ code: item.code, name: item.name })
    setErrors({})
  }
  const setValue = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }))
  const validate = () => {
    const next: Record<string, string> = {}
    const required = tab === 'users' ? ['email', 'roleId', ...(editing ? [] : ['password'])] : tab === 'roles' ? ['code', 'name'] : tab === 'screens' ? ['code', 'name', 'route'] : ['code', 'name', 'screenId']
    required.forEach((key) => { if (!values[key]?.trim()) next[key] = 'Este campo es requerido.' })
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Ingresa un correo válido.'
    if (values.password && values.password.length < 6) next.password = 'Debe tener al menos 6 caracteres.'
    setErrors(next)
    return Object.keys(next).length === 0
  }
  const refresh = async () => { await state.fetchAccess(); await state.fetchUsers(state.page, state.size) }
  const save = async () => {
    if (!validate()) return
    try {
      if (tab === 'users') await state.saveUser({ email: values.email, password: values.password || undefined, roleId: values.roleId }, editing?.id)
      if (tab === 'roles') await state.saveRole({ code: values.code, name: values.name }, editing?.id)
      if (tab === 'screens') await state.saveScreen({ code: values.code, name: values.name, route: values.route }, editing?.id)
      if (tab === 'permissions') await state.savePermission({ code: values.code, name: values.name, screenId: values.screenId }, editing?.id)
      await refresh(); setEditing(null); setValues({})
    } catch { /* interceptor/store notification */ }
  }
  const remove = async (id: string) => {
    if (!window.confirm('¿Deseas eliminar este registro?')) return
    try {
      if (tab === 'users') await state.removeUser(id)
      if (tab === 'roles') await state.removeRole(id)
      if (tab === 'screens') await state.removeScreen(id)
      if (tab === 'permissions') await state.removePermission(id)
      await refresh()
    } catch { /* interceptor notification */ }
  }

  const formFields = useMemo(() => tab === 'users' ? ['email', 'password', 'roleId'] : tab === 'roles' ? ['code', 'name'] : tab === 'screens' ? ['code', 'name', 'route'] : ['code', 'name', 'screenId'], [tab])
  const labels: Record<string, string> = { email: 'Correo', password: 'Contraseña', roleId: 'Rol', code: 'Código', name: 'Nombre', route: 'Ruta', screenId: 'Pantalla' }

  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold text-slate-900">Administración</h1><p className="mt-1 text-slate-600">Gestiona usuarios, roles, pantallas y permisos.</p></div>
    <div className="flex flex-wrap gap-2 border-b border-slate-200">
      {tabs.map(([key, label]) => <button key={key} type="button" onClick={() => { setTab(key); setPage(0); setEditing(null); setValues({}); setErrors({}) }} className={`rounded-t-lg px-4 py-2 text-sm font-semibold ${tab === key ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{label}</button>)}
    </div>
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">{editing ? 'Editar' : 'Nuevo'} {tabs.find(([key]) => key === tab)?.[1].slice(0, -1)}</h2>
        <div className="mt-4 space-y-4">
          {formFields.map((field) => field === 'roleId' || field === 'screenId' ? <div key={field}><label className="mb-1 block text-sm font-medium text-slate-700">{labels[field]}</label><select value={values[field] ?? ''} onChange={(event) => setValue(field, event.target.value)} className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 ${errors[field] ? 'border-red-500' : 'border-slate-300'}`}><option value="">Selecciona una opción</option>{(field === 'roleId' ? state.roles : state.screens).map((item: any) => <option key={item.id} value={item.id}>{item.name} ({item.code})</option>)}</select>{errors[field] ? <p className="mt-1 text-sm text-red-600">{errors[field]}</p> : null}</div> : <Field key={field} label={labels[field]} type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'} value={values[field] ?? ''} onChange={(value) => setValue(field, value)} error={errors[field]} placeholder={field === 'password' && editing ? 'Dejar vacío para conservar' : undefined} />)}
          <div className="flex gap-2"><button type="button" onClick={save} disabled={state.loading} className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white disabled:opacity-50">{state.loading ? 'Guardando...' : 'Guardar'}</button>{editing ? <button type="button" onClick={() => { setEditing(null); setValues({}); setErrors({}) }} className="rounded-lg border border-slate-300 px-4 py-2.5">Cancelar</button> : null}</div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-slate-900">Listado</h2>{state.error ? <span className="text-sm text-red-600">{state.error}</span> : null}</div>
        <div className="mt-4 space-y-3">
          {items.length === 0 ? <p className="text-sm text-slate-500">No hay registros.</p> : items.map((item: any) => <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-slate-900">{item.email ?? item.name}</p><p className="text-sm text-slate-500">{item.roleCode ?? item.code}{item.route ? ` · ${item.route}` : ''}{item.screenId ? ` · pantalla asignada` : ''}</p></div><div className="flex gap-2"><button type="button" onClick={() => startEdit(item)} className="rounded-lg border border-indigo-200 px-3 py-2 text-sm text-indigo-700">Editar</button><button type="button" onClick={() => remove(item.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700">Eliminar</button></div></div>)}
        </div>
        <Pagination page={tab === 'users' ? state.page : page} totalPage={localPage.totalPage} totalRecord={localPage.totalRecord} size={tab === 'users' ? state.size : size} onPageChange={(next) => tab === 'users' ? state.fetchUsers(next, state.size) : setPage(next)} onSizeChange={tab === 'users' ? (next) => state.fetchUsers(0, next) : (next) => { setSize(next); setPage(0) }} />
      </div>
    </div>
  </div>
}
