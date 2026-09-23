import Swal from 'sweetalert2'
import { create } from 'zustand'

type UiState = {
  isLoading: boolean
  startLoading: () => void
  stopLoading: () => void
  notifySuccess: (message?: string) => void
  notifyError: (message?: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  isLoading: false,
  startLoading: () => set({ isLoading: true }),
  stopLoading: () => set({ isLoading: false }),
  notifySuccess: (message = 'Operación realizada correctamente') => {
    void Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      timer: 2200,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    })
  },
  notifyError: (message = 'Ocurrió un error inesperado') => {
    void Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      allowEscapeKey: false,
    })
  },
}))
