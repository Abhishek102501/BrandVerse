import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Card, CardContent } from '@/components/ui/card'
import { useCategories } from '@/features/brands/hooks/use-brands'
import { cn } from '@/lib/utils'

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  hover: {
    y: -4,
    transition: { duration: 0.2 },
  },
}

const accentColors = [
  'from-blue-500/10 to-blue-500/5 border-blue-500/20',
  'from-purple-500/10 to-purple-500/5 border-purple-500/20',
  'from-pink-500/10 to-pink-500/5 border-pink-500/20',
  'from-amber-500/10 to-amber-500/5 border-amber-500/20',
  'from-teal-500/10 to-teal-500/5 border-teal-500/20',
  'from-rose-500/10 to-rose-500/5 border-rose-500/20',
]

export function CategoriesSection() {
  const { data: categories, isPending } = useCategories()

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
          <motion.div variants={itemVariants}>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Explore by category
            </h2>
            <p className="text-muted-foreground mt-2">
              Find brands that match your style and values
            </p>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={sectionVariants}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {isPending
              ? Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-muted h-32 rounded-xl animate-pulse"
                  />
                ))
              : categories?.map((category, i) => {
                  const colorClass = accentColors[i % accentColors.length]
                  return (
                    <motion.div
                      key={category.id}
                      variants={itemVariants}
                      whileHover="hover"
                      custom={i}
                    >
                      <Link to={`${categoryPath}?category=${category.slug}`}>
                        <Card
                          className={cn(
                            'cursor-pointer overflow-hidden bg-gradient-to-br transition-all duration-300',
                            colorClass,
                          )}
                        >
                          <CardContent className="p-6">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <h3 className="font-display font-semibold text-lg">
                                  {category.name}
                                </h3>
                                <span className="text-sm font-medium text-muted-foreground">
                                  {category.brandCount} brands
                                </span>
                              </div>
                              <p className="text-muted-foreground text-sm line-clamp-2">
                                {category.description}
                              </p>
                              <div className="pt-2">
                                <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                  Explore →
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  )
                })}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}

// For now, use brands page as fallback
const categoryPath = '/brands'
