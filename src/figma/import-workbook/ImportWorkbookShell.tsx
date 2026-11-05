import type { ReactNode } from 'react'
import { IconArrowLeft, IconMoreHorizontal } from './icons.tsx'

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
