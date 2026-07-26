import { motion, AnimatePresence } from 'framer-motion'
import { History, X } from 'lucide-react'
import { useRecentlyViewedStore } from '@/store/recently-viewed.store'
import { useBrandById } from '@/features/brands/hooks/use-brands'
import { BrandCard } from '@/components/brand/BrandCard'
import { Button } from '@/components/ui/button'
import type { Brand } from '@/services/brand'

function ViewedCard({ id, index }: { id: string; index: number }) {
  const { data: brand } = useBrandById(id)
  if (!brand) return null
  return <BrandCard brand={brand as Brand} variant="compact" index={index} />
}

export function RecentlyViewedSection() {
  const viewed = useRecentlyViewedStore((s) => s.viewed)
  const clear = useRecentlyViewedStore((s) => s.clear)
  const recent = viewed.slice(0, 6)

  if (recent.length === 0) return null

  return (
    <AnimatePresence>
      <motion.section
        key="recently-viewed"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="py-10 border-t overflow-hidden"
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-5"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-muted">
                <History className="size-4 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Recently viewed</h3>
                <p className="text-muted-foreground text-xs">Pick up where you left off</p>
              </div>
            </div>
            <Button
              variant="ghost" size="sm" onClick={clear}
              className="text-muted-foreground hover:text-destructive gap-1.5 text-xs"
            >
              <X className="size-3.5" /> Clear
            </Button>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map(({ id }, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <ViewedCard id={id} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  )
}