import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockBrands } from '@/services/brand/mock-data'
import { brandDetailPath } from '@/app/router/paths'
import { formatRating, cn } from '@/lib/utils'
import type { Brand } from '@/services/brand'

const GALLERY_BRANDS: Brand[] = [
  ...mockBrands.filter((b) => b.featured),
  ...mockBrands.filter((b) => !b.featured && b.popularity >= 80),
].slice(0, 8)

const AUTOPLAY_INTERVAL = 3500

const SLIDE_PALETTES = [
  { bg: 'from-violet-600 to-indigo-700',  badge: 'bg-violet-500/30 text-violet-100' },
  { bg: 'from-rose-500 to-pink-700',      badge: 'bg-rose-500/30 text-rose-100' },
  { bg: 'from-amber-500 to-orange-600',   badge: 'bg-amber-500/30 text-amber-100' },
  { bg: 'from-emerald-500 to-teal-700',   badge: 'bg-emerald-500/30 text-emerald-100' },
  { bg: 'from-sky-500 to-blue-700',       badge: 'bg-sky-500/30 text-sky-100' },
  { bg: 'from-fuchsia-500 to-purple-700', badge: 'bg-fuchsia-500/30 text-fuchsia-100' },
  { bg: 'from-lime-500 to-green-700',     badge: 'bg-lime-500/30 text-lime-100' },
  { bg: 'from-cyan-500 to-sky-700',       badge: 'bg-cyan-500/30 text-cyan-100' },
]

const PRICE_LABELS: Record<string, string> = {
  budget: 'Budget-friendly',
  mid: 'Mid-range',
  premium: 'Premium',
  luxury: 'Luxury',
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
    transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
  }),
}

export function BrandGallery() {
  const [current, setCurrent]   = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused]     = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir)
    setCurrent((next + GALLERY_BRANDS.length) % GALLERY_BRANDS.length)
  }, [])

  const prev = useCallback(() => go(current - 1, -1), [current, go])
  const next = useCallback(() => go(current + 1, 1), [current, go])

  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(() => go(current + 1, 1), AUTOPLAY_INTERVAL)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [current, paused, go])

  const brand   = GALLERY_BRANDS[current]
  const palette = SLIDE_PALETTES[current % SLIDE_PALETTES.length]

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-16 mb-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold">Spotlight Brands</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">Editor-curated picks you should know about</p>
        </div>
        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {GALLERY_BRANDS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > current ? 1 : -1)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                'rounded-full transition-all duration-300',
                i === current ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60',
              )}
            />
          ))}
        </div>
      </div>

      {/* Slide */}
      <div
        className="relative overflow-hidden rounded-2xl mx-4 md:mx-8 lg:mx-16"
        style={{ height: 'clamp(220px, 45vw, 440px)' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={brand.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={cn('absolute inset-0 bg-linear-to-br flex items-center', palette.bg)}
          >
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 size-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 size-56 rounded-full bg-white/5" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-size-[32px_32px]" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 md:gap-12 w-full px-6 sm:px-10 md:px-16 lg:px-20">

              {/* Logo box — hidden on very small screens, shown on sm+ */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.5, type: 'spring', stiffness: 200 }}
                className="hidden sm:flex shrink-0 bg-white rounded-2xl shadow-2xl items-center justify-center"
                style={{ width: 'clamp(80px, 14vw, 160px)', height: 'clamp(80px, 14vw, 160px)' }}
              >
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="object-contain"
                  style={{ maxWidth: '75%', maxHeight: '75%' }}
                />
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.45 }}
                className="flex-1 text-white min-w-0 w-full"
              >
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className={cn('text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full', palette.badge)}>
                    {brand.category}
                  </span>
                  {brand.sustainabilityScore >= 80 && (
                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/20">
                      🌿 Eco
                    </span>
                  )}
                  {brand.popularity >= 85 && (
                    <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/20">
                      <TrendingUp className="size-2.5" /> Trending
                    </span>
                  )}
                </div>

                {/* Brand name */}
                <h3
                  className="font-display font-bold text-white leading-tight mb-1.5 truncate"
                  style={{ fontSize: 'clamp(1.4rem, 6vw, 2.8rem)' }}
                >
                  {brand.name}
                </h3>

                {/* Description — hidden on mobile */}
                <p
                  className="hidden sm:block text-white/80 leading-relaxed mb-3 line-clamp-2"
                  style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)', maxWidth: '520px' }}
                >
                  {brand.description}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="size-3.5 fill-amber-300 text-amber-300" />
                    <span className="font-bold text-white text-sm">{formatRating(brand.rating)}</span>
                    <span className="text-white/60 text-xs hidden sm:inline">({(brand.reviewsCount / 1000).toFixed(1)}k)</span>
                  </div>
                  <div className="w-px h-3 bg-white/20 hidden sm:block" />
                  <span className="text-white/80 text-xs sm:text-sm">{brand.country}</span>
                  <div className="w-px h-3 bg-white/20 hidden sm:block" />
                  <span className="text-white/80 text-xs sm:text-sm capitalize hidden sm:inline">
                    {PRICE_LABELS[brand.priceRange] ?? brand.priceRange}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  to={brandDetailPath(brand.slug)}
                  className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold rounded-xl px-4 py-2 text-sm hover:bg-white/90 transition-colors shadow-lg"
                >
                  View Brand <ChevronRight className="size-4" />
                </Link>
              </motion.div>
            </div>

            {/* Progress bar */}
            {!paused && (
              <motion.div
                key={`progress-${brand.id}`}
                className="absolute bottom-0 left-0 h-1 bg-white/50 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: 'linear' }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="size-4 sm:size-5" />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all"
        >
          <ChevronRight className="size-4 sm:size-5" />
        </button>

        {/* Counter */}
        <div className="absolute bottom-3 right-3 z-20 text-white/70 text-xs font-medium tabular-nums">
          {current + 1} / {GALLERY_BRANDS.length}
        </div>
      </div>
    </section>
  )
}