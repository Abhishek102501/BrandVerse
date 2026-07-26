
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Settings, LogOut, Edit2, Check, X, Phone, Globe, FileText, Camera } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '@/components/common/Container'
import { PageHeader } from '@/components/common/PageHeader'
import { PageTransition } from '@/components/common/PageTransition'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useFavoritesStore } from '@/store/favorites.store'
import { useRecentlyViewedStore } from '@/store/recently-viewed.store'
import { useAuthStore } from '@/store/auth.store'
import { paths } from '@/app/router/paths'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function EditableField({
  label, value, icon: Icon, onSave, placeholder, multiline = false,
}: {
  label: string
  value: string
  icon: React.ElementType
  onSave: (v: string) => void
  placeholder?: string
  multiline?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [input,   setInput]   = useState(value)

  useEffect(() => {
    if (!editing) setInput(value)
  }, [value, editing])

  const save = () => {
    onSave(input.trim())
    setEditing(false)
  }
  const cancel = () => {
    setInput(value)
    setEditing(false)
  }

  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <Icon className="size-4 text-muted-foreground shrink-0 mt-1" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {editing ? (
          <div className="flex items-start gap-2">
            {multiline ? (
              <textarea
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
                className="flex-1 bg-background border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                placeholder={placeholder}
              />
            ) : (
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel() }}
                className="flex-1 bg-background border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder={placeholder}
              />
            )}
            <button onClick={save}   className="text-primary hover:text-primary/80 mt-1"><Check className="size-4" /></button>
            <button onClick={cancel} className="text-muted-foreground hover:text-foreground mt-1"><X className="size-4" /></button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className={cn('text-sm', !value && 'text-muted-foreground italic')}>
              {value || placeholder || 'Not set'}
            </span>
            <button onClick={() => { setInput(value); setEditing(true) }} className="text-muted-foreground hover:text-primary transition-colors">
              <Edit2 className="size-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const AVATAR_STYLES = [
  { label: '😊 Cartoon',  seed: (name: string) => `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}` },
  { label: '🎨 Abstract', seed: (name: string) => `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(name)}` },
  { label: '🖼️ Pixel',   seed: (name: string) => `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(name)}` },
  { label: '🌸 Notion',   seed: (name: string) => `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(name)}` },
  { label: '🦸 Hero',     seed: (name: string) => `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(name)}` },
  { label: '🤖 Robot',    seed: (name: string) => `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(name)}` },
]

export function ProfilePage() {
  const favoriteCount              = useFavoritesStore((s) => s.ids.length)
  const recentCount                = useRecentlyViewedStore((s) => s.viewed.length)
  const { user, logout, updateUser } = useAuthStore()
  const navigate                   = useNavigate()

  const [avatarStyle,       setAvatarStyle]       = useState(0)
  const [showAvatarPicker,  setShowAvatarPicker]  = useState(false)

  const handleLogout = () => { logout(); navigate(paths.login) }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">You are not logged in.</p>
          <Button asChild><Link to={paths.login}>Sign in</Link></Button>
        </div>
      </div>
    )
  }

  const avatarUrl = AVATAR_STYLES[avatarStyle].seed(user.name)

  const stats = [
    { label: 'Favorite brands', value: favoriteCount, icon: '❤️', color: 'text-rose-500'  },
    { label: 'Recently viewed', value: recentCount,   icon: '👀', color: 'text-blue-500'  },
    { label: 'Brands compared', value: 12,            icon: '⚖️', color: 'text-amber-500' },
  ]

  return (
    <PageTransition>
      <PageHeader eyebrow="Account" title="My Profile" description="Your personal BrandVerse profile." />

      <Container className="pb-20">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-3xl mx-auto space-y-8">

          {/* Profile card */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">

                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="relative">
                      <img
                        src={avatarUrl}
                        alt={user.name}
                        className="size-28 rounded-2xl bg-muted border-2 border-primary/20 object-cover"
                      />
                      <button
                        onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                        className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md hover:bg-primary/90 transition-colors"
                      >
                        <Camera className="size-3.5" />
                      </button>
                    </div>

                    {showAvatarPicker && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border rounded-2xl p-3 shadow-xl z-20 w-48"
                      >
                        <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">Choose avatar style</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {AVATAR_STYLES.map((style, i) => (
                            <button
                              key={i}
                              onClick={() => { setAvatarStyle(i); setShowAvatarPicker(false) }}
                              className={cn(
                                'flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-all',
                                avatarStyle === i ? 'bg-primary/15 text-primary' : 'hover:bg-muted',
                              )}
                            >
                              <img src={style.seed(user.name)} alt={style.label} className="size-8 rounded-lg" />
                              <span>{style.label.split(' ')[1]}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <span className={cn(
                      'text-xs font-semibold px-3 py-1 rounded-full',
                      user.role === 'admin' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                    )}>
                      {user.role === 'admin' ? '⭐ Admin' : '👤 Member'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h2 className="font-display text-2xl font-bold">{user.name}</h2>
                        <p className="text-muted-foreground text-sm">{user.email}</p>
                        {user.location && (
                          <p className="text-muted-foreground text-sm flex items-center gap-1 mt-0.5">
                            <MapPin className="size-3" /> {user.location}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button asChild size="sm" variant="outline">
                          <Link to={paths.settings}><Settings className="size-4" /> Settings</Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive hover:border-destructive"
                          onClick={handleLogout}
                        >
                          <LogOut className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" /> Joined {user.joinDate}
                      </span>
                    </div>

                    {user.bio && (
                      <p className="text-sm text-muted-foreground bg-muted/50 rounded-xl px-4 py-3 italic">
                        "{user.bio}"
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Edit Profile */}
          <motion.div variants={itemVariants}>
            <h3 className="font-display font-semibold mb-4">Edit profile</h3>
            <Card>
              <CardContent className="p-6">
                <EditableField
                  label="Display Name"
                  value={user.name}
                  icon={Edit2}
                  placeholder="Your name"
                  onSave={(v) => updateUser({ name: v })}
                />
                <EditableField
                  label="Location"
                  value={user.location ?? ''}
                  icon={MapPin}
                  placeholder="e.g. Mumbai, India"
                  onSave={(v) => updateUser({ location: v })}
                />
                <EditableField
                  label="Phone"
                  value={user.phone ?? ''}
                  icon={Phone}
                  placeholder="e.g. +91 9876543210"
                  onSave={(v) => updateUser({ phone: v })}
                />
                <EditableField
                  label="Website / Portfolio"
                  value={user.website ?? ''}
                  icon={Globe}
                  placeholder="e.g. https://yoursite.com"
                  onSave={(v) => updateUser({ website: v })}
                />
                <EditableField
                  label="Bio"
                  value={user.bio ?? ''}
                  icon={FileText}
                  placeholder="Tell us about your fashion style..."
                  multiline
                  onSave={(v) => updateUser({ bio: v })}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants}>
            <h3 className="font-display font-semibold mb-4">Your activity</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <Card key={stat.label} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <p className={cn('text-3xl font-bold', stat.color)}>{stat.value}</p>
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
                { label: 'Your favorites', href: paths.favorites,  icon: '❤️' },
                { label: 'Compare brands', href: paths.compare,    icon: '⚖️' },
                { label: 'All brands',     href: paths.brands,     icon: '🎯' },
                { label: 'Settings',       href: paths.settings,   icon: '⚙️' },
                { label: 'Categories',     href: paths.categories, icon: '📁' },
                { label: 'Home',           href: paths.home,       icon: '🏠' },
              ].map((link) => (
                <Button key={link.href} variant="outline" asChild className="justify-start h-auto p-3">
                  <Link to={link.href} className="flex items-center gap-2 text-sm">
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Danger zone */}
          <motion.div variants={itemVariants}>
            <h3 className="font-display font-semibold mb-4 text-destructive">Danger zone</h3>
            <Card className="border-destructive/30">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Sign out</p>
                  <p className="text-muted-foreground text-xs">You'll need to log in again to access your profile</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  <LogOut className="size-4" /> Sign out
                </Button>
              </CardContent>
            </Card>
          </motion.div>

        </motion.div>
      </Container>
    </PageTransition>
  )
}