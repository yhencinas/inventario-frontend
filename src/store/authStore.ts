import { create } from 'zustand'
import { api } from '../lib/api'
import type { AuthTokenResponse, RegisterResponse } from '../types'

type AuthState = {
  token: string
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (companyName: string, email: string, password: string) => Promise<RegisterResponse>
  logout: () => void
}

const tokenFromStorage = localStorage.getItem('inventario-token') ?? ''

export const useAuthStore = create<AuthState>((set) => ({
  token: tokenFromStorage,
  loading: false,
  error: null,
  login: async (email, password) => {
    set({ loading: true, error: null })

    try {
      const { data } = await api.post<AuthTokenResponse>('/auth/login', { email, password })
      localStorage.setItem('inventario-token', data.token)
      set({ token: data.token, loading: false })
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
  logout: () => {
    localStorage.removeItem('inventario-token')
    set({ token: '', error: null })
  },
}))
