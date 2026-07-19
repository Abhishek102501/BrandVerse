import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Moon, Lock, Trash2 } from 'lucide-react'
import { Container } from '@/components/common/Container'
import { PageHeader } from '@/components/common/PageHeader'
import { PageTransition } from '@/components/common/PageTransition'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useThemeStore } from '@/store/theme.store'

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

type Theme = 'light' | 'dark' | 'system'

export function SettingsPage() {
  const currentTheme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  const [theme, setLocalTheme] = useState<Theme>(currentTheme)
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    weekly: true,
  })

  const handleThemeChange = (newTheme: Theme) => {
    setLocalTheme(newTheme)
    setTheme(newTheme)
  }

  const settings = [
    {
      section: 'Appearance',
      icon: Moon,
      items: [
        {
          label: 'Theme',
          description: 'Choose your preferred appearance',
          type: 'theme' as const,
        },
      ],
    },
    {
      section: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Email notifications',
          description: 'Receive brand updates and recommendations',
          type: 'toggle' as const,
          key: 'email',
        },
        {
          label: 'Marketing emails',
          description: 'Special offers and new features',
          type: 'toggle' as const,
          key: 'marketing',
        },
        {
          label: 'Weekly digest',
          description: 'Summary of new brands and trends',
          type: 'toggle' as const,
          key: 'weekly',
        },
      ],
    },
    {
      section: 'Privacy & Security',
      icon: Lock,
      items: [
        { label: 'Change password', description: 'Update your password', type: 'button' as const },
        {
          label: 'Two-factor authentication',
          description: 'Add extra security to your account',
          type: 'button' as const,
        },
      ],
    },
    {
      section: 'Data',
      icon: Trash2,
      items: [
        {
          label: 'Clear search history',
          description: 'Remove all saved searches',
          type: 'button' as const,
          variant: 'outline' as const,
        },
        {
          label: 'Delete all data',
          description: 'Permanently remove your data',
          type: 'button' as const,
          variant: 'destructive' as const,
        },
      ],
    },
  ]

  return (
    <PageTransition>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your preferences and account settings."
      />

      <Container className="pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto space-y-8"
        >
          {settings.map((section) => {
            const Icon = section.icon
            return (
              <motion.div key={section.section} variants={itemVariants}>
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="size-5 text-primary flex-shrink-0" />
                  <h2 className="font-display font-semibold text-lg">{section.section}</h2>
                </div>

                <Card>
                  <CardContent className="divide-y p-0">
                    {section.items.map((item, index) => (
                      <div
                        key={index}
                        className="py-4 px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-6 last:pb-6"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">{item.label}</p>
                          <p className="text-muted-foreground text-xs sm:text-sm">{item.description}</p>
                        </div>

                        {item.type === 'toggle' && (
                          <input
                            type="checkbox"
                            checked={
                              notifications[item.key as keyof typeof notifications]
                            }
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                [item.key]: e.target.checked,
                              })
                            }
                            className="size-5 flex-shrink-0"
                            aria-label={item.label}
                          />
                        )}

                        {item.type === 'button' && (
                          <Button
  variant={"variant" in item ? item.variant : "outline"}
  size="sm"
  className="shrink-0 w-full sm:w-auto"
>
  Update
</Button>
                        )}

                        {item.type === 'theme' && (
                          <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                            {(['light', 'dark', 'system'] as const).map((t) => (
                              <motion.button
                                key={t}
                                onClick={() => handleThemeChange(t)}
                                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all capitalize ${
                                  theme === t
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-accent'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-pressed={theme === t}
                              >
                                {t}
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}

          {/* Save button */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="flex-1 sm:flex-none">
              Save changes
            </Button>
            <Button size="lg" variant="outline" className="flex-1 sm:flex-none">
              Cancel
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </PageTransition>
  )
}
