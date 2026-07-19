import {useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Container } from '@/components/common/Container'
import { PageHeader } from '@/components/common/PageHeader'
import { PageTransition } from '@/components/common/PageTransition'
import { BrandCardSkeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { BrandCard } from '@/components/brand/BrandCard'
import { Button } from '@/components/ui/button'
import { useBrands } from '@/features/brands/hooks/use-brands'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function BrandsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState<'rating' | 'popularity' | 'trust' | 'sustainability'>(
    (searchParams.get('sort') as any) || 'rating',
  )

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''

  const { data, isPending, isError, error } = useBrands({
    search: search || undefined,
    category: category || undefined,
    sort,
    pageSize: 48,
  })

  const hasResults = data && data.items.length > 0

  const handleSort = (newSort: typeof sort) => {
    setSort(newSort)
    setSearchParams((prev) => {
      prev.set('sort', newSort)
      return prev
    })
  }

  return (
    <PageTransition>
      <PageHeader
        eyebrow="Directory"
        title="All brands"
        description={
          search
            ? `Search results for "${search}"`
            : category
              ? `Brands in ${category}`
              : 'Explore our complete brand directory.'
        }
      />

      <Container className="pb-20">
        {/* Filters and sorting bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b"
        >
          <div className="flex items-center gap-2 text-sm">
            {hasResults && (
              <span className="font-medium">
                {data.total} result{data.total !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              variant={sort === 'rating' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('rating')}
            >
              Top rated
            </Button>
            <Button
              variant={sort === 'popularity' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('popularity')}
            >
              Trending
            </Button>
            <Button
              variant={sort === 'sustainability' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('sustainability')}
            >
              Sustainable
            </Button>
            <Button
              variant={sort === 'trust' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSort('trust')}
            >
              Most trusted
            </Button>
          </div>
        </motion.div>

        {/* Loading state */}
        {isPending && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <BrandCardSkeleton key={i} />
            ))}
          </div>
        )}

       {/* Error state */}
{isError && (
  <div className="flex justify-center py-12">
    <ErrorState
      title="Failed to load brands"
      description={error?.message || "Please try again later."}
    />
  </div>
)}
        {/* Empty state */}
        {!isPending && !isError && !hasResults && (
          <div className="flex justify-center py-12">
            <EmptyState
              icon="🔍"
              title="No brands found"
              description={
                search
                  ? `No brands match "${search}". Try different keywords.`
                  : 'No brands available in this category.'
              }
            />
          </div>
        )}

        {/* Brands grid */}
        {!isPending && !isError && hasResults && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          >
            {data.items.map((brand, i) => (
              <motion.div key={brand.id} variants={itemVariants}>
                <BrandCard brand={brand} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination info */}
        {!isPending && !isError && hasResults && data.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12 text-sm text-muted-foreground"
          >
            Showing {data.pageSize} of {data.total} brands
          </motion.div>
        )}
      </Container>
    </PageTransition>
  )
}
