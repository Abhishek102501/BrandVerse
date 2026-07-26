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
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
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

  const brand = GALLERY_BRANDS[current]
  const palette = SLIDE_PALETTES[current % SLIDE_PALETTES.length]

  return (
    <section className="w-full">
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-16 mb-4">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">Spotlight Brands</h2>
          <p className="text-muted-foreground text-sm mt-0.5">Editor-curated picks you should know about</p>
        </div>
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

      <div
        className="relative overflow-hidden rounded-2xl mx-4 md:mx-8 lg:mx-16"
        style={{ height: 'clamp(260px, 38vw, 440px)' }}
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
            <div className="absolute -top-20 -right-20 size-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 size-56 rounded-full bg-white/5" />
            <div className="absolute top-1/2 right-1/4 size-32 rounded-full bg-white/5" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full px-8 md:px-12 lg:px-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, duration: 0.5, type: 'spring', stiffness: 200 }}
                className="shrink-0 bg-white rounded-2xl shadow-2xl flex items-center justify-center"
                style={{ width: 'clamp(100px, 16vw, 180px)', height: 'clamp(100px, 16vw, 180px)' }}
              >
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="object-contain"
                  style={{ maxWidth: '70%', maxHeight: '70%' }}
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&size=128&background=6d28d9&color=fff&bold=true`
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.45 }}
                className="flex-1 text-white min-w-0"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={cn('text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full', palette.badge)}>
                    {brand.category}
                  </span>
                  {brand.sustainabilityScore >= 80 && (
                    <span className="text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/20 text-white">
                      🌿 Eco-friendly
                    </span>
                  )}
                  {brand.popularity >= 85 && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/20 text-white">
                      <TrendingUp className="size-3" /> Trending
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-white leading-tight mb-2"
                  style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)' }}>
                  {brand.name}
                </h3>

                <p className="text-white/80 leading-relaxed mb-4 line-clamp-2"
                  style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)', maxWidth: '520px' }}>
                  {brand.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-5">
                  <div className="flex items-center gap-1.5">
                    <Star className="size-4 fill-amber-300 text-amber-300" />
                    <span className="font-bold text-white text-sm">{formatRating(brand.rating)}</span>
                    <span className="text-white/60 text-xs">({(brand.reviewsCount / 1000).toFixed(1)}k reviews)</span>
                  </div>
                  <div className="w-px h-4 bg-white/20" />
                  <span className="text-white/80 text-sm">{brand.country}</span>
                  <div className="w-px h-4 bg-white/20" />
                  <span className="text-white/80 text-sm capitalize">{PRICE_LABELS[brand.priceRange] ?? brand.priceRange}</span>
                </div>

                <Link
                  to={brandDetailPath(brand.slug)}
                  className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-white/90 transition-colors shadow-lg"
                >
                  View Brand <ChevronRight className="size-4" />
                </Link>
              </motion.div>
            </div>

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

        <button onClick={prev} aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all hover:scale-110">
          <ChevronLeft className="size-5" />
        </button>
        <button onClick={next} aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all hover:scale-110">
          <ChevronRight className="size-5" />
        </button>

        <div className="absolute bottom-4 right-4 z-20 text-white/70 text-xs font-medium tabular-nums">
          {current + 1} / {GALLERY_BRANDS.length}
        </div>
      </div>
    </section>
  )
}