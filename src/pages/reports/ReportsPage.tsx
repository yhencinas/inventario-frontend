import { useEffect, useState } from 'react'
import { useSalesStore } from '../../store/salesStore'
import { Pagination } from '../../components/Pagination'
import { SaleDetailsModal } from '../../components/SaleDetailsModal'
import type { Sale } from '../../types'

export function ReportsPage() {
  const sales = useSalesStore((state) => state.sales)
  const loading = useSalesStore((state) => state.loading)
  const error = useSalesStore((state) => state.error)
  const getSalesReport = useSalesStore((state) => state.getSalesReport)
  const page = useSalesStore((state) => state.page)
  const size = useSalesStore((state) => state.size)
  const totalPage = useSalesStore((state) => state.totalPage)
  const totalRecord = useSalesStore((state) => state.totalRecord)

  const [from, setFrom] = useState('2025-01-01')
  const [to, setTo] = useState('2026-12-31')
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const dateError = !from || !to ? 'Debes seleccionar ambas fechas.' : from > to ? 'La fecha inicial no puede ser posterior a la fecha final.' : ''

  useEffect(() => {
    if (dateError) return
    getSalesReport(from, to, 0, size).catch(() => undefined)
  }, [getSalesReport, from, to, size, dateError])

  const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total ?? 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reportes</h1>
        <p className="mt-1 text-slate-600">Consulta ventas por rango de fechas.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Desde</label>
            <input
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              aria-invalid={Boolean(dateError)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Hasta</label>
            <input
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              aria-invalid={Boolean(dateError)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm text-slate-700">
          Total vendido en el período: <span className="font-bold text-slate-900">${totalRevenue.toFixed(2)}</span>
        </div>
        {dateError ? <p className="mt-3 text-sm text-red-600">{dateError}</p> : null}

        {error ? <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div> : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Ventas</h2>

        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <p className="text-sm text-slate-500">Cargando ventas...</p>
          ) : sales.length === 0 ? (
            <p className="text-sm text-slate-500">No hay ventas para este rango.</p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><th className="px-3 py-3">Venta</th><th className="px-3 py-3">Fecha</th><th className="px-3 py-3">Artículos</th><th className="px-3 py-3 text-right">Total</th><th className="px-3 py-3 text-right">Acciones</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((sale) => <tr key={sale.id} className="hover:bg-slate-50">
                  <td className="px-3 py-4 font-medium text-slate-900">#{sale.id.slice(0, 8)}</td>
                  <td className="px-3 py-4 text-slate-600">{new Date(sale.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-4 text-slate-600">{sale.saleItemList.length}</td>
                  <td className="px-3 py-4 text-right font-semibold text-slate-900">${Number(sale.total).toFixed(2)}</td>
                  <td className="px-3 py-4 text-right"><button type="button" onClick={() => setSelectedSale(sale)} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500">Ver detalle</button></td>
                </tr>)}
              </tbody>
            </table>
          )}
        </div>
        <Pagination page={page} totalPage={totalPage} totalRecord={totalRecord} size={size} onPageChange={(nextPage) => getSalesReport(from, to, nextPage, size)} onSizeChange={(nextSize) => getSalesReport(from, to, 0, nextSize)} />
      </div>
      {selectedSale ? <SaleDetailsModal sale={selectedSale} onClose={() => setSelectedSale(null)} /> : null}
    </div>
  )
}
