import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, type: ToastType, duration?: number) => void
  removeToast: (id: string) => void
  clear: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type, duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }))
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, duration)
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clear: () => set({ toasts: [] }),
}))

export const useToast = () => {
  const store = useToastStore(useShallow((state) => state))
  return {
    success: (msg: string, duration?: number) => store.addToast(msg, 'success', duration),
    error: (msg: string, duration?: number) => store.addToast(msg, 'error', duration),
    info: (msg: string, duration?: number) => store.addToast(msg, 'info', duration),
    warning: (msg: string, duration?: number) => store.addToast(msg, 'warning', duration),
  }
}
