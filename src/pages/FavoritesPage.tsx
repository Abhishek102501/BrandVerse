import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, History, Trash2 } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { Container } from '@/components/common/Container'
import { PageHeader } from '@/components/common/PageHeader'
import { PageTransition } from '@/components/common/PageTransition'
import { Button } from '@/components/ui/button'
import { BrandCard } from '@/components/brand/BrandCard'
import { EmptyState } from '@/components/common/EmptyState'
import { useBrandById } from '@/features/brands/hooks/use-brands'
import { useFavoritesStore } from '@/store/favorites.store'
import { useRecentlyViewedStore } from '@/store/recently-viewed.store'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

function RecentlyViewedItem({ brandId }: { brandId: string }) {
  const { data: brand } = useBrandById(brandId)
  if (!brand) return null
  return <BrandCard brand={brand} variant="compact" />
}

export function FavoritesPage() {
  const favoriteIds = useFavoritesStore(useShallow((state) => state.ids))
  const clearFavorites = useFavoritesStore((state) => state.clear)

  const recentlyViewed = useRecentlyViewedStore(
    useShallow((state) => state.viewed.slice(0, 6))
  )
  const clearViewed = useRecentlyViewedStore((state) => state.clear)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [favoriteIds])

  return (
    <PageTransition>
      <PageHeader
        eyebrow="Library"
        title="Your favorites"
        description="Brands you've saved and want to follow."
      />

      <Container className="pb-20">
        {/* Favorites section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Heart className="size-5 fill-primary text-primary flex-shrink-0" />
              <div>
                <h2 className="font-display text-2xl font-bold">Favorite brands</h2>
                <p className="text-muted-foreground text-sm">
                  {favoriteIds.length} brand{favoriteIds.length !== 1 ? 's' : ''} saved
                </p>
              </div>
            </div>
            {favoriteIds.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearFavorites()}
                aria-label="Clear all favorites"
                className="w-full sm:w-auto"
              >
                <Trash2 className="size-4" /> Clear all
              </Button>
            )}
          </div>

          {!isLoading && favoriteIds.length === 0 ? (
            <motion.div variants={itemVariants}>
              <EmptyState
                icon="❤️"
                title="No favorites yet"
                description="Start exploring brands and add your favorites to your library."
              />
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {favoriteIds.map((id) => (
                <motion.div key={id} variants={itemVariants}>
                  <div className="bg-muted h-40 rounded-lg animate-pulse" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Recently viewed section */}
        {recentlyViewed.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <History className="size-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <h2 className="font-display text-2xl font-bold">Recently viewed</h2>
                  <p className="text-muted-foreground text-sm">
                    {recentlyViewed.length} brand{recentlyViewed.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearViewed()}
                aria-label="Clear view history"
                className="w-full sm:w-auto"
              >
                <Trash2 className="size-4" /> Clear
              </Button>
            </div>

            <motion.div
              variants={containerVariants}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {recentlyViewed.map((view) => (
                <motion.div key={view.id} variants={itemVariants}>
                  <RecentlyViewedItem brandId={view.id} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </Container>
    </PageTransition>
  )
}