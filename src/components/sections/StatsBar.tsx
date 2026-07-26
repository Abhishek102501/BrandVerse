import { useRef, useEffect } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { ShieldCheck, Star, Users, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Stat {
  icon: React.ReactNode
  value: number
  suffix: string
  label: string
  description: string
  color: string
  iconBg: string
}

const STATS: Stat[] = [
  {
    icon: <Star className="size-5" />,
    value: 4.6, suffix: '★', label: 'Average Rating',
    description: 'Across all listed brands',
    color: 'text-amber-500', iconBg: 'bg-amber-500/10',
  },
  {
    icon: <TrendingUp className="size-5" />,
    value: 500, suffix: '+', label: 'Brands Tracked',
    description: 'Growing every week',
    color: 'text-primary', iconBg: 'bg-primary/10',
  },
  {
    icon: <Users className="size-5" />,
    value: 50, suffix: 'k+', label: 'Community Members',
    description: 'Sharing real reviews',
    color: 'text-emerald-500', iconBg: 'bg-emerald-500/10',
  },
  {
    icon: <ShieldCheck className="size-5" />,
    value: 98, suffix: '%', label: 'Trust Score',
    description: 'Verified brand data',
    color: 'text-sky-500', iconBg: 'bg-sky-500/10',
  },
]

function AnimatedNumber({ value, suffix, color, inView }: {
  value: number; suffix: string; color: string; inView: boolean
}) {
  const motionVal = useMotionValue(0)
  const isDecimal = value % 1 !== 0
  const rounded = useTransform(motionVal, (v) =>
    isDecimal ? v.toFixed(1) : Math.round(v).toString()
  )

  useEffect(() => {
    if (!inView) return
    const controls = animate(motionVal, value, { duration: 1.6, ease: 'easeOut' })
    return controls.stop
  }, [inView, value, motionVal])

  return (
    <span className={cn('font-display font-bold tabular-nums', color)}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  )
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-12 border-t border-b">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl border bg-card hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className={cn('p-2.5 rounded-xl', stat.iconBg, stat.color)}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} color={stat.color} inView={inView} />
                </div>
                <p className="font-semibold text-sm mt-0.5">{stat.label}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}