import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  count?: number
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      className={cn('bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg', className)}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        backgroundSize: '200% 100%',
      }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  )
}

export function BrandCardSkeleton() {
  return (
    <div className="rounded-xl border overflow-hidden bg-card p-4 space-y-4">
      <Skeleton className="aspect-video rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-3" />
          <Skeleton className="h-3" />
          <Skeleton className="h-3" />
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 p-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  )
}
