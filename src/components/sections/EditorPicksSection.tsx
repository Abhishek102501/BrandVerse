import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { BrandCard } from '@/components/brand/BrandCard'
import { useEditorPicks } from '@/features/brands/hooks/use-brands'

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
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

export function EditorPicksSection() {
  const { data: brands, isPending } = useEditorPicks(5)

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
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
              <BookOpen className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                Editor's picks
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Our team's favorite discoveries this season
              </p>
            </div>
          </motion.div>

          {/* Horizontal scroll list - compact cards */}
          <motion.div
            variants={sectionVariants}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            {isPending
              ? Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="bg-muted h-40 rounded-xl animate-pulse"
                  />
                ))
              : brands?.map((brand, i) => (
                  <motion.div
                    key={brand.id}
                    variants={itemVariants}
                    custom={i}
                  >
                    <BrandCard brand={brand} variant="compact" index={i} />
                  </motion.div>
                ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
