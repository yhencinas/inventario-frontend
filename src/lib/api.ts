import axios from 'axios'
import { useUiStore } from '../store/uiStore'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8082'

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  return fallback
}

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  useUiStore.getState().startLoading()

  const token = localStorage.getItem('inventario-token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    useUiStore.getState().stopLoading()

    const customConfig = response.config as { showToast?: boolean } | undefined

    if (customConfig?.showToast !== false) {
      const message = getErrorMessage(response.data, 'Operación realizada correctamente')

      if (response.data && typeof response.data === 'object' && 'message' in response.data) {
        useUiStore.getState().notifySuccess(String((response.data as { message?: string }).message))
      } else {
        useUiStore.getState().notifySuccess(message)
      }
    }

    return response
  },
  (error) => {
    useUiStore.getState().stopLoading()

    const message = getErrorMessage(
      error.response?.data,
      'Ocurrió un error inesperado.',
    )

    useUiStore.getState().notifyError(message)

    if (error.response?.status === 401) {
      localStorage.removeItem('inventario-token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)
