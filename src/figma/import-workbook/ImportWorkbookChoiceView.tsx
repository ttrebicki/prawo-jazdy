import { useId } from 'react'
import { useFigmaLayoutOptional } from '../layout/FigmaLayoutContext.tsx'
import {
  IconArrowRight,
  IconDownload,
  IconFolderOpen,
  IconInfo,
} from './icons.tsx'
import { ImportWorkbookPrivacyFooter } from './ImportWorkbookPrivacyFooter.tsx'
import { ImportWorkbookShell } from './ImportWorkbookShell.tsx'
import {
  FIGMA_IMPORT_WORKBOOK_PREVIEW_CALLOUT_BODY,
  FIGMA_IMPORT_WORKBOOK_PREVIEW_CALLOUT_TITLE,
} from './figmaCopy.ts'
import { ImportWorkbookWideChoiceView } from './ImportWorkbookWideChoiceView.tsx'

export interface ImportWorkbookChoiceViewProps {
  online: boolean
  busy: boolean
  error: string | null
  status: string | null
  onBack: () => void
  onDownloadOfficial: () => void
  onPickFile: (file: File) => void
}

export function ImportWorkbookChoiceView({
  online,
  busy,
  error,
  status,
  onBack,
  onDownloadOfficial,
  onPickFile,
}: ImportWorkbookChoiceViewProps) {
  const fileInputId = useId()
  const layout = useFigmaLayoutOptional()

  if (layout?.isWide) {
    return (
      <ImportWorkbookWideChoiceView
        online={online}
        busy={busy}
        error={error}
        status={status}
        onBack={onBack}
        onDownloadOfficial={onDownloadOfficial}
        onPickFile={onPickFile}
      />
    )
  }

  return (
    <ImportWorkbookShell title="Import katalogu" onBack={onBack}>
      <div className="import-wb__intro" data-node-id="5:3493">
        <p className="import-wb__eyebrow">KROK 1 Z 2 · PYTANIA</p>
        <h1 className="import-wb__title">Zacznij od katalogu</h1>
        <p className="import-wb__lead">
          Wybierz źródło skoroszytu. Media dodasz osobno, w kolejnym kroku.
        </p>
      </div>

      <button
        type="button"
        className="import-wb__source-card import-wb__source-card--recommended"
        disabled={busy || !online}
        data-node-id="5:3497"
        onClick={onDownloadOfficial}
      >
        <div className="import-wb__source-top">
          <div className="import-wb__source-icon">
            <IconDownload />
          </div>
          <p className="import-wb__badge">ZALECANE</p>
        </div>
        <div className="import-wb__source-copy">
          <p className="import-wb__source-title">Katalog ministerstwa</p>
          <p className="import-wb__source-desc">
            Pobierz oficjalny skoroszyt pytań ze strony Ministerstwa Infrastruktury.
          </p>
        </div>
        <div className="import-wb__source-action">
          <p className="import-wb__source-action-label">Pobierz katalog</p>
          <IconArrowRight />
        </div>
      </button>

      <label
        htmlFor={fileInputId}
        className="import-wb__source-card"
        data-node-id="5:3508"
        aria-disabled={busy}
      >
        <div className="import-wb__source-top">
          <div className="import-wb__source-icon">
            <IconFolderOpen />
          </div>
        </div>
        <div className="import-wb__source-copy">
          <p className="import-wb__source-title">Plik z telefonu</p>
          <p className="import-wb__source-desc">
            Masz zapisany skoroszyt? Wybierz plik XLSX z pamięci urządzenia.
          </p>
        </div>
        <div className="import-wb__source-action">
          <p className="import-wb__source-action-label">Wybierz zapisany plik</p>
          <IconArrowRight />
        </div>
        <input
          id={fileInputId}
          className="import-wb__file-input"
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          disabled={busy}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) {
              onPickFile(file)
            }
            event.target.value = ''
          }}
        />
      </label>

      <div className="import-wb__callout" data-node-id="5:3518" data-name="Informacja">
        <div className="import-wb__callout-icon">
          <IconInfo />
        </div>
        <div>
          <p className="import-wb__callout-title">
            {FIGMA_IMPORT_WORKBOOK_PREVIEW_CALLOUT_TITLE}
          </p>
          <p className="import-wb__callout-text">
            {FIGMA_IMPORT_WORKBOOK_PREVIEW_CALLOUT_BODY}
          </p>
        </div>
      </div>

      {busy && status && <p className="import-wb__busy">{status}</p>}
      {error && <p className="import-wb__error">{error}</p>}

      <ImportWorkbookPrivacyFooter />
    </ImportWorkbookShell>
  )
}
