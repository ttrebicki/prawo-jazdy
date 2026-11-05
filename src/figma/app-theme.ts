export type AppTheme = 'light' | 'dark'

export const APP_THEME_STORAGE_KEY = 'prawo-jazdy-theme'
const LEGACY_START_THEME_KEY = 'figma-start-theme'

export function readStoredAppTheme(fallback: AppTheme = 'light'): AppTheme {
  if (typeof window === 'undefined') {
    return fallback
  }
  const stored =
    window.localStorage.getItem(APP_THEME_STORAGE_KEY) ??
    window.localStorage.getItem(LEGACY_START_THEME_KEY)
  return stored === 'dark' || stored === 'light' ? stored : fallback
}

export function writeStoredAppTheme(theme: AppTheme): void {
  window.localStorage.setItem(APP_THEME_STORAGE_KEY, theme)
  window.localStorage.setItem(LEGACY_START_THEME_KEY, theme)
}

export function toggleAppTheme(current: AppTheme): AppTheme {
  return current === 'light' ? 'dark' : 'light'
}
