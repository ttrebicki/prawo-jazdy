import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppTheme } from '../app-theme.ts'
import type { AppView } from '../../ui/navigation.ts'

export const FIGMA_TABLET_MIN_PX = 768
export const FIGMA_DESKTOP_MIN_PX = 1024

export interface FigmaLayoutContextValue {
  isWide: boolean
  isDesktop: boolean
  view: AppView
  theme: AppTheme
  mistakeCount: number
  onNavigate: (view: AppView) => void
  onThemeChange: (theme: AppTheme) => void
  onPractice: () => void
  onMockExam: () => void
}

const FigmaLayoutContext = createContext<FigmaLayoutContextValue | null>(null)

function useMatchMinWidth(minPx: number): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return window.matchMedia(`(min-width: ${minPx}px)`).matches
  })

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${minPx}px)`)
    const onChange = () => setMatches(query.matches)
    onChange()
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [minPx])

  return matches
}

export function FigmaLayoutProvider({
  value,
  children,
}: {
  value: Omit<FigmaLayoutContextValue, 'isWide' | 'isDesktop'>
  children: ReactNode
}) {
  const isWide = useMatchMinWidth(FIGMA_TABLET_MIN_PX)
  const isDesktop = useMatchMinWidth(FIGMA_DESKTOP_MIN_PX)

  const contextValue = useMemo(
    () => ({
      ...value,
      isWide,
      isDesktop,
    }),
    [value, isWide, isDesktop],
  )

  return (
    <FigmaLayoutContext.Provider value={contextValue}>
      {children}
    </FigmaLayoutContext.Provider>
  )
}

export function useFigmaLayout(): FigmaLayoutContextValue {
  const ctx = useContext(FigmaLayoutContext)
  if (!ctx) {
    throw new Error('useFigmaLayout must be used within FigmaLayoutProvider')
  }
  return ctx
}

export function useFigmaLayoutOptional(): FigmaLayoutContextValue | null {
  return useContext(FigmaLayoutContext)
}
