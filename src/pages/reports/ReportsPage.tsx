import { useEffect, useState } from 'react'
import { useSalesStore } from '../../store/salesStore'

export function ReportsPage() {
  const sales = useSalesStore((state) => state.sales)
  const loading = useSalesStore((state) => state.loading)
  const error = useSalesStore((state) => state.error)
  const getSalesReport = useSalesStore((state) => state.getSalesReport)

  const [from, setFrom] = useState('2025-01-01')
  const [to, setTo] = useState('2026-12-31')

  useEffect(() => {
    getSalesReport(from, to)
  }, [getSalesReport, from, to])

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
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Hasta</label>
            <input
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm text-slate-700">
          Total vendido en el período: <span className="font-bold text-slate-900">${totalRevenue.toFixed(2)}</span>
        </div>

        {error ? <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div> : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Ventas</h2>

        <div className="mt-4 space-y-3">
          {loading ? (
            <p className="text-sm text-slate-500">Cargando ventas...</p>
          ) : sales.length === 0 ? (
            <p className="text-sm text-slate-500">No hay ventas para este rango.</p>
          ) : (
            sales.map((sale) => (
              <div key={sale.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">Venta #{sale.id.slice(0, 8)}</p>
                    <p className="text-sm text-slate-500">{new Date(sale.createdAt).toLocaleString()}</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">${Number(sale.total).toFixed(2)}</p>
                </div>

                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  {sale.saleItemList.map((item, index) => (
                    <div key={`${sale.id}-${index}`} className="flex justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2">
                      <span>{item.productName ?? 'Producto'}</span>
                      <span>
                        {item.quantity} x ${Number(item.unitPrice ?? 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
