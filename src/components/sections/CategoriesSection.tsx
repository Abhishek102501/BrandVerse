import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { useCategories } from '@/features/brands/hooks/use-brands'
import { cn } from '@/lib/utils'

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

interface CategoryStyle {
  bg: string
  icon: string
  accent: string
  textAccent: string
  textDesc: string
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  streetwear: {
    bg: 'from-zinc-900 via-zinc-800 to-zinc-700',
    icon: '🧢',
    accent: 'bg-white/15 text-white border border-white/25',
    textAccent: 'text-white',
    textDesc: 'text-white/75',
  },
  minimalist: {
    bg: 'from-stone-100 via-stone-200 to-stone-300',
    icon: '🤍',
    accent: 'bg-stone-900/15 text-stone-900 border border-stone-900/20',
    textAccent: 'text-stone-900',
    textDesc: 'text-stone-700',
  },
  sustainable: {
    bg: 'from-emerald-800 via-emerald-700 to-teal-600',
    icon: '🌿',
    accent: 'bg-emerald-300/20 text-emerald-100 border border-emerald-300/30',
    textAccent: 'text-white',
    textDesc: 'text-white/80',
  },
  athleisure: {
    bg: 'from-blue-900 via-blue-700 to-indigo-600',
    icon: '⚡',
    accent: 'bg-blue-300/20 text-blue-100 border border-blue-300/30',
    textAccent: 'text-white',
    textDesc: 'text-white/80',
  },
  luxury: {
    bg: 'from-amber-950 via-yellow-900 to-amber-800',
    icon: '✨',
    accent: 'bg-amber-300/25 text-amber-100 border border-amber-300/35',
    textAccent: 'text-amber-200',
    textDesc: 'text-amber-100/80',
  },
  ethnic: {
    bg: 'from-rose-900 via-pink-800 to-fuchsia-800',
    icon: '🪡',
    accent: 'bg-rose-300/20 text-rose-100 border border-rose-300/30',
    textAccent: 'text-rose-100',
    textDesc: 'text-rose-100/80',
  },
  default: {
    bg: 'from-gray-800 via-gray-700 to-gray-600',
    icon: '👗',
    accent: 'bg-white/15 text-white border border-white/20',
    textAccent: 'text-white',
    textDesc: 'text-white/75',
  },
}

function CategoryIllustration({ slug }: { slug: string }) {
  if (slug === 'streetwear') return (
    <svg className="absolute right-4 bottom-14 opacity-10 w-36 h-36" viewBox="0 0 100 100">
      <rect x="30" y="10" width="40" height="30" rx="20" fill="white" />
      <rect x="20" y="38" width="60" height="50" rx="4" fill="white" />
      <rect x="10" y="42" width="20" height="40" rx="4" fill="white" />
      <rect x="70" y="42" width="20" height="40" rx="4" fill="white" />
    </svg>
  )
  if (slug === 'minimalist') return (
    <svg className="absolute right-6 bottom-14 opacity-10 w-32 h-32" viewBox="0 0 100 100">
      <line x1="50" y1="5" x2="50" y2="95" stroke="#333" strokeWidth="2" />
      <line x1="5" y1="50" x2="95" y2="50" stroke="#333" strokeWidth="2" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#333" strokeWidth="2" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="#333" strokeWidth="1.5" />
    </svg>
  )
  if (slug === 'sustainable') return (
    <svg className="absolute right-4 bottom-14 opacity-15 w-36 h-36" viewBox="0 0 100 100">
      <path d="M50 90 Q20 70 20 40 Q20 15 50 10 Q80 15 80 40 Q80 70 50 90Z" fill="white" />
      <path d="M50 90 Q50 50 70 30" fill="none" stroke="rgba(0,80,0,0.5)" strokeWidth="2" />
      <path d="M50 70 Q35 55 30 40" fill="none" stroke="rgba(0,80,0,0.4)" strokeWidth="1.5" />
    </svg>
  )
  if (slug === 'athleisure') return (
    <svg className="absolute right-4 bottom-14 opacity-10 w-36 h-36" viewBox="0 0 100 100">
      <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="white" strokeWidth="3" />
      <polygon points="50,20 80,50 50,80 20,50" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="50" cy="50" r="10" fill="white" />
    </svg>
  )
  if (slug === 'luxury') return (
    <svg className="absolute right-4 bottom-14 opacity-20 w-36 h-36" viewBox="0 0 100 100">
      <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#C8A96E" />
    </svg>
  )
  if (slug === 'ethnic') return (
    <svg className="absolute right-4 bottom-14 opacity-15 w-36 h-36" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="1.5" />
      <polygon points="50,5 55,45 95,50 55,55 50,95 45,55 5,50 45,45" fill="white" />
    </svg>
  )
  return null
}

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
          className="space-y-10"
        >
          <motion.div variants={itemVariants}>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Explore by category
            </h2>
            <p className="text-muted-foreground mt-2">
              Find brands that match your style and values
            </p>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {isPending
              ? Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-muted h-52 rounded-2xl animate-pulse"
                  />
                ))
              : categories?.map((category, i) => {
                  const style = CATEGORY_STYLES[category.slug] ?? CATEGORY_STYLES.default
                  const isFeature = i === 0

                  return (
                    <motion.div
                      key={category.id}
                      variants={itemVariants}
                      className={cn(isFeature && 'lg:col-span-2')}
                    >
                      <Link to={`${categoryPath}?category=${category.slug}`}>
                        <motion.div
                          whileHover={{ scale: 1.012 }}
                          transition={{ duration: 0.25 }}
                          className={cn(
                            'group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br',
                            style.bg,
                          )}
                          style={{ height: isFeature ? '280px' : '230px' }}
                        >
                          {/* Decorative illustration */}
                          <CategoryIllustration slug={category.slug} />

                          {/* Top-to-bottom fade */}
                          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />

                          {/* Badge */}
                          <div className="absolute top-3 right-3 z-10">
                            <span className={cn(
                              'text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md',
                              style.accent,
                            )}>
                              {category.brandCount} brands
                            </span>
                          </div>

                          {/* Bottom text */}
                          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                            <div className="flex items-end justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="text-2xl leading-none">{style.icon}</span>
                                  <h3 className={cn(
                                    'font-display font-bold text-xl leading-tight',
                                    style.textAccent,
                                  )}>
                                    {category.name}
                                  </h3>
                                </div>
                                <p className={cn('text-sm leading-snug line-clamp-2', style.textDesc)}>
                                  {category.description}
                                </p>
                              </div>

                              <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-3 group-hover:translate-x-0">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5 border border-white/30">
                                  <ArrowRight className="size-4 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
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

const categoryPath = '/brands'