import { useUiStore } from '../store/uiStore'

export function GlobalLoader() {
  const isLoading = useUiStore((state) => state.isLoading)

  if (!isLoading) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/90 px-8 py-6 shadow-2xl ring-1 ring-slate-200">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">Cargando</p>
      </div>
    </div>
  )
}
