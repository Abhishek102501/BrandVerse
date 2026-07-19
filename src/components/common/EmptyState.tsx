import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-dashed p-12 text-center max-w-md mx-auto"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </motion.div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  action?: { label: string; onClick: () => void }
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error. Please try again.',
  action,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
    >
      <div className="text-4xl mb-3">⚠️</div>
      <h3 className="font-semibold text-destructive mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{message}</p>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  )
}
