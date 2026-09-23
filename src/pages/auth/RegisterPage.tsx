import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { validateRegistrationForm } from '../../lib/validation'

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const error = useAuthStore((state) => state.error)

  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validateRegistrationForm(companyName, email, password)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    try {
      await register(companyName, email, password)
      await login(email, password)
      navigate('/products')
    } catch {
      // error handled by store
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Inventario</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Registrar empresa</h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nombre de la empresa</label>
            <input
              type="text"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 outline-none transition focus:ring-2 ${errors.companyName ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'}`}
              required
            />
            {errors.companyName ? <p className="mt-1 text-sm text-red-600">{errors.companyName}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 outline-none transition focus:ring-2 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'}`}
              required
            />
            {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 outline-none transition focus:ring-2 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'}`}
              minLength={6}
              required
            />
            {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password}</p> : null}
          </div>

          {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
