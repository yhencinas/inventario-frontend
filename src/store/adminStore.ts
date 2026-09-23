import { create } from 'zustand'
import { api } from '../lib/api'
import type { PageResponse, Permission, Role, Screen, User } from '../types'

type AdminState = {
  users: User[]
  roles: Role[]
  screens: Screen[]
  permissions: Permission[]
  page: number
  size: number
  totalPage: number
  totalRecord: number
  loading: boolean
  error: string | null
  fetchUsers: (page?: number, size?: number) => Promise<void>
  fetchAccess: () => Promise<void>
  saveUser: (payload: { email: string; password?: string; roleId: string }, id?: string) => Promise<void>
  removeUser: (id: string) => Promise<void>
  saveRole: (payload: { code: string; name: string }, id?: string) => Promise<void>
  removeRole: (id: string) => Promise<void>
  saveScreen: (payload: { code: string; name: string; route: string }, id?: string) => Promise<void>
  removeScreen: (id: string) => Promise<void>
  savePermission: (payload: { code: string; name: string; screenId: string }, id?: string) => Promise<void>
  removePermission: (id: string) => Promise<void>
}

const errorMessage = (error: any, fallback: string) => error.response?.data?.message ?? fallback

export const useAdminStore = create<AdminState>((set) => ({
  users: [], roles: [], screens: [], permissions: [], page: 0, size: 20, totalPage: 0, totalRecord: 0, loading: false, error: null,
  fetchUsers: async (page = 0, size = 20) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.get<PageResponse<User>>('/users', { params: { page, size } })
      set({ users: data.list, page: data.page, size: data.size, totalPage: data.totalPage, totalRecord: data.totalRecord, loading: false })
    } catch (error: any) { set({ loading: false, error: errorMessage(error, 'No se pudieron cargar los usuarios') }); throw error }
  },
  fetchAccess: async () => {
    set({ loading: true, error: null })
    try {
      const [roles, screens, permissions] = await Promise.all([
        api.get<Role[]>('/roles'), api.get<Screen[]>('/screens'), api.get<Permission[]>('/permissions'),
      ])
      set({ roles: roles.data, screens: screens.data, permissions: permissions.data, loading: false })
    } catch (error: any) { set({ loading: false, error: errorMessage(error, 'No se pudo cargar la administración de accesos') }); throw error }
  },
  saveUser: async (payload, id) => { if (id) await api.put(`/users/${id}`, payload); else await api.post('/users', payload) },
  removeUser: async (id) => { await api.delete(`/users/${id}`) },
  saveRole: async (payload, id) => { if (id) await api.put(`/roles/${id}`, payload); else await api.post('/roles', payload) },
  removeRole: async (id) => { await api.delete(`/roles/${id}`) },
  saveScreen: async (payload, id) => { if (id) await api.put(`/screens/${id}`, payload); else await api.post('/screens', payload) },
  removeScreen: async (id) => { await api.delete(`/screens/${id}`) },
  savePermission: async (payload, id) => { if (id) await api.put(`/permissions/${id}`, payload); else await api.post('/permissions', payload) },
  removePermission: async (id) => { await api.delete(`/permissions/${id}`) },
}))
