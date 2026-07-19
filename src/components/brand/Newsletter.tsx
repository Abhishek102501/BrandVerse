import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsletterProps {
  title?: string
  description?: string
  className?: string
}

export function Newsletter({
  title = 'Stay in the loop',
  description = 'Get hand-picked brand recommendations, trends, and exclusive insights delivered to your inbox.',
  className,
}: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      return
    }

    setStatus('loading')
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus('success')
    setEmail('')

    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <motion.section
      className={cn(
        'relative overflow-hidden rounded-2xl border p-8 md:p-12 bg-gradient-to-br from-primary/5 via-background to-background',
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 size-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 size-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h2 className="font-display text-3xl font-bold md:text-4xl">{title}</h2>
          <p className="text-muted-foreground mt-2">{description}</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'error') setStatus('idle')
              }}
              placeholder="Enter your email"
              className={cn(
                'w-full pl-12 pr-4 py-3 rounded-lg border bg-card outline-none transition-all duration-200',
                status === 'error'
                  ? 'border-destructive ring-2 ring-destructive/20'
                  : 'border-border hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20',
              )}
              disabled={status === 'loading' || status === 'success'}
              aria-label="Email address"
            />
          </div>
          <motion.button
            type="submit"
            disabled={status === 'loading' || status === 'success' || !email}
            className={cn(
              'px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap',
              status === 'success'
                ? 'bg-primary/10 text-primary'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed',
            )}
            whileHover={{ scale: status === 'success' ? 1 : 1.02 }}
            whileTap={{ scale: status === 'success' ? 1 : 0.98 }}
          >
            {status === 'loading' && (
              <motion.div
                className="size-4 border-2 border-current border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            )}
            {status === 'success' && <Check className="size-4" />}
            {status === 'error' && <AlertCircle className="size-4" />}
            <span>{status === 'success' ? 'Subscribed!' : status === 'error' ? 'Invalid email' : 'Subscribe'}</span>
          </motion.button>
        </motion.form>

        <p className="text-muted-foreground text-xs mt-3">
          We'll never spam you. Unsubscribe anytime.
        </p>
      </div>
    </motion.section>
  )
}
