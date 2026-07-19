import { motion } from 'framer-motion'
import { Flame, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/button'
import { BrandCard } from '@/components/brand/BrandCard'
import { useTrendingBrands } from '@/features/brands/hooks/use-brands'
import { paths } from '@/app/router/paths'

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export function TrendingBrandsSection() {
  const { data: brands, isPending } = useTrendingBrands(6)

  return (
    <section className="py-20 md:py-24 border-t">
      <Container>
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-amber-500/10">
                <Flame className="size-5 text-amber-500" />
              </div>
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                  Trending now
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Brands gaining momentum this month
                </p>
              </div>
            </div>
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to={paths.brands}>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <motion.div
            variants={sectionVariants}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {isPending
              ? Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-muted h-72 rounded-xl animate-pulse"
                  />
                ))
              : brands?.map((brand, i) => (
                  <motion.div
                    key={brand.id}
                    variants={itemVariants}
                    custom={i}
                  >
                    <BrandCard brand={brand} variant="default" index={i} />
                  </motion.div>
                ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
