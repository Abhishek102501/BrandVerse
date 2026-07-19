import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/brand/SearchBar'
import { paths } from '@/app/router/paths'
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  onSearch?: (query: string) => void
}

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}


const gridAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3,
    },
  },
}

const gridItemAnimation = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-24">
      {/* Animated background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 size-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-0 size-72 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 size-80 bg-primary/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80caff0a_1px,transparent_1px),linear-gradient(to_bottom,#80caff0a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <Container className="relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge with animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-primary/5 border-primary/20 text-sm font-medium text-primary"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
              <Sparkles className="size-4" />
            </motion.div>
            Discover brands worth following
          </motion.div>

          {/* Main heading with staggered animation */}
          <div className="space-y-4">
            <motion.h1
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className={cn(
                'font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight',
                'bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent',
              )}
            >
              Find the fashion brands
            </motion.h1>
            <motion.h1
              custom={1}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className={cn(
                'font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight',
                'bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent',
              )}
            >
              worth your wardrobe
            </motion.h1>
          </div>

          {/* Subheading */}
          <motion.p
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Ranked by ratings, reviews, popularity, sustainability and trust. Discover, compare
            and follow clothing brands with confidence.
          </motion.p>

          {/* Search bar */}
          <motion.div
            custom={3}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="pt-4"
          >
            <SearchBar
              onSearch={onSearch}
              placeholder="Search brands, styles, sustainability..."
              className="max-w-2xl mx-auto"
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            custom={4}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" asChild>
                <Link to={paths.brands}>
                  Explore all brands
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" asChild>
                <Link to={paths.categories}>Browse categories</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating stats with grid animation */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={gridAnimation}
            className="grid grid-cols-3 gap-8 pt-8 md:pt-12"
          >
            {[
              { label: '500+', description: 'Brands tracked' },
              { label: '50k+', description: 'Community members' },
              { label: '4.6★', description: 'Average rating' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={gridItemAnimation}
                whileHover={{ y: -5 }}
                animate="float"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <p className="font-display text-2xl md:text-3xl font-bold text-primary">
                  {stat.label}
                </p>
                <p className="text-muted-foreground text-sm mt-1">{stat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
