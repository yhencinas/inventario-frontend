import { create } from 'zustand'
import { api } from '../lib/api'
import type { PageResponse, Sale } from '../types'

type SalesState = {
  sales: Sale[]
  loading: boolean
  error: string | null
  createSale: (items: { productId: string; quantity: number }[]) => Promise<Sale>
  getSalesReport: (from: string, to: string) => Promise<void>
}

export const useSalesStore = create<SalesState>((set) => ({
  sales: [],
  loading: false,
  error: null,
  createSale: async (items) => {
    set({ loading: true, error: null })

    try {
      const { data } = await api.post<Sale>('/sales', { saleItemList: items })
      set({ loading: false })
      return data
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? 'No se pudo registrar la venta',
        loading: false,
      })
      throw error
    }
  },
  getSalesReport: async (from, to) => {
    set({ loading: true, error: null })

    try {
      const { data } = await api.get<PageResponse<Sale>>('/reports/sales', {
        params: {
          from,
          to,
          page: 0,
          size: 50,
        },
      })

      set({ sales: data.list, loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.message ?? 'No se pudo obtener el reporte',
        loading: false,
      })
      throw error
    }
  },
}))
