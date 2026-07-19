import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/button'
import { paths } from '@/app/router/paths'

const containerVariants = {
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

export function NotFoundPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[calc(100vh-4rem)] flex items-center"
    >
      <Container className="py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Animated 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
            <motion.h1
              className="font-display text-8xl md:text-9xl font-bold bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              404
            </motion.h1>
          </motion.div>

          {/* Text */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Page not found</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved. But don't worry — you
              can discover amazing brands instead!
            </p>
          </motion.div>

          {/* Floating elements */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {['🎯', '✨', '🚀'].map((emoji, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="text-4xl"
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link to={paths.home}>Back to home</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={paths.brands}>Explore brands</Link>
            </Button>
          </motion.div>

          {/* Helpful links */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-sm mx-auto pt-8"
          >
            {[
              { label: 'Home', href: paths.home },
              { label: 'Brands', href: paths.brands },
              { label: 'Compare', href: paths.compare },
              { label: 'Favorites', href: paths.favorites },
              { label: 'Profile', href: paths.profile },
              { label: 'Categories', href: paths.categories },
            ].map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.href}
                  className="inline-block px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-sm font-medium"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </motion.div>
  )
}
