import { useFigmaLayout } from '../layout/FigmaLayoutContext.tsx'
import {
  IconArrowRightPrimary,
  IconBookOpenCheck,
  IconCheckDouble,
} from './icons.tsx'
import {
  FIGMA_IMPORT_WORKBOOK_SAMPLE_FOOTNOTE,
  FIGMA_IMPORT_WORKBOOK_SAMPLE_RESULT_ROWS,
} from './figmaSampleResult.ts'
import type { ImportWorkbookResultViewProps } from './ImportWorkbookResultView.tsx'

/** Desktop · Import · wynik skoroszytu (15:12386) / Tablet · Import · wynik skoroszytu (15:13355) */
export function ImportWorkbookWideResultView({
  busy,
  onContinueToMedia,
  onGoToPractice,
}: ImportWorkbookResultViewProps) {
  const { isDesktop } = useFigmaLayout()

  return (
    <div
      className="figma-wide__content figma-wide__content--narrow"
      data-node-id={isDesktop ? '15:12386' : '15:13355'}
      data-name={
        isDesktop
          ? 'Desktop · Import · wynik skoroszytu'
          : 'Tablet · Import · wynik skoroszytu'
      }
    >
      <div className="figma-wide__success-icon">
        <IconCheckDouble />
      </div>

      <div className="figma-wide__intro-block">
        <p className="figma-wide__intro-eyebrow">KROK 1 Z 2 · GOTOWE</p>
        <h1 className="figma-wide__intro-title">Katalog uporządkowany</h1>
        <p className="figma-wide__intro-lead">
          Pytania do nauki są na telefonie. Arkusz weryfikacyjny nie trafił do ćwiczeń.
        </p>
      </div>

      <div className="figma-wide__summary-card">
        {FIGMA_IMPORT_WORKBOOK_SAMPLE_RESULT_ROWS.map((row) => (
          <div key={row.label} className="figma-wide__summary-row">
            <p className="figma-wide__summary-label">{row.label}</p>
            <p className="figma-wide__summary-value">{row.value}</p>
          </div>
        ))}
      </div>

      <p className="figma-wide__hint">{FIGMA_IMPORT_WORKBOOK_SAMPLE_FOOTNOTE}</p>

      <div className="figma-wide__callout">
        <IconBookOpenCheck />
        <div>
          <p className="figma-wide__callout-title">Możesz już ćwiczyć</p>
          <p className="figma-wide__callout-text">
            Kategoria B jest gotowa. Multimedia są opcjonalne — możesz dodać je teraz
            lub później.
          </p>
        </div>
      </div>

      <div className="figma-wide__action-row">
        <button
          type="button"
          className="figma-wide__btn-primary"
          disabled={busy}
          onClick={onContinueToMedia}
        >
          Dalej: multimedia
          <IconArrowRightPrimary />
        </button>
        <button
          type="button"
          className="figma-wide__btn-outline"
          disabled={busy}
          onClick={onGoToPractice}
        >
          Przejdź do ćwiczeń
        </button>
      </div>

      <p className="figma-wide__privacy">
        Import odbywa się lokalnie. Żadne dane nie opuszczają urządzenia.
      </p>
    </div>
  )
}
