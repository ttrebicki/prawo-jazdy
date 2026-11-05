import type { ReactNode } from 'react'
import {
  IconArrowLeft,
  IconBattery,
  IconMoreHorizontal,
  IconSignal,
  IconWifi,
} from './icons.tsx'

interface ImportWorkbookShellProps {
  title: string
  onBack: () => void
  children: ReactNode
}

export function ImportWorkbookShell({
  title,
  onBack,
  children,
}: ImportWorkbookShellProps) {
  return (
    <div className="import-wb" data-name="import-workbook-shell">
      <div className="import-wb__status" data-name="Pasek stanu">
        <p className="import-wb__status-time">9:41</p>
        <div className="import-wb__status-icons">
          <IconSignal />
          <IconWifi />
          <IconBattery />
        </div>
      </div>
      <header className="import-wb__header" data-name="Nagłówek">
        <button
          type="button"
          className="import-wb__back"
          aria-label="Wróć"
          onClick={onBack}
        >
          <IconArrowLeft />
        </button>
        <p className="import-wb__header-title">{title}</p>
        <button type="button" className="import-wb__menu" aria-label="Więcej opcji">
          <IconMoreHorizontal />
        </button>
      </header>
      <div className="import-wb__content">{children}</div>
      <div className="import-wb__home-bar" aria-hidden>
        <div className="import-wb__home-bar-pill" />
      </div>
    </div>
  )
}
