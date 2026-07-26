import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, User, Settings, UserPlus, LogIn } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { mainNav } from '@/config/site'
import { paths } from '@/app/router/paths'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  const secondaryNav = [
    { label: 'Favorites', to: paths.favorites },
    { label: 'Compare',   to: paths.compare   },
    { label: 'Settings',  to: paths.settings  },
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

            {/* User info if logged in */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 px-3 py-3 mb-1 bg-accent/50 rounded-xl">
                <div className="bg-primary text-primary-foreground size-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-muted-foreground text-xs truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Main nav */}
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === paths.home}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-2.5 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="my-1 border-t" />

            {/* Secondary nav */}
            {secondaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-2.5 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="my-1 border-t" />

            {/* Auth section */}
            {isAuthenticated && user ? (
              <>
                <Link
                  to={paths.profile}
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <User className="size-4" /> Profile
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to={paths.admin}
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-accent transition-colors"
                  >
                    <Settings className="size-4" /> Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-base font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                >
                  <LogOut className="size-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to={paths.login}
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <LogIn className="size-4" /> Sign in
                </Link>
                <Link
                  to={paths.register}
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <UserPlus className="size-4" /> Create account
                </Link>
              </>
            )}
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  )
}