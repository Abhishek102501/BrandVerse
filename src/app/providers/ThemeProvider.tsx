import { useEffect, type ReactNode } from 'react'
import { useThemeStore, type Theme } from '@/store/theme.store'

const MEDIA = '(prefers-color-scheme: dark)'

function resolveIsDark(theme: Theme): boolean {
  if (theme === 'dark') return true
  if (theme === 'light') return false
  return window.matchMedia(MEDIA).matches
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', resolveIsDark(theme))
}

/** Applies the persisted theme to <html> and follows the OS when set to "system". */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return

    const media = window.matchMedia(MEDIA)
    const onChange = () => applyTheme('system')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme])

  return children
}
