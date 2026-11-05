import {
  IconArrowRight,
  IconBookOpenCheck,
  IconCheckDouble,
} from './icons.tsx'
import {
  formatImportWorkbookCatalogDate,
  formatImportWorkbookCount,
} from './format.ts'
import { ImportWorkbookPrivacyFooter } from './ImportWorkbookPrivacyFooter.tsx'
import { ImportWorkbookShell } from './ImportWorkbookShell.tsx'

export interface ImportWorkbookResultSummary {
  catalogDateLabel: string | null
  keptActive: number
  categoryBCount: number
  verificationExcluded: number
  categoryBWithoutMedia: number
}

export interface ImportWorkbookResultViewProps {
  summary: ImportWorkbookResultSummary
  busy: boolean
  onBack: () => void
  onContinueToMedia: () => void
  onGoToPractice: () => void
}

export function ImportWorkbookResultView({
  summary,
  busy,
  onBack,
  onContinueToMedia,
  onGoToPractice,
}: ImportWorkbookResultViewProps) {
  const rows: { label: string; value: string }[] = [
    {
      label: 'Data katalogu na urządzeniu',
      value: formatImportWorkbookCatalogDate(summary.catalogDateLabel),
    },
    {
      label: 'Zachowane aktywne pytania',
      value: formatImportWorkbookCount(summary.keptActive),
    },
    {
      label: 'W tym kategoria B',
      value: formatImportWorkbookCount(summary.categoryBCount),
    },
    {
      label: 'Wykluczone: arkusz weryfikacyjny',
      value: formatImportWorkbookCount(summary.verificationExcluded),
    },
    {
      label: 'Pytania B bez użytecznych mediów',
      value: formatImportWorkbookCount(summary.categoryBWithoutMedia),
    },
  ]

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
        {rows.map((row) => (
          <div key={row.label} className="import-wb__summary-row">
            <p className="import-wb__summary-label">{row.label}</p>
            <p className="import-wb__summary-value">{row.value}</p>
          </div>
        ))}
      </div>

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
          <IconArrowRight />
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
