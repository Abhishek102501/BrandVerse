import { PageTransition } from '@/components/common/PageTransition'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Heart, Share2, Star } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BrandCard } from '@/components/brand/BrandCard'
import { useBrand, useSimilarBrands } from '@/features/brands/hooks/use-brands'
import { useFavoritesStore } from '@/store/favorites.store'
import { useRecentlyViewedStore } from '@/store/recently-viewed.store'
import { paths } from '@/app/router/paths'
import { formatCount, formatRating, cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export function BrandDetailPage() {
  const { slug = '' } = useParams()
  const { data: brand, isPending, isError } = useBrand(slug)
  const { data: similarBrands, isPending: isSimilarLoading } = useSimilarBrands(slug, 4)

  const favorites = useFavoritesStore((state) => state.ids)
  const toggleFavorite = useFavoritesStore((state) => state.toggle)
  const addViewed = useRecentlyViewedStore((state) => state.addViewed)

  const isFav = brand ? favorites.includes(brand.id) : false

  useEffect(() => {
    if (brand) {
      addViewed(brand.id)
    }
  }, [brand, addViewed])

  if (isPending) {
    return (
    <PageTransition>
      <Container className="py-12">
        <div className="bg-muted h-96 rounded-xl animate-pulse" />
      </Container>
        </PageTransition>
    )
  }

  if (isError || !brand) {
    return (
    <PageTransition>
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-dashed p-12 text-center"
        >
          <p className="font-medium">Brand not found</p>
          <p className="text-muted-foreground mt-1 text-sm">
            This brand may no longer be available.
          </p>
          <Button asChild className="mt-4">
            <Link to={paths.brands}>Back to brands</Link>
          </Button>
        </motion.div>
      </Container>
    </PageTransition>
    )
  }

  return (
    <PageTransition>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      <Container className="py-8">
        <motion.div variants={itemVariants}>
          <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
            <Link to={paths.brands}>
              <ArrowLeft className="size-4" /> Back to brands
            </Link>
          </Button>
        </motion.div>
       
        <motion.div
          variants={itemVariants}
          className="grid gap-8 md:grid-cols-3 mb-12"
        >
          <div className="md:col-span-1">
            <motion.img
              src={brand.logoUrl}
              alt={brand.name}
              className="bg-muted w-full rounded-xl"
            />
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="font-display text-4xl font-bold">{brand.name}</h1>
                  <p className="text-muted-foreground mt-1 capitalize">
                    {brand.category} • {brand.country} • {brand.priceRange}
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleFavorite(brand.id)}
                  className="shrink-0 p-2"
                  aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  aria-pressed={isFav}
                >
                  <Heart
                    className={cn('size-6 transition-colors', isFav && 'fill-primary text-primary')}
                  />
                </motion.button>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {brand.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="size-5 fill-amber-400 text-amber-400" />
                <span className="text-2xl font-bold">{formatRating(brand.rating)}</span>
                <span className="text-muted-foreground">
                  ({formatCount(brand.reviewsCount)} reviews)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer">
                  Visit website <ExternalLink className="size-4" />
                </a>
              </Button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border hover:bg-accent transition-colors"
                aria-label="Share this brand"
              >
                <Share2 className="size-4" />
                Share
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12 pb-12 border-b"
        >
          {[
            { label: 'Rating', value: formatRating(brand.rating), unit: '/ 5' },
            { label: 'Popularity', value: brand.popularity, unit: '/ 100' },
            { label: 'Sustainability', value: brand.sustainabilityScore, unit: '/ 100' },
            { label: 'Trust Score', value: brand.trustScore, unit: '/ 100' },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="text-center py-4">
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-primary">
                  {stat.value}
                  <span className="text-sm text-muted-foreground ml-1">{stat.unit}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {brand.tags.length > 0 && (
          <motion.div variants={itemVariants} className="mb-12">
            <h3 className="font-display font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {brand.tags
                .filter((tag) => !tag.startsWith('__'))
                .map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-accent text-sm capitalize"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </motion.div>
         
        )}

        {similarBrands && similarBrands.length > 0 && (
          <motion.div variants={itemVariants}>
            <h2 className="font-display text-2xl font-bold mb-6">Similar brands</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {isSimilarLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-muted h-72 rounded-xl animate-pulse" />
                  ))
                : similarBrands.map((b, i) => (
                    <BrandCard key={b.id} brand={b} variant="default" index={i} />
                  ))}
            </div>
          </motion.div>
        )}
      </Container>
    </motion.div>
     </PageTransition>
  )
}
