import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, X} from 'lucide-react'
import { Container } from '@/components/common/Container'
import { PageHeader } from '@/components/common/PageHeader'
import { PageTransition } from '@/components/common/PageTransition'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/common/EmptyState'
import { useCompareBrands, useBrands } from '@/features/brands/hooks/use-brands'
import { brandDetailPath} from '@/app/router/paths'
import { formatRating, formatCount } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    searchParams.get('brands')?.split(',').filter(Boolean) || []
  )
  const [searchOpen, setSearchOpen] = useState(false)

  const { data: compareData, isPending } = useCompareBrands(selectedSlugs)
  const { data: browseData } = useBrands({ pageSize: 50 })

  const handleAddBrand = (slug: string) => {
    if (!selectedSlugs.includes(slug) && selectedSlugs.length < 4) {
      const newSlugs = [...selectedSlugs, slug]
      setSelectedSlugs(newSlugs)
      setSearchParams({ brands: newSlugs.join(',') })
    }
  }

  const handleRemove = (slug: string) => {
    const newSlugs = selectedSlugs.filter((s) => s !== slug)
    setSelectedSlugs(newSlugs)
    setSearchParams(newSlugs.length > 0 ? { brands: newSlugs.join(',') } : {})
  }

  const metrics = [
    { key: 'rating', label: 'Rating' },
    { key: 'reviewsCount', label: 'Reviews' },
    { key: 'popularity', label: 'Popularity' },
    { key: 'sustainabilityScore', label: 'Sustainability' },
    { key: 'trustScore', label: 'Trust Score' },
  ]

  return (
    <PageTransition>
      <PageHeader
        eyebrow="Tools"
        title="Compare brands"
        description="Side-by-side comparison of up to 4 brands."
      />

      <Container className="pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display font-semibold mb-2">
                {selectedSlugs.length === 0
                  ? 'Select up to 4 brands to compare'
                  : `Comparing ${selectedSlugs.length} brand${selectedSlugs.length !== 1 ? 's' : ''}`}
              </h2>
              <p className="text-muted-foreground text-sm">
                Add brands to see detailed metrics side by side.
              </p>
            </div>
            <Button
              onClick={() => setSearchOpen(!searchOpen)}
              variant={selectedSlugs.length < 4 ? 'default' : 'outline'}
              disabled={selectedSlugs.length >= 4}
            >
              <Plus className="size-4" />
              Add brand
            </Button>
          </div>

          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-6 rounded-lg bg-accent/5 border space-y-4"
            >
              <div className="grid gap-3 sm:grid-cols-2 max-h-96 overflow-y-auto">
                {browseData?.items.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => {
                      handleAddBrand(brand.slug)
                      setSearchOpen(false)
                    }}
                    disabled={selectedSlugs.includes(brand.slug)}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <img src={brand.logoUrl} alt="" className="size-8 rounded" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{brand.name}</p>
                        <p className="text-muted-foreground text-xs capitalize">
                          {brand.category}
                        </p>
                      </div>
                    </div>
                    <Plus className="size-4 flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {selectedSlugs.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-12 flex flex-wrap gap-3"
          >
            {selectedSlugs.map((slug) => {
              const brand = compareData?.find((b) => b.slug === slug)
              if (!brand) return null
              return (
                <motion.div key={slug} variants={itemVariants}>
                  <Card className="relative overflow-hidden">
                    <CardContent className="flex items-center gap-3 pr-10">
                      <img src={brand.logoUrl} alt="" className="size-10 rounded" />
                      <div>
                        <p className="font-medium">{brand.name}</p>
                        <p className="text-muted-foreground text-xs">{brand.country}</p>
                      </div>
                    </CardContent>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemove(slug)}
                      className="absolute top-2 right-2 p-1 hover:bg-destructive/10 rounded-md"
                      aria-label={`Remove ${brand.name}`}
                    >
                      <X className="size-4" />
                    </motion.button>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {isPending && <div className="bg-muted h-96 rounded-xl animate-pulse" />}

        {selectedSlugs.length > 0 && compareData && !isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="overflow-x-auto rounded-lg border"
          >
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Metric</th>
                  {compareData.map((brand) => (
                    <th key={brand.id} className="px-4 py-3 text-center font-medium">
                      <Link
                        to={brandDetailPath(brand.slug)}
                        className="hover:text-primary transition-colors"
                      >
                        {brand.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.key} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-4 font-medium">{metric.label}</td>
                    {compareData.map((brand) => {
                      const value = brand[metric.key as keyof typeof brand]
                      return (
                        <td key={brand.id} className="px-4 py-4 text-center">
                          {metric.key === 'rating'
                            ? formatRating(value as number)
                            : metric.key === 'reviewsCount'
                              ? formatCount(value as number)
                              : value}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {selectedSlugs.length === 0 && (
          <div className="flex justify-center py-12">
            <EmptyState
              icon="⚖️"
              title="No brands selected"
              description="Click 'Add brand' to start comparing."
              action={{ label: 'Add your first brand', onClick: () => setSearchOpen(true) }}
            />
          </div>
        )}
      </Container>
    </PageTransition>
  )
}
