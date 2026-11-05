import type { ReactNode } from 'react'
import type { AppTheme } from './app-theme.ts'
import './figma-desktop.css'
import './figma-theme-global.css'

interface FigmaAppShellProps {
  theme: AppTheme
  children: ReactNode
}

export function FigmaAppShell({ theme, children }: FigmaAppShellProps) {
  return (
    <div className="figma-app-shell" data-theme={theme}>
      {children}
    </div>
  )
}
