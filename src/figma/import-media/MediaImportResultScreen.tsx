import {
  IconArrowRight,
  IconFolderCheck,
  IconInfo,
  IconSmartphone,
} from './icons.tsx'
import { formatPlNumber } from './format-pl-number.ts'
import type { MediaImportResultViewModel } from './types.ts'

interface MediaImportResultScreenProps {
  result: MediaImportResultViewModel
  onStartPractice: () => void
  onBackToStart: () => void
}

export function MediaImportResultScreen({
  result,
  onStartPractice,
  onBackToStart,
}: MediaImportResultScreenProps) {
  const missingLabel = formatPlNumber(result.questionsBWithoutMedia)

  return (
    <>
      <div className="figma-import-media__success-badge" aria-hidden>
        <IconFolderCheck />
      </div>

      <div className="figma-import-media__intro">
        <p className="figma-import-media__eyebrow">KROK 2 Z 2 · GOTOWE</p>
        <h2 className="figma-import-media__headline">Materiały na miejscu</h2>
        <p className="figma-import-media__lead">
          Pliki zostały dopasowane do katalogu. Możesz korzystać z nich bez połączenia z
          internetem.
        </p>
      </div>

      <section className="figma-import-media__summary" aria-label="Podsumowanie multimediów">
        <div className="figma-import-media__summary-row">
          <p className="figma-import-media__summary-label">Znalezione obrazy</p>
          <p className="figma-import-media__summary-value">
            {formatPlNumber(result.imagesFound)}
          </p>
        </div>
        <div className="figma-import-media__summary-row">
          <p className="figma-import-media__summary-label">Zapisane klipy</p>
          <p className="figma-import-media__summary-value">
            {formatPlNumber(result.clipsStored)}
          </p>
        </div>
        <div className="figma-import-media__summary-row">
          <p className="figma-import-media__summary-label">Pytania B nadal bez mediów</p>
          <p className="figma-import-media__summary-value">{missingLabel}</p>
        </div>
      </section>

      <p className="figma-import-media__footnote">
        Wynik importu · katalog z {result.catalogDateLabel}
        <br />
        Liczby plików nie oznaczają liczby pytań.
      </p>

      {result.questionsBWithoutMedia > 0 && (
        <div className="figma-import-media__callout">
          <IconInfo />
          <div>
            <p className="figma-import-media__callout-title">
              {missingLabel} pytań bez użytecznych mediów
            </p>
            <p className="figma-import-media__callout-body">
              Brakujące lub nieczytelne pliki nie blokują ćwiczeń. Przy takim pytaniu pokażemy
              informację o braku materiału.
            </p>
          </div>
        </div>
      )}

      <div className="figma-import-media__actions">
        <button
          type="button"
          className="figma-import-media__btn figma-import-media__btn--primary"
          onClick={onStartPractice}
        >
          Zacznij ćwiczyć
          <IconArrowRight />
        </button>
        <button
          type="button"
          className="figma-import-media__btn figma-import-media__btn--secondary"
          onClick={onBackToStart}
        >
          Wróć na start
        </button>
      </div>

      <p className="figma-import-media__privacy">
        <IconSmartphone />
        Bez konta. Postępy tylko na tym telefonie.
      </p>
    </>
  )
}
