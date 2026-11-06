import { IconArrowRight, IconFolderCheck, IconInfo } from './icons.tsx'
import { formatPlNumber } from './format-pl-number.ts'
import { MediaImportPrivacyLine } from './MediaImportPrivacyLine.tsx'

interface MediaImportResultScreenProps {
  fileName: string
  entryCount: number
  onStartPractice: () => void
  onBackToStart: () => void
}

export function MediaImportResultScreen({
  fileName,
  entryCount,
  onStartPractice,
  onBackToStart,
}: MediaImportResultScreenProps) {
  const entryLabel = formatPlNumber(entryCount)

  return (
    <>
      <div className="figma-import-media__success-badge" aria-hidden>
        <IconFolderCheck />
      </div>

      <div className="figma-import-media__intro">
        <p className="figma-import-media__eyebrow">KROK 2 Z 2 · GOTOWE</p>
        <h2 className="figma-import-media__headline">Archiwum podpięte</h2>
        <p className="figma-import-media__lead">
          Zdjęcia zostają w wybranym pliku ZIP. Przy pytaniu wczytamy tylko ten jeden plik.
        </p>
      </div>

      <section className="figma-import-media__summary" aria-label="Podpięte archiwum">
        <div className="figma-import-media__summary-row">
          <p className="figma-import-media__summary-label">Plik</p>
          <p className="figma-import-media__summary-value">{fileName}</p>
        </div>
        <div className="figma-import-media__summary-row">
          <p className="figma-import-media__summary-label">Pozycje w spisie</p>
          <p className="figma-import-media__summary-value">{entryLabel}</p>
        </div>
      </section>

      <div className="figma-import-media__callout">
        <IconInfo />
        <div>
          <p className="figma-import-media__callout-title">Bez rozpakowywania całości</p>
          <p className="figma-import-media__callout-body">
            Jeśli któregoś pliku nie ma albo jest ucięty, to pytanie pokaże błąd. Reszta
            ćwiczeń zostaje dostępna.
          </p>
        </div>
      </div>

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

      <MediaImportPrivacyLine />
    </>
  )
}
