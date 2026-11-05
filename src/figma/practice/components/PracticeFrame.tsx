import type { ReactNode } from 'react'
import type { FigmaPracticeAssets } from '../assets.ts'
import { figmaPracticeAssets } from '../assets.ts'
import type { FigmaPracticeTheme } from '../theme.ts'
import { FIGMA_PRACTICE_WIDTH } from '../theme.ts'

interface PracticeFrameProps {
  theme?: FigmaPracticeTheme
  onBack?: () => void
  children: ReactNode
}

function StatusBar({ assets }: { assets: FigmaPracticeAssets }) {
  return (
    <div className="fp-status-bar">
      <p className="fp-status-time">9:41</p>
      <div className="fp-status-icons">
        <img className="fp-icon fp-icon--18" src={assets.iosSignal} alt="" />
        <img className="fp-icon fp-icon--18" src={assets.iosWifi} alt="" />
        <img className="fp-icon fp-battery" src={assets.iosBattery} alt="" />
      </div>
    </div>
  )
}

function NavBar({
  assets,
  onBack,
}: {
  assets: FigmaPracticeAssets
  onBack?: () => void
}) {
  return (
    <header className="fp-nav">
      <button
        type="button"
        className="fp-nav-back"
        aria-label="Wróć"
        onClick={onBack}
      >
        <img className="fp-icon fp-icon--18" src={assets.arrowLeft} alt="" />
      </button>
      <h1 className="fp-nav-title">Ćwiczenia</h1>
      <button type="button" className="fp-nav-menu" aria-label="Menu">
        <img className="fp-icon fp-icon--20" src={assets.moreHorizontal} alt="" />
      </button>
    </header>
  )
}

export function PracticeFrame({
  theme = 'light',
  onBack,
  children,
}: PracticeFrameProps) {
  const assets = figmaPracticeAssets(theme)
  const themeClass = theme === 'dark' ? 'fp--dark' : 'fp--light'

  return (
    <div
      className={`fp ${themeClass}`}
      style={{ width: FIGMA_PRACTICE_WIDTH, maxWidth: '100%' }}
    >
      <div className="fp-frame">
        <StatusBar assets={assets} />
        <NavBar assets={assets} onBack={onBack} />
        <div className="fp-body">{children}</div>
        <div className="fp-home-indicator-row">
          <div className="fp-home-indicator" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
