import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToastStore } from '@/store/toast.store'
import { cn } from '@/lib/utils'

const toastStyles = {
  success: 'bg-green-500/10 border-green-500/20 text-green-900 dark:text-green-100',
  error: 'bg-red-500/10 border-red-500/20 text-red-900 dark:text-red-100',
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-900 dark:text-blue-100',
  warning: 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-100',
}

const iconMap = {
  success: Check,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  return (
    <div className="fixed bottom-0 right-0 z-50 pointer-events-none">
      <div className="p-4 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = iconMap[toast.type]
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 100, x: 0 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 100, x: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'rounded-lg border p-4 mb-3 flex items-start gap-3',
                  'pointer-events-auto shadow-lg',
                  toastStyles[toast.type],
                )}
              >
                <Icon className="size-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{toast.message}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="size-4" />
                </motion.button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
