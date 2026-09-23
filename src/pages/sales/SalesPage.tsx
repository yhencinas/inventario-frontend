import { useEffect, useMemo, useState } from 'react'
import { useProductsStore } from '../../store/productsStore'
import { useSalesStore } from '../../store/salesStore'

export function SalesPage() {
  const products = useProductsStore((state) => state.products)
  const fetchProducts = useProductsStore((state) => state.fetchProducts)
  const createSale = useSalesStore((state) => state.createSale)
  const salesLoading = useSalesStore((state) => state.loading)

  const [cart, setCart] = useState<Array<{ productId: string; name: string; quantity: number; price: number }>>([])

  useEffect(() => {
    fetchProducts({ page: 0, size: 50 })
  }, [fetchProducts])

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [cart],
  )

  const addProduct = (productId: string, name: string, price: number) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId)
      if (existing) {
        return current.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...current, { productId, name, quantity: 1, price }]
    })
  }

  const updateQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.productId !== productId))
      return
    }

    setCart((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    )
  }

  const handleSale = async () => {
    if (cart.length === 0) return

    try {
      await createSale(cart.map(({ productId, quantity }) => ({ productId, quantity })))
      setCart([])
    } catch {
      // handled by store
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Ventas</h1>
        <p className="mt-1 text-slate-600">Registra ventas y descuenta stock automáticamente.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Productos disponibles</h2>

          <div className="mt-4 space-y-3">
            {products.filter((product) => product.active).map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div>
                  <p className="font-medium text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-500">
                    ${Number(product.price).toFixed(2)} · Stock: {product.stock}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addProduct(product.id, product.name, Number(product.price))}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  + Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Carrito</h2>

          <div className="mt-4 space-y-3">
            {cart.length === 0 ? (
              <p className="text-sm text-slate-500">Todavía no agregaste productos.</p>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => updateQty(item.productId, Number(event.target.value))}
                      className="w-20 rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between text-lg font-semibold text-slate-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              type="button"
              disabled={cart.length === 0 || salesLoading}
              onClick={handleSale}
              className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {salesLoading ? 'Registrando venta...' : 'Registrar venta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
