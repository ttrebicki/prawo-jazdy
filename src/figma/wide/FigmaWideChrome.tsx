import type { ReactNode } from 'react'
import { getStartThemeAssets } from '../start/themeAssets.ts'
import { useFigmaLayout } from '../layout/FigmaLayoutContext.tsx'
import {
  WIDE_NAV_ITEMS,
  wideNavActiveKey,
  type WideNavKey,
} from './wide-nav.ts'
import './wide-chrome.css'

function StartIcon({
  src,
  className,
}: {
  src: string
  className: string
}) {
  return (
    <span className={className}>
      <img src={src} alt="" width={20} height={20} />
    </span>
  )
}

export function FigmaWideChrome({ children }: { children: ReactNode }) {
  const {
    theme,
    view,
    mistakeCount,
    onNavigate,
    onThemeChange,
    onPractice,
    onMockExam,
    isDesktop,
  } = useFigmaLayout()

  const assets = getStartThemeAssets(theme)
  const activeKey = wideNavActiveKey(view)

  const onNavClick = (key: WideNavKey, targetView: (typeof WIDE_NAV_ITEMS)[number]['view']) => {
    if (key === 'practice') {
      onPractice()
      return
    }
    if (key === 'mock') {
      onMockExam()
      return
    }
    onNavigate(targetView)
  }

  return (
    <div
      className="figma-wide"
      data-theme={theme}
      data-layout={isDesktop ? 'desktop' : 'tablet'}
    >
      <header className="figma-wide__header" data-node-id="15:12181">
        <div className="figma-wide__brand">
          <div className="figma-wide__logo" aria-hidden="true">
            <img src={assets.route} alt="" width={18} height={18} />
          </div>
          <p className="figma-wide__brand-name">dobry kierunek</p>
        </div>

        {isDesktop ? (
          <nav className="figma-wide__nav figma-wide__nav--header" aria-label="Główna nawigacja">
            {WIDE_NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`figma-wide__nav-item${activeKey === item.key ? ' figma-wide__nav-item--active' : ''}`}
                onClick={() => onNavClick(item.key, item.view)}
              >
                {item.locked ? (
                  <StartIcon
                    src={assets.lockKeyholeSm}
                    className="figma-wide__nav-lock"
                  />
                ) : null}
                <span>{item.label}</span>
                {item.key === 'mistakes' && mistakeCount > 0 ? (
                  <span className="figma-wide__nav-count">{mistakeCount}</span>
                ) : null}
              </button>
            ))}
          </nav>
        ) : null}

        <div className="figma-wide__header-meta">
          <p className="figma-wide__category-label">Kategoria B</p>
          <button
            type="button"
            className="figma-wide__theme-toggle"
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
            aria-label={
              theme === 'light' ? 'Włącz motyw ciemny' : 'Włącz motyw jasny'
            }
          >
            <StartIcon src={assets.themeToggle} className="figma-wide__theme-icon" />
          </button>
        </div>
      </header>

      {!isDesktop ? (
        <nav
          className="figma-wide__nav figma-wide__nav--tablet"
          aria-label="Główna nawigacja"
        >
          {WIDE_NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`figma-wide__nav-item${activeKey === item.key ? ' figma-wide__nav-item--active' : ''}`}
              onClick={() => onNavClick(item.key, item.view)}
            >
              {item.locked ? (
                <StartIcon
                  src={assets.lockKeyholeSm}
                  className="figma-wide__nav-lock"
                />
              ) : null}
              <span>{item.label}</span>
              {item.key === 'mistakes' && mistakeCount > 0 ? (
                <span className="figma-wide__nav-count">{mistakeCount}</span>
              ) : null}
            </button>
          ))}
        </nav>
      ) : null}

      <main className="figma-wide__workspace">{children}</main>

      <footer className="figma-wide__privacy">
        <p>Bez konta. Postępy tylko na tym urządzeniu.</p>
        <p>Makieta · dane pokazowe</p>
      </footer>
    </div>
  )
}
