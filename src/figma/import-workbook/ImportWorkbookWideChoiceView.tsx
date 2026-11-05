import { useId } from 'react'
import { useFigmaLayout } from '../layout/FigmaLayoutContext.tsx'
import {
  IconArrowRight,
  IconDownload,
  IconFolderOpen,
  IconInfo,
} from './icons.tsx'
import {
  FIGMA_IMPORT_WORKBOOK_PREVIEW_CALLOUT_BODY,
  FIGMA_IMPORT_WORKBOOK_PREVIEW_CALLOUT_TITLE,
} from './figmaCopy.ts'
import type { ImportWorkbookChoiceViewProps } from './ImportWorkbookChoiceView.tsx'

/** Desktop · Import · wybór skoroszytu (15:12327) / Tablet · Import · wybór skoroszytu (15:13295) */
export function ImportWorkbookWideChoiceView({
  online,
  busy,
  error,
  status,
  onDownloadOfficial,
  onPickFile,
}: ImportWorkbookChoiceViewProps) {
  const { isDesktop } = useFigmaLayout()
  const fileInputId = useId()

  return (
    <div
      className="figma-wide__content"
      data-node-id={isDesktop ? '15:12327' : '15:13295'}
      data-name={
        isDesktop
          ? 'Desktop · Import · wybór skoroszytu'
          : 'Tablet · Import · wybór skoroszytu'
      }
    >
      <div className="figma-wide__intro-block">
        <p className="figma-wide__intro-eyebrow">KROK 1 Z 2 · PYTANIA</p>
        <h1 className="figma-wide__intro-title">Zacznij od katalogu</h1>
        <p className="figma-wide__intro-lead">
          Wybierz źródło skoroszytu. Media dodasz osobno, w kolejnym kroku.
        </p>
      </div>

      <div className="figma-wide__source-grid">
        <button
          type="button"
          className="figma-wide__source-card figma-wide__source-card--recommended"
          disabled={busy || !online}
          onClick={onDownloadOfficial}
        >
          <div className="figma-wide__source-top">
            <IconDownload />
            <p className="figma-wide__source-badge">ZALECANE</p>
          </div>
          <div>
            <p className="figma-wide__source-title">Katalog ministerstwa</p>
            <p className="figma-wide__source-desc">
              Pobierz oficjalny skoroszyt pytań ze strony Ministerstwa Infrastruktury.
            </p>
          </div>
          <span className="figma-wide__source-action figma-wide__source-action--primary">
            Pobierz katalog
            <IconArrowRight />
          </span>
        </button>

        <label htmlFor={fileInputId} className="figma-wide__source-card" aria-disabled={busy}>
          <div className="figma-wide__source-top">
            <IconFolderOpen />
          </div>
          <div>
            <p className="figma-wide__source-title">
              {isDesktop ? 'Plik z urządzenia' : 'Plik z telefonu'}
            </p>
            <p className="figma-wide__source-desc">
              Masz zapisany skoroszyt? Wybierz plik XLSX z pamięci urządzenia.
            </p>
          </div>
          <span className="figma-wide__source-action figma-wide__source-action--outline">
            Wybierz zapisany plik
            <IconArrowRight />
          </span>
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
      </div>

      <div className="figma-wide__callout">
        <IconInfo />
        <div>
          <p className="figma-wide__callout-title">
            {FIGMA_IMPORT_WORKBOOK_PREVIEW_CALLOUT_TITLE}
          </p>
          <p className="figma-wide__callout-text">
            {FIGMA_IMPORT_WORKBOOK_PREVIEW_CALLOUT_BODY}
          </p>
        </div>
      </div>

      {busy && status ? <p className="figma-wide__status">{status}</p> : null}
      {error ? <p className="figma-wide__error">{error}</p> : null}
    </div>
  )
}
