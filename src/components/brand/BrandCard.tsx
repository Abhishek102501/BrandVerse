import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Star, TrendingUp } from 'lucide-react'
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

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.2 } },
}

function avatarFallback(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=6d28d9&color=fff&bold=true`
}

// Default variant: large card for grid layouts
function DefaultCard({ brand, index }: BrandCardProps) {
  const favorites = useFavoritesStore((state) => state.ids)
  const toggleFavorite = useFavoritesStore((state) => state.toggle)
  const isFav = favorites.includes(brand.id)

  const trendingScore = (brand.popularity + brand.trustScore) / 2
  const isTrending = trendingScore > 75

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

          {/* Logo area — white background, centered */}
          <div
            className="relative bg-white flex items-center justify-center border-b"
            style={{ height: '160px' }}
          >
            <motion.img
              src={brand.logoUrl}
              alt={brand.name}
              className="object-contain w-auto h-auto"
              style={{ maxHeight: '80px', maxWidth: '140px' }}
              variants={imageVariants}
              loading="lazy"
              onError={(e) => { e.currentTarget.src = avatarFallback(brand.name) }}
            />

            {/* Badges */}
            <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end">
              {isFav && (
                <motion.div variants={badgeVariants} initial="hidden" animate="visible">
                  <Badge className="bg-primary text-primary-foreground text-[10px]">Saved</Badge>
                </motion.div>
              )}
              {isTrending && (
                <motion.div variants={badgeVariants} initial="hidden" animate="visible">
                  <Badge variant="outline" className="gap-1 bg-white text-[10px]">
                    <TrendingUp className="size-3" /> Trending
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Favorite button */}
            <motion.button
              onClick={() => toggleFavorite(brand.id)}
              className={cn(
                'absolute bottom-3 left-3 z-10 p-2 rounded-full transition-all shadow-sm',
                'bg-white/90 backdrop-blur-sm hover:bg-white',
                'dark:bg-black/60 dark:hover:bg-black/80',
              )}
              whileTap={{ scale: 0.9 }}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <motion.div
                animate={{ scale: isFav ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Heart
                  className={cn(
                    'size-4 transition-colors',
                    isFav && 'fill-red-500 text-red-500',
                  )}
                />
              </motion.div>
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-accent/50">
                <div className="flex items-center gap-1 text-primary font-semibold">
                  <Star className="size-3" />
                  {formatRating(brand.rating)}
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

            {/* Footer */}
            <div className="text-xs text-muted-foreground">
              {formatCount(brand.reviewsCount)} reviews
            </div>
          </div>
        </CardContent>
      </Card>
      <Link
        to={brandDetailPath(brand.slug)}
        className="absolute inset-0 z-0"
        aria-label={brand.name}
      />
    </motion.div>
  )
}

// Compact variant: for lists and recently viewed
function CompactCard({ brand, index }: BrandCardProps) {
  const favorites = useFavoritesStore((state) => state.ids)
  const toggleFavorite = useFavoritesStore((state) => state.toggle)
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
            <div className="size-10 rounded-lg bg-white border flex items-center justify-center flex-shrink-0 p-1">
              <motion.img
                src={brand.logoUrl}
                alt={brand.name}
                className="w-full h-full object-contain"
                loading="lazy"
                whileHover={{ scale: 1.1 }}
                onError={(e) => { e.currentTarget.src = avatarFallback(brand.name) }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {brand.name}
              </p>
              <p className="text-muted-foreground text-xs capitalize truncate">
                {brand.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="font-semibold text-sm flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {formatRating(brand.rating)}
              </div>
            </div>
            <motion.button
              onClick={() => toggleFavorite(brand.id)}
              className="relative z-10 p-1.5 hover:bg-accent rounded-lg transition-colors"
              whileTap={{ scale: 0.9 }}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={cn(
                  'size-4 transition-colors',
                  isFav && 'fill-red-500 text-red-500',
                )}
              />
            </motion.button>
          </div>
        </CardContent>
      </Card>
      <Link
        to={brandDetailPath(brand.slug)}
        className="absolute inset-0 z-0"
        aria-label={brand.name}
      />
    </motion.div>
  )
}

// Featured variant: large showcase card
function FeaturedCard({ brand, index }: BrandCardProps) {
  const favorites = useFavoritesStore((state) => state.ids)
  const toggleFavorite = useFavoritesStore((state) => state.toggle)
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
          {/* Logo area */}
          <div
            className="relative bg-white flex items-center justify-center border-b"
            style={{ height: '160px' }}
          >
            <motion.img
              src={brand.logoUrl}
              alt={brand.name}
              className="object-contain w-auto h-auto"
              style={{ maxHeight: '90px', maxWidth: '1600px' }}
              variants={imageVariants}
              loading="lazy"
              onError={(e) => { e.currentTarget.src = avatarFallback(brand.name) }}
            />

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

            {/* Favorite button */}
            <motion.button
              onClick={() => toggleFavorite(brand.id)}
              className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full transition-colors shadow-sm"
              whileTap={{ scale: 0.9 }}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={cn(
                  'size-4 transition-colors',
                  isFav && 'fill-red-500 text-red-500',
                )}
              />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-display text-lg font-bold">{brand.name}</h3>
            <p className="text-muted-foreground text-sm capitalize mb-3">{brand.category}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 font-semibold">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {formatRating(brand.rating)}
              </div>
              <div className="text-muted-foreground">
                Popularity: <span className="font-semibold text-foreground">{brand.popularity}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Link
        to={brandDetailPath(brand.slug)}
        className="absolute inset-0 z-0"
        aria-label={brand.name}
      />
    </motion.div>
  )
}

export function BrandCard({ brand, variant = 'default', index = 0 }: BrandCardProps) {
  switch (variant) {
    case 'compact':
      return <CompactCard brand={brand} index={index} />
    case 'featured':
      return <FeaturedCard brand={brand} index={index} />
    case 'default':
    default:
      return <DefaultCard brand={brand} index={index} />
  }
}
