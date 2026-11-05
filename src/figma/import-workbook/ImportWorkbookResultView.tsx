import {
  IconArrowRightPrimary,
  IconBookOpenCheck,
  IconCheckDouble,
} from './icons.tsx'
import {
  FIGMA_IMPORT_WORKBOOK_SAMPLE_FOOTNOTE,
  FIGMA_IMPORT_WORKBOOK_SAMPLE_RESULT_ROWS,
} from './figmaSampleResult.ts'
import { ImportWorkbookPrivacyFooter } from './ImportWorkbookPrivacyFooter.tsx'
import { ImportWorkbookShell } from './ImportWorkbookShell.tsx'

export interface ImportWorkbookResultViewProps {
  busy: boolean
  onBack: () => void
  onContinueToMedia: () => void
  onGoToPractice: () => void
}

export function ImportWorkbookResultView({
  busy,
  onBack,
  onContinueToMedia,
  onGoToPractice,
}: ImportWorkbookResultViewProps) {
  return (
    <ImportWorkbookShell title="Import katalogu" onBack={onBack}>
      <div className="import-wb__success-icon" data-node-id="5:3542">
        <IconCheckDouble />
      </div>

      <div className="import-wb__intro" data-node-id="5:3544">
        <p className="import-wb__eyebrow">KROK 1 Z 2 · GOTOWE</p>
        <h1 className="import-wb__title">Katalog uporządkowany</h1>
        <p className="import-wb__lead">
          Pytania do nauki są na telefonie. Arkusz weryfikacyjny nie trafił do
          ćwiczeń.
        </p>
      </div>

      <div className="import-wb__summary" data-node-id="5:3548">
        {FIGMA_IMPORT_WORKBOOK_SAMPLE_RESULT_ROWS.map((row) => (
          <div key={row.label} className="import-wb__summary-row">
            <p className="import-wb__summary-label">{row.label}</p>
            <p className="import-wb__summary-value">{row.value}</p>
          </div>
        ))}
      </div>

      <p className="import-wb__footnote" data-node-id="5:3564">
        {FIGMA_IMPORT_WORKBOOK_SAMPLE_FOOTNOTE}
      </p>

      <div className="import-wb__callout" data-name="Informacja">
        <div className="import-wb__callout-icon">
          <IconBookOpenCheck />
        </div>
        <div>
          <p className="import-wb__callout-title">Możesz już ćwiczyć</p>
          <p className="import-wb__callout-text">
            Kategoria B jest gotowa. Multimedia są opcjonalne — możesz dodać je teraz
            lub później.
          </p>
        </div>
      </div>

      <div className="import-wb__actions" data-node-id="5:3570">
        <button
          type="button"
          className="import-wb__btn-primary"
          disabled={busy}
          onClick={onContinueToMedia}
        >
          Dalej: multimedia
          <IconArrowRightPrimary />
        </button>
        <button
          type="button"
          className="import-wb__btn-secondary"
          disabled={busy}
          onClick={onGoToPractice}
        >
          Przejdź do ćwiczeń
        </button>
      </div>

      <ImportWorkbookPrivacyFooter />
    </ImportWorkbookShell>
  )
}
