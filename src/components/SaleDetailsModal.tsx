import type { Sale } from '../types'

type SaleDetailsModalProps = {
  sale: Sale
  onClose: () => void
}

export function SaleDetailsModal({ sale, onClose }: SaleDetailsModalProps) {
  const printReceipt = () => {
    const printWindow = window.open('', '_blank', 'width=420,height=700')
    if (!printWindow) return

    printWindow.document.write(`
      <!doctype html><html><head><title>Comprobante ${sale.id.slice(0, 8)}</title>
      <style>body{font-family:Arial,sans-serif;width:320px;margin:20px auto;color:#111}h1{text-align:center;font-size:20px}p{margin:6px 0;font-size:13px}.row{display:flex;justify-content:space-between;border-bottom:1px dashed #aaa;padding:7px 0}.total{font-size:18px;font-weight:bold;margin-top:14px}</style>
      </head><body><h1>Comprobante de venta</h1>
      <p>Venta #${sale.id.slice(0, 8)}</p><p>${new Date(sale.createdAt).toLocaleString()}</p>
      ${sale.saleItemList.map((item) => `<div class="row"><span>${item.productName ?? 'Producto'} x ${item.quantity}</span><span>$${(Number(item.unitPrice ?? 0) * item.quantity).toFixed(2)}</span></div>`).join('')}
      <p class="total">Total: $${Number(sale.total).toFixed(2)}</p>
      <script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}</script></body></html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Detalle de venta</h2>
            <p className="mt-1 text-sm text-slate-500">Venta #{sale.id.slice(0, 8)} · {new Date(sale.createdAt).toLocaleString()}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-xl text-slate-500 hover:bg-slate-100" aria-label="Cerrar">×</button>
        </div>
        <div className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200">
          {sale.saleItemList.map((item, index) => (
            <div key={`${sale.id}-${index}`} className="flex items-center justify-between gap-4 p-3 text-sm">
              <span>{item.productName ?? 'Producto'} × {item.quantity}</span>
              <span className="font-medium">${(Number(item.unitPrice ?? 0) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-lg font-bold text-slate-900">
          <span>Total</span><span>${Number(sale.total).toFixed(2)}</span>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700">Cerrar</button>
          <button type="button" onClick={printReceipt} className="rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-500">Imprimir comprobante</button>
        </div>
      </div>
    </div>
  )
}
