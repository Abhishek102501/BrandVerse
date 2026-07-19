import { motion } from 'framer-motion'
import {Mail, MapPin, Calendar, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { PageHeader } from '@/components/common/PageHeader'
import { PageTransition } from '@/components/common/PageTransition'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useFavoritesStore } from '@/store/favorites.store'
import { useRecentlyViewedStore } from '@/store/recently-viewed.store'
import { paths } from '@/app/router/paths'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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

export function ProfilePage() {
  const favoriteCount = useFavoritesStore((state) => state.ids.length)
  const recentCount = useRecentlyViewedStore((state) => state.viewed.length)

  const user = {
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    location: 'San Francisco, CA',
    joinDate: 'June 2024',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah',
  }

  const stats = [
    { label: 'Favorite brands', value: favoriteCount, icon: '❤️' },
    { label: 'Recently viewed', value: recentCount, icon: '👀' },
    { label: 'Brands compared', value: 12, icon: '⚖️' },
  ]

  return (
    <PageTransition>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Manage your BrandVerse profile and preferences."
      />

      <Container className="pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto space-y-8"
        >
          {/* Profile card */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:justify-between sm:items-start">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="size-24 rounded-full bg-muted"
                      loading="lazy"
                    />
                    <div className="text-center sm:text-left">
                      <h2 className="font-display text-2xl font-bold">{user.name}</h2>
                      <div className="space-y-1 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <Mail className="size-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <MapPin className="size-4" />
                          {user.location}
                        </div>
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <Calendar className="size-4" />
                          Joined {user.joinDate}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button asChild className="w-full sm:w-auto">
                    <Link to={paths.settings}>
                      <Settings className="size-4" /> Settings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants}>
            <h3 className="font-display font-semibold mb-4">Your activity</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-muted-foreground text-sm mt-2">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-display font-semibold mb-4">Quick links</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Your favorites', href: paths.favorites, icon: '❤️' },
                { label: 'Compare brands', href: paths.compare, icon: '⚖️' },
                { label: 'All brands', href: paths.brands, icon: '🎯' },
                { label: 'Settings', href: paths.settings, icon: '⚙️' },
                { label: 'Categories', href: paths.categories, icon: '📁' },
                { label: 'Home', href: paths.home, icon: '🏠' },
              ].map((link) => (
                <Button key={link.href} variant="outline" asChild className="justify-start h-auto p-3">
                  <Link to={link.href} className="flex items-center gap-2 text-sm">
                    <span>{link.icon}</span>
                    <span className="hidden sm:inline">{link.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Account section */}
          <motion.div variants={itemVariants}>
            <h3 className="font-display font-semibold mb-4">Account</h3>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="font-medium text-sm">Email notifications</p>
                    <p className="text-muted-foreground text-xs">Receive brand updates and recommendations</p>
                  </div>
                  <input type="checkbox" defaultChecked className="size-5" aria-label="Email notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Marketing emails</p>
                    <p className="text-muted-foreground text-xs">Special offers and new features</p>
                  </div>
                  <input type="checkbox" className="size-5" aria-label="Marketing emails" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </PageTransition>
  )
}
