type PaginationProps = {
  page: number
  totalPage: number
  totalRecord: number
  size: number
  onPageChange: (page: number) => void
  onSizeChange?: (size: number) => void
}

export function Pagination({ page, totalPage, totalRecord, size, onPageChange, onSizeChange }: PaginationProps) {
  if (totalRecord === 0) return null
  const lastPage = Math.max(totalPage - 1, 0)
  const from = page * size + 1
  const to = Math.min((page + 1) * size, totalRecord)

  return (
    <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <span>Mostrando {from}-{to} de {totalRecord} registros</span>
      <div className="flex flex-wrap items-center gap-2">
        {onSizeChange ? (
          <label className="flex items-center gap-2">
            Registros:
            <select value={size} onChange={(event) => onSizeChange(Number(event.target.value))} className="rounded-lg border border-slate-300 bg-white px-2 py-1.5">
              {[10, 20, 50, 100].map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        ) : null}
        <button type="button" disabled={page === 0} onClick={() => onPageChange(page - 1)} className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
        <span className="rounded-lg bg-slate-100 px-3 py-1.5">Página {page + 1} de {Math.max(totalPage, 1)}</span>
        <button type="button" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)} className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40">Siguiente</button>
      </div>
    </div>
  )
}
