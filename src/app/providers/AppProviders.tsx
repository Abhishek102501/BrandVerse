import type { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { QueryProvider } from './QueryProvider'
import { ToastContainer } from '@/components/common/Toast'
import { AiAssistant } from '@/components/ai/AiAssistant'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <ToastContainer />
        <AiAssistant />
      </ThemeProvider>
    </QueryProvider>
  )
}