import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { mockBrands } from '@/services/brand/mock-data'

const BRANDS = [...mockBrands, ...mockBrands]

function LogoChip({ name, logoUrl }: { name: string; logoUrl: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      className="flex items-center gap-2.5 shrink-0 rounded-xl border bg-card px-4 py-2.5 shadow-sm hover:border-primary/40 hover:shadow-md transition-shadow"
    >
      <div className="size-7 rounded-md bg-white flex items-center justify-center border overflow-hidden shrink-0">
        <img
          src={logoUrl}
          alt={name}
          className="w-full h-full object-contain p-0.5"
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=64&background=6d28d9&color=fff&bold=true`
          }}
        />
      </div>
      <span className="text-sm font-medium whitespace-nowrap">{name}</span>
    </motion.div>
  )
}

export function BrandMarquee() {
  const shouldReduce = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const duration = BRANDS.length * 2.2

  return (
    <section className="py-10 border-t overflow-hidden select-none">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
        Brands in our directory
      </p>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-linear-to-l from-background to-transparent" />
    
        <div className="flex overflow-hidden mb-3">
          <motion.div
            ref={trackRef}
            className="flex gap-3"
            animate={shouldReduce ? {} : { x: ['0%', '-50%'] }}
            transition={{ duration, repeat: Infinity, ease: 'linear' }}
          >
            {BRANDS.map((b, i) => (
              <LogoChip key={`r1-${b.id}-${i}`} name={b.name} logoUrl={b.logoUrl} />
            ))}
          </motion.div>
        </div>

        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-3"
            animate={shouldReduce ? {} : { x: ['-50%', '0%'] }}
            transition={{ duration: duration * 1.15, repeat: Infinity, ease: 'linear' }}
          >
            {[...BRANDS].reverse().map((b, i) => (
              <LogoChip key={`r2-${b.id}-${i}`} name={b.name} logoUrl={b.logoUrl} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}