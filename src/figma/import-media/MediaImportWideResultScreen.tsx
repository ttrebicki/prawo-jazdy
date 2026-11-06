import { useFigmaLayout } from '../layout/FigmaLayoutContext.tsx'
import { IconArrowRight, IconFolderCheck, IconInfo } from './icons.tsx'
import { formatPlNumber } from './format-pl-number.ts'

interface MediaImportWideResultScreenProps {
  fileName: string
  entryCount: number
  onStartPractice: () => void
  onBackToStart: () => void
}

/** Desktop · Multimedia · wynik importu (15:12503) / Tablet · Multimedia · wynik importu (15:13474) */
export function MediaImportWideResultScreen({
  fileName,
  entryCount,
  onStartPractice,
  onBackToStart,
}: MediaImportWideResultScreenProps) {
  const { isDesktop } = useFigmaLayout()
  const entryLabel = formatPlNumber(entryCount)

  return (
    <div
      className="figma-wide__content figma-wide__content--narrow"
      data-node-id={isDesktop ? '15:12503' : '15:13474'}
      data-name={
        isDesktop
          ? 'Desktop · Multimedia · wynik importu'
          : 'Tablet · Multimedia · wynik importu'
      }
    >
      <div className="figma-wide__success-icon">
        <IconFolderCheck />
      </div>

      <div className="figma-wide__intro-block">
        <p className="figma-wide__intro-eyebrow">KROK 2 Z 2 · GOTOWE</p>
        <h1 className="figma-wide__intro-title">Archiwum podpięte</h1>
        <p className="figma-wide__intro-lead">
          Zdjęcia zostają w wybranym pliku ZIP. Przy pytaniu wczytamy tylko ten jeden plik.
        </p>
      </div>

      <div className="figma-wide__summary-card">
        <div className="figma-wide__summary-row">
          <p className="figma-wide__summary-label">Plik</p>
          <p className="figma-wide__summary-value">{fileName}</p>
        </div>
        <div className="figma-wide__summary-row">
          <p className="figma-wide__summary-label">Pozycje w spisie</p>
          <p className="figma-wide__summary-value">{entryLabel}</p>
        </div>
      </div>

      <div className="figma-wide__callout">
        <IconInfo />
        <div>
          <p className="figma-wide__callout-title">Bez rozpakowywania całości</p>
          <p className="figma-wide__callout-text">
            Jeśli któregoś pliku nie ma albo jest ucięty, to pytanie pokaże błąd. Reszta
            ćwiczeń zostaje dostępna.
          </p>
        </div>
      </div>

      <div className="figma-wide__action-row">
        <button type="button" className="figma-wide__btn-primary" onClick={onStartPractice}>
          Zacznij ćwiczyć
          <IconArrowRight />
        </button>
        <button type="button" className="figma-wide__btn-outline" onClick={onBackToStart}>
          Wróć na start
        </button>
      </div>

      <p className="figma-wide__privacy">
        Import odbywa się lokalnie. Żadne dane nie opuszczają urządzenia.
      </p>
    </div>
  )
}
