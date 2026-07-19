import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Menu, X, User, LogOut, ChevronDown, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/common/Container'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { MobileNav } from './MobileNav'
import { mainNav } from '@/config/site'
import { paths } from '@/app/router/paths'
import { useFavoritesStore } from '@/store/favorites.store'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const favoritesCount = useFavoritesStore((state) => state.ids.length)
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm supports-backdrop-filter:bg-background/60 transition-all duration-300">
      <Container className="flex h-16 items-center justify-between gap-4">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to={paths.home}
            className="group flex items-center gap-2 transition-transform hover:scale-105"
            aria-label="BrandVerse home"
          >
            <motion.div
              className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg font-display text-lg font-bold"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              B
            </motion.div>
            <span className="font-display text-xl font-bold tracking-tight hidden sm:inline">
              BrandVerse
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <NavLink
                to={item.to}
                end={item.to === paths.home}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        layoutId="navbar-indicator"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-1">

          {/* Favorites button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              asChild
              aria-label="Favorites"
              className="relative group"
            >
              <Link to={paths.favorites}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Heart className="size-5" />
                </motion.div>
                {favoritesCount > 0 && (
                  <motion.span
                    key={favoritesCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-primary text-primary-foreground absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full px-1 text-[10px] font-semibold"
                  >
                    {favoritesCount}
                  </motion.span>
                )}
              </Link>
            </Button>
          </motion.div>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Auth section */}
          {isAuthenticated && user ? (
            // User menu (logged in)
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                <div className="bg-primary text-primary-foreground grid size-7 place-items-center rounded-full text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-25 truncate">{user.name}</span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl border bg-card shadow-lg p-1 z-50"
                  >
                   <Link
  to={paths.profile}
  onClick={() => setUserMenuOpen(false)}
  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
>
  <User className="size-4" />
  Profile
</Link>

{user.role === 'ADMIN' && (
  <Link
    to={paths.admin}
    onClick={() => setUserMenuOpen(false)}
    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
  >
    <Settings className="size-4" />
    Admin Panel
  </Link>
)}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            // Login / Register buttons (logged out)
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to={paths.login}>Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to={paths.register}>Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="size-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="size-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

        </div>
      </Container>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </header>
  )
}