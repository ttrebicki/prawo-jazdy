import type { ReactNode } from 'react'
import type { AppTheme } from './app-theme.ts'
import { FigmaLayoutProvider } from './layout/FigmaLayoutContext.tsx'
import { FigmaWideChrome } from './wide/FigmaWideChrome.tsx'
import type { AppView } from '../ui/navigation.ts'
import './figma-shell.css'
import './figma-theme-global.css'

interface FigmaAppShellProps {
  theme: AppTheme
  view: AppView
  mistakeCount: number
  onNavigate: (view: AppView) => void
  onThemeChange: (theme: AppTheme) => void
  onPractice: () => void
  onMockExam: () => void
  children: ReactNode
}

export function FigmaAppShell({
  theme,
  view,
  mistakeCount,
  onNavigate,
  onThemeChange,
  onPractice,
  onMockExam,
  children,
}: FigmaAppShellProps) {
  return (
    <FigmaLayoutProvider
      value={{
        theme,
        view,
        mistakeCount,
        onNavigate,
        onThemeChange,
        onPractice,
        onMockExam,
      }}
    >
      <div className="figma-app-shell" data-theme={theme}>
        <div className="figma-shell-mobile">{children}</div>
        <div className="figma-shell-wide">
          <FigmaWideChrome>{children}</FigmaWideChrome>
        </div>
      </div>
    </FigmaLayoutProvider>
  )
}
