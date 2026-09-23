import { create } from 'zustand'
import { api } from '../lib/api'
import type { PageResponse, Product, ProductForm } from '../types'

const emptyForm: ProductForm = {
  sku: '',
  name: '',
  description: '',
  price: '0',
  stock: '0',
  minimumStock: '0',
}

type ProductsStore = {
  products: Product[]
  loading: boolean
  error: string | null
  page: number
  size: number
  totalPage: number
  totalRecord: number
  fetchProducts: (params?: { search?: string; lowStock?: boolean; page?: number; size?: number }) => Promise<void>
  createProduct: (payload: ProductForm) => Promise<void>
  updateProduct: (id: string, payload: { name: string; description: string; price: string; minimumStock: string }) => Promise<void>
  adjustStock: (id: string, quantity: number) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  form: ProductForm
  setForm: (next: ProductForm) => void
  resetForm: () => void
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  page: 0,
  size: 20,
  totalPage: 0,
  totalRecord: 0,
  form: emptyForm,
  setForm: (next) => set({ form: next }),
  resetForm: () => set({ form: emptyForm }),
  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null })

    try {
      const { search = '', lowStock = false, page = 0, size = 20 } = params
      const { data } = await api.get<PageResponse<Product>>('/products', {
        params: {
          search,
          lowStock,
          page,
          size,
        },
      })

      set({
        products: data.list,
        page: data.page,
        size: data.size,
        totalPage: data.totalPage,
        totalRecord: data.totalRecord,
        loading: false,
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? 'No se pudieron cargar los productos',
        loading: false,
      })
      throw error
    }
  },
  createProduct: async (payload) => {
    set({ loading: true, error: null })

    try {
      await api.post('/products', {
        sku: payload.sku,
        name: payload.name,
        description: payload.description,
        price: Number(payload.price),
        stock: Number(payload.stock),
        minimumStock: Number(payload.minimumStock),
      })

      set({ loading: false })
      await get().fetchProducts({ page: 0, size: 20 })
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? 'No se pudo crear el producto',
        loading: false,
      })
      throw error
    }
  },
  updateProduct: async (id, payload) => {
    set({ loading: true, error: null })

    try {
      await api.put(`/products/${id}`, {
        name: payload.name,
        description: payload.description,
        price: Number(payload.price),
        minimumStock: Number(payload.minimumStock),
      })

      set({ loading: false })
      await get().fetchProducts({ page: 0, size: 20 })
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? 'No se pudo actualizar el producto',
        loading: false,
      })
      throw error
    }
  },
  adjustStock: async (id, quantity) => {
    set({ loading: true, error: null })

    try {
      await api.post(`/products/${id}/stock`, { quantity })
      set({ loading: false })
      await get().fetchProducts({ page: 0, size: 20 })
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? 'No se pudo ajustar el stock',
        loading: false,
      })
      throw error
    }
  },
  deleteProduct: async (id) => {
    set({ loading: true, error: null })

    try {
      await api.delete(`/products/${id}`)
      set({ loading: false })
      await get().fetchProducts({ page: 0, size: 20 })
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? 'No se pudo desactivar el producto',
        loading: false,
      })
      throw error
    }
  },
}))
