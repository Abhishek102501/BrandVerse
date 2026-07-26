import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Moon, Lock, Trash2, Eye, EyeOff, Check, X, Shield } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { PageHeader } from '@/components/common/PageHeader'
import { PageTransition } from '@/components/common/PageTransition'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useThemeStore } from '@/store/theme.store'
import { useAuthStore } from '@/store/auth.store'
import { useSearchHistoryStore } from '@/store/search-history.store'
import { useFavoritesStore } from '@/store/favorites.store'
import { useRecentlyViewedStore } from '@/store/recently-viewed.store'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/router/paths'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

type Theme = 'light' | 'dark' | 'system'

// Toast notification
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-medium',
        type === 'success' ? 'bg-emerald-500' : 'bg-destructive'
      )}
    >
      {type === 'success' ? <Check className="size-4" /> : <X className="size-4" />}
      {message}
    </motion.div>
  )
}

export function SettingsPage() {
  const currentTheme = useThemeStore((s) => s.theme)
  const setTheme     = useThemeStore((s) => s.setTheme)
  const { user, logout } = useAuthStore()
  const clearSearch  = useSearchHistoryStore((s) => s.clear)
  const clearFavs    = useFavoritesStore((s) => s.clear)
  const clearViewed  = useRecentlyViewedStore((s) => s.clear)
  const navigate     = useNavigate()

  const [theme, setLocalTheme] = useState<Theme>(currentTheme)
  const [notifications, setNotifications] = useState({
    email:     true,
    marketing: false,
    weekly:    true,
  })

  // Password change
  const [showPwdForm,  setShowPwdForm]  = useState(false)
  const [pwdForm,      setPwdForm]      = useState({ current: '', next: '', confirm: '' })
  const [showPwd,      setShowPwd]      = useState(false)
  const [pwdError,     setPwdError]     = useState('')

  // 2FA
  const [show2FA,      setShow2FA]      = useState(false)
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)

  // Delete confirm
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput,       setDeleteInput]       = useState('')

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleThemeChange = (t: Theme) => {
    setLocalTheme(t)
    setTheme(t)
    showToast(`Theme changed to ${t}`)
  }

  const handleChangePassword = () => {
    setPwdError('')
    if (!pwdForm.current) { setPwdError('Enter your current password'); return }
    if (pwdForm.next.length < 6) { setPwdError('New password must be at least 6 characters'); return }
    if (pwdForm.next !== pwdForm.confirm) { setPwdError('Passwords do not match'); return }

    // Update password in localStorage
    const users = JSON.parse(localStorage.getItem('brandverse-users') || '[]')
    const idx   = users.findIndex((u: any) => u.email === user?.email)
    if (idx === -1) { setPwdError('User not found'); return }
    if (users[idx].password !== pwdForm.current) { setPwdError('Current password is incorrect'); return }

    users[idx].password = pwdForm.next
    localStorage.setItem('brandverse-users', JSON.stringify(users))

    setPwdForm({ current: '', next: '', confirm: '' })
    setShowPwdForm(false)
    showToast('Password updated successfully!')
  }

  const handleClearSearch = () => {
    clearSearch()
    showToast('Search history cleared!')
  }

  const handleDeleteAll = () => {
    if (deleteInput !== 'DELETE') {
      showToast('Type DELETE to confirm', 'error')
      return
    }
    clearSearch()
    clearFavs()
    clearViewed()
    localStorage.removeItem('brandverse-auth')
    logout()
    navigate(paths.login)
    showToast('All data deleted')
  }

  const handleSaveNotifications = () => {
    localStorage.setItem('brandverse-notifications', JSON.stringify(notifications))
    showToast('Notification preferences saved!')
  }

  return (
    <PageTransition>
      <PageHeader eyebrow="Account" title="Settings" description="Manage your preferences and account settings." />

      <Container className="pb-20">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-3xl mx-auto space-y-8">

          {/* ── Appearance ─────────────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <Moon className="size-5 text-primary" />
              <h2 className="font-display font-semibold text-lg">Appearance</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-muted-foreground text-sm">Choose your preferred appearance</p>
                  </div>
                  <div className="flex gap-2">
                    {(['light', 'dark', 'system'] as const).map((t) => (
                      <motion.button
                        key={t}
                        onClick={() => handleThemeChange(t)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                          theme === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {t}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Notifications ──────────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <Bell className="size-5 text-primary" />
              <h2 className="font-display font-semibold text-lg">Notifications</h2>
            </div>
            <Card>
              <CardContent className="p-0 divide-y">
                {[
                  { key: 'email',     label: 'Email notifications', desc: 'Receive brand updates and recommendations' },
                  { key: 'marketing', label: 'Marketing emails',    desc: 'Special offers and new features'           },
                  { key: 'weekly',    label: 'Weekly digest',       desc: 'Summary of new brands and trends'          },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-muted-foreground text-xs">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                      className="size-5 accent-primary cursor-pointer"
                    />
                  </div>
                ))}
                <div className="px-6 py-4">
                  <Button size="sm" onClick={handleSaveNotifications}>Save preferences</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Privacy & Security ─────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="size-5 text-primary" />
              <h2 className="font-display font-semibold text-lg">Privacy & Security</h2>
            </div>
            <Card>
              <CardContent className="p-0 divide-y">

                {/* Change password */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Change password</p>
                      <p className="text-muted-foreground text-xs">Update your account password</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setShowPwdForm(!showPwdForm)}>
                      {showPwdForm ? 'Cancel' : 'Update'}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showPwdForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-3 overflow-hidden"
                      >
                        {pwdError && (
                          <p className="text-destructive text-sm bg-destructive/10 rounded-lg px-3 py-2">{pwdError}</p>
                        )}
                        {[
                          { key: 'current', label: 'Current password',  placeholder: 'Enter current password' },
                          { key: 'next',    label: 'New password',       placeholder: 'Min. 6 characters'      },
                          { key: 'confirm', label: 'Confirm new password', placeholder: 'Repeat new password'  },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">{f.label}</label>
                            <div className="relative">
                              <input
                                type={showPwd ? 'text' : 'password'}
                                value={pwdForm[f.key as keyof typeof pwdForm]}
                                onChange={(e) => setPwdForm({ ...pwdForm, [f.key]: e.target.value })}
                                placeholder={f.placeholder}
                                className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 pr-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPwd(!showPwd)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                              >
                                {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                              </button>
                            </div>
                          </div>
                        ))}
                        <Button size="sm" onClick={handleChangePassword} className="w-full">
                          Update password
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2FA */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Two-factor authentication</p>
                      <p className="text-muted-foreground text-xs">Add extra security to your account</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setShow2FA(!show2FA)}>
                      {show2FA ? 'Cancel' : twoFAEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {show2FA && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="bg-muted/50 rounded-xl p-4 flex items-start gap-3">
                          <Shield className="size-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">2FA via Email</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              When enabled, a verification code will be sent to <strong>{user?.email}</strong> each time you log in.
                            </p>
                            <Button
                              size="sm"
                              className="mt-3"
                              onClick={() => {
                                setTwoFAEnabled(!twoFAEnabled)
                                setShow2FA(false)
                                showToast(twoFAEnabled ? '2FA disabled' : '2FA enabled successfully!')
                              }}
                            >
                              {twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {twoFAEnabled && (
                    <div className="mt-2 flex items-center gap-1.5 text-emerald-600 text-xs">
                      <Check className="size-3.5" /> 2FA is active
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Data ───────────────────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="size-5 text-primary" />
              <h2 className="font-display font-semibold text-lg">Data</h2>
            </div>
            <Card>
              <CardContent className="p-0 divide-y">

                {/* Clear search history */}
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-medium text-sm">Clear search history</p>
                    <p className="text-muted-foreground text-xs">Remove all saved searches</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleClearSearch}>Clear</Button>
                </div>

                {/* Delete all data */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Delete all data</p>
                      <p className="text-muted-foreground text-xs">Permanently remove your account and data</p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                    >
                      {showDeleteConfirm ? 'Cancel' : 'Delete'}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showDeleteConfirm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                          <p className="text-sm font-medium text-destructive mb-2">⚠️ This cannot be undone</p>
                          <p className="text-xs text-muted-foreground mb-3">
                            This will delete your account, favorites, search history and all saved data. Type <strong>DELETE</strong> to confirm.
                          </p>
                          <input
                            value={deleteInput}
                            onChange={(e) => setDeleteInput(e.target.value)}
                            placeholder="Type DELETE to confirm"
                            className="w-full rounded-xl border border-destructive/30 bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-destructive/30 mb-3"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="w-full"
                            onClick={handleDeleteAll}
                            disabled={deleteInput !== 'DELETE'}
                          >
                            Permanently delete everything
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </motion.div>
      </Container>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </PageTransition>
  )
}