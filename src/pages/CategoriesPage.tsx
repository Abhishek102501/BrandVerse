import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PageTransition } from '@/components/common/PageTransition'
import { Container } from '@/components/common/Container'
import { PageHeader } from '@/components/common/PageHeader'
import { useCategories } from '@/features/brands/hooks/use-brands'
import { paths } from '@/app/router/paths'

const categoryConfig: Record<string, { image: string; accent: string }> = {
  streetwear: {
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=600&q=80',
    accent: 'from-zinc-900/80 to-zinc-900/20',
  },
  minimalist: {
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80',
    accent: 'from-stone-800/80 to-stone-800/20',
  },
  sustainable: {
    image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&q=80',
    accent: 'from-green-900/80 to-green-900/20',
  },
  athleisure: {
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    accent: 'from-blue-900/80 to-blue-900/20',
  },
  luxury: {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
    accent: 'from-yellow-900/80 to-yellow-900/20',
  },
  vintage: {
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
    accent: 'from-orange-900/80 to-orange-900/20',
  },
  formal: {
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
    accent: 'from-slate-900/80 to-slate-900/20',
  },
  traditional: {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
    accent: 'from-red-900/80 to-red-900/20',
  },
  casual: {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    accent: 'from-sky-900/80 to-sky-900/20',
  },
  funky: {
    image: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=600&q=80',
    accent: 'from-pink-900/80 to-pink-900/20',
  },
  'gen-z': {
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80',
    accent: 'from-violet-900/80 to-violet-900/20',
  },
  'kids-teen': {
    image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80',
    accent: 'from-yellow-900/80 to-yellow-900/20',
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export function CategoriesPage() {
  const { data, isPending } = useCategories()
  const navigate = useNavigate()

  const handleCategoryClick = (slug: string) => {
    navigate(`${paths.brands}?category=${slug}`)
  }

  return (
    <>
      <PageHeader
        eyebrow="Browse"
        title="Shop by category"
        description="From streetwear drops to traditional ethnic wear — find your style tribe."
      />
      <PageTransition>
        <Container className="pb-20">

          {/* Loading state */}
          {isPending && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-56 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          )}

          {/* Categories grid */}
          {!isPending && data && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {data.map((category) => {
                const config = categoryConfig[category.slug] ?? {
                  image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
                  accent: 'from-gray-900/80 to-gray-900/20',
                }

                return (
                  <motion.button
                    key={category.id}
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCategoryClick(category.slug)}
                    className="text-left w-full group"
                  >
                    <div className="relative h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">

                      {/* Background photo */}
                      <motion.img
                        src={config.image}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        variants={{
                          hover: { scale: 1.08, transition: { duration: 0.4 } },
                        }}
                        loading="lazy"
                      />

                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-linear-to-t ${config.accent}`} />

                      {/* Content */}
                      <div className="absolute inset-0 p-5 flex flex-col justify-between">

                        {/* Brand count pill */}
                        <div className="self-end">
                          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {category.brandCount} brands
                          </span>
                        </div>

                        {/* Category info */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h2 className="font-display text-xl font-bold text-white">
                              {category.name}
                            </h2>
                            <motion.div
                              variants={{
                                hover: { x: 4, transition: { duration: 0.2 } },
                              }}
                            >
                              <ArrowRight className="size-5 text-white/80" />
                            </motion.div>
                          </div>
                          <p className="text-sm text-white/75 line-clamp-2">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>
          )}

          {/* Stats bar */}
          {!isPending && data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 rounded-2xl border bg-card p-6 flex flex-wrap gap-8 justify-around text-center"
            >
              <div>
                <p className="font-display text-3xl font-bold text-primary">
                  {data.length}
                </p>
                <p className="text-muted-foreground text-sm mt-1">Categories</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-primary">
                  {data.reduce((sum, c) => sum + c.brandCount, 0)}
                </p>
                <p className="text-muted-foreground text-sm mt-1">Total brands</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-primary">
                  {data.filter((c) => c.brandCount > 0).length}
                </p>
                <p className="text-muted-foreground text-sm mt-1">Active categories</p>
              </div>
            </motion.div>
          )}

        </Container>
      </PageTransition>
    </>
  )
}