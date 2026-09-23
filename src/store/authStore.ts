import { create } from 'zustand'
import { api } from '../lib/api'
import { getTokenRoles } from '../lib/jwt'
import type { AuthTokenResponse, MenuScreen, RegisterResponse, UserRole } from '../types'

type AuthState = {
  token: string
  email: string
  roles: UserRole[]
  menu: MenuScreen[]
  menuLoading: boolean
  menuLoaded: boolean
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (companyName: string, email: string, password: string) => Promise<RegisterResponse>
  fetchMenu: () => Promise<void>
  logout: () => void
}

const tokenFromStorage = localStorage.getItem('inventario-token') ?? ''
const emailFromStorage = localStorage.getItem('inventario-user-email') ?? ''

export const useAuthStore = create<AuthState>((set) => ({
  token: tokenFromStorage,
  email: emailFromStorage,
  roles: getTokenRoles(tokenFromStorage),
  menu: [],
  menuLoading: false,
  menuLoaded: false,
  loading: false,
  error: null,
  login: async (email, password) => {
    set({ loading: true, error: null })

    try {
      const { data } = await api.post<AuthTokenResponse>('/auth/login', { email, password })
      localStorage.setItem('inventario-token', data.token)
      localStorage.setItem('inventario-user-email', email)
      set({ token: data.token, email, roles: getTokenRoles(data.token), loading: false })
      await useAuthStore.getState().fetchMenu()
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? 'No se pudo iniciar sesión',
        loading: false,
      })
      throw error
    }
  },
  register: async (companyName, email, password) => {
    set({ loading: true, error: null })

    try {
      const { data } = await api.post<RegisterResponse>('/auth/register', {
        companyName,
        email,
        password,
      })

      set({ loading: false })
      return data
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? 'No se pudo registrar la empresa',
        loading: false,
      })
      throw error
    }
  },
  fetchMenu: async () => {
    if (!useAuthStore.getState().token) {
      set({ menu: [], menuLoaded: true })
      return
    }

    set({ menuLoading: true })
    try {
      const { data } = await api.get<MenuScreen[]>('/menu')
      set({ menu: data, menuLoading: false, menuLoaded: true })
    } catch (error) {
      set({ menu: [], menuLoading: false, menuLoaded: true })
      throw error
    }
  },
  logout: () => {
    localStorage.removeItem('inventario-token')
    localStorage.removeItem('inventario-user-email')
    set({ token: '', email: '', roles: [], menu: [], menuLoading: false, menuLoaded: false, error: null })
  },
}))
