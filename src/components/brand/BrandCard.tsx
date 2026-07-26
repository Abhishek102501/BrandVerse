import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Star, TrendingUp, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Brand } from '@/services/brand'
import { brandDetailPath } from '@/app/router/paths'
import { useFavoritesStore } from '@/store/favorites.store'
import { formatCount, formatRating, cn } from '@/lib/utils'

interface BrandCardProps {
  brand: Brand
  variant?: 'default' | 'compact' | 'featured'
  index?: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' },
  }),
}

const hoverVariants = {
  hover: {
    y: -6,
    boxShadow: '0 20px 40px rgba(0,0,0,0.10)',
    transition: { duration: 0.3, type: 'spring', stiffness: 300 },
  },
}

const imageVariants = {
  hover: { scale: 1.05, transition: { duration: 0.4 } },
}

function BrandLogo({
  brand,
  className,
  imgClassName,
}: {
  brand: Brand
  className?: string
  imgClassName?: string
}) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <img
        src={brand.logoUrl}
        alt={brand.name}
        className={cn('object-contain', imgClassName)}
        loading="lazy"
        onError={(e) => {
          const svg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'><rect width='200' height='80' fill='%236d28d9'/><text x='100' y='50' text-anchor='middle' font-family='Arial,sans-serif' font-size='20' font-weight='700' fill='white'>${encodeURIComponent(brand.name)}</text></svg>`
          e.currentTarget.src = svg
          e.currentTarget.onerror = null
        }}
      />
    </div>
  )
}

// ── DEFAULT ──────────────────────────────────────────────────────────────────
function DefaultCard({ brand, index }: BrandCardProps) {
  const favorites = useFavoritesStore((s) => s.ids)
  const toggleFavorite = useFavoritesStore((s) => s.toggle)
  const isFav = favorites.includes(brand.id)
  const isTrending = (brand.popularity + brand.trustScore) / 2 > 75

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      variants={{ ...cardVariants, ...hoverVariants }}
      viewport={{ once: true, margin: '-50px' }}
      className="group relative h-full"
    >
      <Card className="h-full overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 rounded-2xl">
        <CardContent className="p-0 flex flex-col h-full">

          {/* Logo */}
          <div className="relative bg-white flex items-center justify-center border-b" style={{ height: '160px' }}>
            <motion.div variants={imageVariants} className="flex items-center justify-center w-full h-full p-4">
              <BrandLogo brand={brand} imgClassName="max-h-[80px] max-w-[140px] w-auto h-auto" />
            </motion.div>

            <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end">
              {isFav && (
                <Badge className="bg-primary text-primary-foreground text-[10px]">Saved</Badge>
              )}
              {isTrending && (
                <Badge variant="outline" className="gap-1 bg-white text-[10px]">
                  <TrendingUp className="size-3" /> Trending
                </Badge>
              )}
            </div>

            <motion.button
              onClick={(e) => { e.preventDefault(); toggleFavorite(brand.id) }}
              className={cn(
                'absolute bottom-3 left-3 z-10 p-2 rounded-full transition-all shadow-sm',
                'bg-white/90 backdrop-blur-sm hover:bg-white',
                'dark:bg-black/60 dark:hover:bg-black/80',
              )}
              whileTap={{ scale: 0.9 }}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={cn('size-4 transition-colors', isFav && 'fill-red-500 text-red-500')} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                {brand.name}
              </h3>
              <p className="text-muted-foreground text-xs capitalize truncate">
                {brand.category} • {brand.country}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-accent/50">
                <div className="flex items-center gap-1 text-primary font-semibold">
                  <Star className="size-3" />{formatRating(brand.rating)}
                </div>
                <div className="text-muted-foreground text-[10px]">Rating</div>
              </div>
              <div className="p-2 rounded-lg bg-accent/50">
                <div className="font-semibold">{brand.popularity}</div>
                <div className="text-muted-foreground text-[10px]">Popularity</div>
              </div>
              <div className="p-2 rounded-lg bg-accent/50">
                <div className="font-semibold">{brand.sustainabilityScore}</div>
                <div className="text-muted-foreground text-[10px]">Eco</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
              <span>{formatCount(brand.reviewsCount)} reviews</span>
              {brand.websiteUrl && (
                <a
                  href={brand.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
              
              onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-primary hover:underline font-medium relative z-10"
                >
                  Official Site <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Link to={brandDetailPath(brand.slug)} className="absolute inset-0 z-0" aria-label={brand.name} />
    </motion.div>
  )
}

// ── COMPACT ──────────────────────────────────────────────────────────────────
function CompactCard({ brand, index }: BrandCardProps) {
  const favorites = useFavoritesStore((s) => s.ids)
  const toggleFavorite = useFavoritesStore((s) => s.toggle)
  const isFav = favorites.includes(brand.id)

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group relative"
    >
      <Card className="cursor-pointer overflow-hidden hover:border-primary/50 transition-colors rounded-xl">
        <CardContent className="p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="size-10 rounded-lg bg-white border flex items-center justify-center shrink-0 overflow-hidden p-1">
              <BrandLogo brand={brand} imgClassName="w-full h-full object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {brand.name}
              </p>
              <p className="text-muted-foreground text-xs capitalize truncate">
                {brand.category} • {brand.country}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <div className="font-semibold text-sm flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {formatRating(brand.rating)}
              </div>
              {brand.websiteUrl && (
                <a
                  href={brand.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[10px] text-primary hover:underline flex items-center gap-0.5 relative z-10"
                >
                  Visit <ExternalLink className="size-2.5" />
                </a>
              )}
            </div>
            <motion.button
              onClick={(e) => { e.preventDefault(); toggleFavorite(brand.id) }}
              className="relative z-10 p-1.5 hover:bg-accent rounded-lg transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={cn('size-4 transition-colors', isFav && 'fill-red-500 text-red-500')} />
            </motion.button>
          </div>
        </CardContent>
      </Card>
      <Link to={brandDetailPath(brand.slug)} className="absolute inset-0 z-0" aria-label={brand.name} />
    </motion.div>
  )
}

// ── FEATURED ─────────────────────────────────────────────────────────────────
function FeaturedCard({ brand, index }: BrandCardProps) {
  const favorites = useFavoritesStore((s) => s.ids)
  const toggleFavorite = useFavoritesStore((s) => s.toggle)
  const isFav = favorites.includes(brand.id)

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      variants={{ ...cardVariants, ...hoverVariants }}
      viewport={{ once: true, margin: '-50px' }}
      className="relative"
    >
      <Card className="overflow-hidden cursor-pointer rounded-2xl hover:shadow-lg transition-all">
        <CardContent className="p-0">
          <div className="relative bg-white flex items-center justify-center border-b" style={{ height: '160px' }}>
            <motion.div variants={imageVariants} className="flex items-center justify-center w-full h-full p-4">
              <BrandLogo brand={brand} imgClassName="max-h-[90px] max-w-[160px] w-auto h-auto" />
            </motion.div>

            <motion.button
              onClick={(e) => { e.preventDefault(); toggleFavorite(brand.id) }}
              className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full transition-colors shadow-sm"
              whileTap={{ scale: 0.9 }}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={cn('size-4 transition-colors', isFav && 'fill-red-500 text-red-500')} />
            </motion.button>
          </div>

          <div className="p-4">
            <h3 className="font-display text-lg font-bold">{brand.name}</h3>
            <p className="text-muted-foreground text-sm capitalize mb-1">{brand.category} • {brand.country}</p>
            <p className="text-muted-foreground text-xs line-clamp-2 mb-3">{brand.description}</p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 font-semibold">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {formatRating(brand.rating)}
                </div>
                <div className="text-muted-foreground">
                  Pop: <span className="font-semibold text-foreground">{brand.popularity}</span>
                </div>
              </div>
              {brand.websiteUrl && (
                <a
                  href={brand.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs text-primary hover:underline font-medium relative z-10"
                >
                  Official Site <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Link to={brandDetailPath(brand.slug)} className="absolute inset-0 z-0" aria-label={brand.name} />
    </motion.div>
  )
}

// ── EXPORT ───────────────────────────────────────────────────────────────────
export function BrandCard({ brand, variant = 'default', index = 0 }: BrandCardProps) {
  switch (variant) {
    case 'compact':  return <CompactCard  brand={brand} index={index} />
    case 'featured': return <FeaturedCard brand={brand} index={index} />
    default:         return <DefaultCard  brand={brand} index={index} />
  }
}