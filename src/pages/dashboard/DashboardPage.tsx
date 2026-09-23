import { useEffect } from 'react'
import { useProductsStore } from '../../store/productsStore'

export function DashboardPage() {
  const products = useProductsStore((state) => state.products)
  const fetchProducts = useProductsStore((state) => state.fetchProducts)

  useEffect(() => {
    fetchProducts({ page: 0, size: 20 })
  }, [fetchProducts])

  const lowStock = products.filter((product) => product.stock <= product.minimumStock).length

  const stats = [
    { label: 'Productos', value: String(products.length) },
    { label: 'Bajo stock', value: String(lowStock) },
    { label: 'Activos', value: String(products.filter((product) => product.active).length) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">Resumen del inventario y ventas de la empresa.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Productos con stock crítico</h2>
        <div className="mt-4 space-y-3">
          {products.filter((product) => product.stock <= product.minimumStock).length === 0 ? (
            <p className="text-sm text-slate-500">No hay productos bajo el nivel mínimo.</p>
          ) : (
            products
              .filter((product) => product.stock <= product.minimumStock)
              .map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                  <span>{product.name}</span>
                  <span>
                    {product.stock} / {product.minimumStock}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}
