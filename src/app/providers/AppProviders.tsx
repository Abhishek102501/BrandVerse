import type { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { QueryProvider } from './QueryProvider'
import { ToastContainer } from '@/components/common/Toast'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <ToastContainer />
      </ThemeProvider>
    </QueryProvider>
  )
}