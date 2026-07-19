import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/button'
import { BrandCard } from '@/components/brand/BrandCard'
import { useFeaturedBrands } from '@/features/brands/hooks/use-brands'
import { paths } from '@/app/router/paths'

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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

export function FeaturedBrandsSection() {
  const { data: brands, isPending } = useFeaturedBrands()

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
          <motion.div variants={itemVariants} className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                Featured brands
              </h2>
              <p className="text-muted-foreground mt-2">
                Hand-picked, high-trust labels curated by our editors.
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to={paths.brands}>
                View all <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={sectionVariants}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {isPending
              ? Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-muted h-96 rounded-xl animate-pulse"
                  />
                ))
              : brands?.map((brand, i) => (
                  <motion.div
                    key={brand.id}
                    variants={itemVariants}
                    custom={i}
                  >
                    <BrandCard brand={brand} variant="featured" index={i} />
                  </motion.div>
                ))}
          </motion.div>

          {/* Mobile CTA */}
          <motion.div variants={itemVariants} className="sm:hidden">
            <Button asChild className="w-full">
              <Link to={paths.brands}>
                View all brands <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
