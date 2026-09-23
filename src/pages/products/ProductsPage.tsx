import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useProductsStore } from '../../store/productsStore'

const DEFAULT_FORM = {
  sku: '',
  name: '',
  description: '',
  price: '0',
  stock: '0',
  minimumStock: '0',
}

export function ProductsPage() {
  const { products, loading, error, form, setForm, fetchProducts, createProduct, adjustStock, deleteProduct } = useProductsStore()
  const [search, setSearch] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)

  useEffect(() => {
    fetchProducts({ search, lowStock: lowStockOnly, page: 0, size: 20 })
  }, [fetchProducts, search, lowStockOnly])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = search.toLowerCase().trim()
      if (!q) return true

      return product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q)
    })
  }, [products, search])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      await createProduct(form)
      setForm(DEFAULT_FORM)
    } catch {
      // error handled by store
    }
  }

  const handleAdjustStock = async (productId: string, quantity: number) => {
    try {
      await adjustStock(productId, quantity)
    } catch {
      // noop
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Productos</h1>
          <p className="mt-1 text-slate-600">Alta, lectura y ajustes de stock del inventario.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Crear producto</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">SKU</label>
              <input
                value={form.sku}
                onChange={(event) => setForm({ ...form, sku: event.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Descripción</label>
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="min-h-24 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) => setForm({ ...form, stock: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Stock mínimo</label>
              <input
                type="number"
                min="0"
                value={form.minimumStock}
                onChange={(event) => setForm({ ...form, minimumStock: event.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>

            {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {loading ? 'Guardando...' : 'Guardar producto'}
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Listado</h2>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar producto"
                className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={lowStockOnly}
                  onChange={(event) => setLowStockOnly(event.target.checked)}
                />
                Bajo stock
              </label>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {filteredProducts.length === 0 ? (
              <p className="text-sm text-slate-500">No se encontraron productos.</p>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.sku}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                      {product.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                    <div>
                      <span className="text-slate-400">Precio</span>
                      <p className="font-medium text-slate-900">${Number(product.price).toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Stock</span>
                      <p className="font-medium text-slate-900">{product.stock}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Mínimo</span>
                      <p className="font-medium text-slate-900">{product.minimumStock}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdjustStock(product.id, 5)}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                    >
                      +5 stock
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustStock(product.id, -2)}
                      className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-400"
                    >
                      -2 stock
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
                    >
                      Desactivar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
