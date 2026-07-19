import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
}

const logoVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: 'backOut' },
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: { duration: 1.5, repeat: Infinity },
  },
}

const dotsVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
}

const dotAnimation = {
  animate: (i: number) => ({
    y: [0, -10, 0],
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      repeat: Infinity,
    },
  }),
}

interface LoadingScreenProps {
  show: boolean
}

export function LoadingScreen({ show }: LoadingScreenProps) {
  if (!show) return null

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="text-center space-y-8">
        {/* Animated logo */}
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate={['visible', 'pulse']}
          className="inline-flex items-center justify-center"
        >
          <div className="bg-primary text-primary-foreground grid size-20 place-items-center rounded-2xl font-display text-3xl font-bold shadow-lg">
            B
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="space-y-2"
        >
          <h1 className="font-display text-2xl font-bold">BrandVerse</h1>
          <p className="text-muted-foreground text-sm">Loading amazing brands...</p>
        </motion.div>

        {/* Animated dots */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex justify-center items-end gap-1 h-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={dotsVariants}
              animate={dotAnimation}
              className="size-2 bg-primary rounded-full"
            />
          ))}
        </motion.div>

        {/* Progress bar */}
        <motion.div className="w-32 h-1 bg-muted rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
