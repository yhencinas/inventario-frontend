import axios from 'axios'
import { env } from '../env'
import { useUiStore } from '../store/uiStore'

export const API_URL = env.apiUrl

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  return fallback
}

const shouldShowToast = (method?: string, url?: string) => {
  const normalizedMethod = method?.toLowerCase() ?? ''
  const normalizedUrl = url?.toLowerCase() ?? ''

  if (!normalizedMethod || normalizedMethod === 'get' || normalizedMethod === 'options') {
    return false
  }

  if (normalizedUrl.includes('/auth/login')) {
    return false
  }

  return true
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
    const shouldNotify = customConfig?.showToast !== false && shouldShowToast(response.config.method, response.config.url)

    if (shouldNotify) {
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

    const shouldNotify = shouldShowToast(error.config?.method, error.config?.url)

    if (shouldNotify) {
      const message = getErrorMessage(
        error.response?.data,
        'Ocurrió un error inesperado.',
      )

      useUiStore.getState().notifyError(message)
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('inventario-token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)
