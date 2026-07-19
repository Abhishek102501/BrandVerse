import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Container } from '@/components/common/Container'
import { mainNav } from '@/config/site'
import { paths } from '@/app/router/paths'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

/** Slide-down navigation for small screens, animated with Framer Motion. */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const secondaryNav = [
    { label: 'Favorites', to: paths.favorites },
    { label: 'Profile', to: paths.profile },
    { label: 'Settings', to: paths.settings },
  ]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-nav"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="bg-background overflow-hidden border-b md:hidden"
        >
          <Container className="flex flex-col gap-1 py-3">
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === paths.home}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2.5 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="my-2 border-t" />
            {secondaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2.5 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
