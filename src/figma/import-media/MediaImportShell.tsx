import type { ReactNode } from 'react'
import {
  IconArrowLeft,
  IconMoreHorizontal,
} from './icons.tsx'

interface MediaImportShellProps {
  onBack: () => void
  children: ReactNode
}

export function MediaImportShell({ onBack, children }: MediaImportShellProps) {
  return (
    <div className="figma-import-media" data-name="Multimedia">
      <header className="figma-import-media__header">
        <button
          type="button"
          className="figma-import-media__back"
          aria-label="Wróć"
          onClick={onBack}
        >
          <IconArrowLeft />
        </button>
        <h1 className="figma-import-media__title">Multimedia</h1>
        <button
          type="button"
          className="figma-import-media__more"
          aria-label="Więcej opcji"
        >
          <IconMoreHorizontal />
        </button>
      </header>
      <div className="figma-import-media__content">{children}</div>
      <footer className="figma-import-media__home-bar" aria-hidden>
        <span />
      </footer>
    </div>
  )
}
