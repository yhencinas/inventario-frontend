import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Pagination } from '../../components/Pagination'
import { useProductsStore } from '../../store/productsStore'
import { isNonNegativeNumber } from '../../lib/validation'

const DEFAULT_FORM = {
  sku: '',
  name: '',
  description: '',
  price: '0',
  stock: '0',
  minimumStock: '0',
}

export function ProductsPage() {
  const { products, loading, error, form, page, size, totalPage, totalRecord, setForm, fetchProducts, createProduct, adjustStock, deleteProduct } = useProductsStore()
  const [search, setSearch] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchProducts({ search, lowStock: lowStockOnly, page: 0, size: 20 }).catch(() => undefined)
  }, [fetchProducts, search, lowStockOnly])

  const filteredProducts = useMemo(() => products, [products])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!form.sku.trim()) nextErrors.sku = 'El SKU es requerido.'
    if (!form.name.trim()) nextErrors.name = 'El nombre es requerido.'
    if (!isNonNegativeNumber(form.price)) nextErrors.price = 'Ingresa un precio válido mayor o igual a 0.'
    if (!isNonNegativeNumber(form.stock)) nextErrors.stock = 'Ingresa un stock válido mayor o igual a 0.'
    if (!isNonNegativeNumber(form.minimumStock)) nextErrors.minimumStock = 'Ingresa un stock mínimo válido.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

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
                className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 outline-none focus:ring-2 ${errors.sku ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'}`}
                required
              />
              {errors.sku ? <p className="mt-1 text-sm text-red-600">{errors.sku}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'}`}
                required
              />
              {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name}</p> : null}
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
                  className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 outline-none focus:ring-2 ${errors.price ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'}`}
                  required
                />
                {errors.price ? <p className="mt-1 text-sm text-red-600">{errors.price}</p> : null}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) => setForm({ ...form, stock: event.target.value })}
                  className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 outline-none focus:ring-2 ${errors.stock ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'}`}
                  required
                />
                {errors.stock ? <p className="mt-1 text-sm text-red-600">{errors.stock}</p> : null}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Stock mínimo</label>
              <input
                type="number"
                min="0"
                value={form.minimumStock}
                onChange={(event) => setForm({ ...form, minimumStock: event.target.value })}
                className={`w-full rounded-lg border bg-slate-50 px-3 py-2.5 outline-none focus:ring-2 ${errors.minimumStock ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'}`}
                required
              />
              {errors.minimumStock ? <p className="mt-1 text-sm text-red-600">{errors.minimumStock}</p> : null}
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
            <Pagination page={page} totalPage={totalPage} totalRecord={totalRecord} size={size} onPageChange={(nextPage) => fetchProducts({ search, lowStock: lowStockOnly, page: nextPage, size })} onSizeChange={(nextSize) => fetchProducts({ search, lowStock: lowStockOnly, page: 0, size: nextSize })} />
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
