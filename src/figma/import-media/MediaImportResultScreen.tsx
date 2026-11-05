import {
  FIGMA_RESULT_CLIPS_STORED,
  FIGMA_RESULT_FOOTNOTE_LINE,
  FIGMA_RESULT_FOOTNOTE_SECOND,
  FIGMA_RESULT_IMAGES_FOUND,
  FIGMA_RESULT_QUESTIONS_B_WITHOUT_MEDIA,
} from './figma-display-copy.ts'
import { IconArrowRight, IconFolderCheck, IconInfo } from './icons.tsx'
import { formatPlNumber } from './format-pl-number.ts'

interface MediaImportResultScreenProps {
  onStartPractice: () => void
  onBackToStart: () => void
}

export function MediaImportResultScreen({
  onStartPractice,
  onBackToStart,
}: MediaImportResultScreenProps) {
  const missingLabel = formatPlNumber(FIGMA_RESULT_QUESTIONS_B_WITHOUT_MEDIA)

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
            {formatPlNumber(FIGMA_RESULT_IMAGES_FOUND)}
          </p>
        </div>
        <div className="figma-import-media__summary-row">
          <p className="figma-import-media__summary-label">Zapisane klipy</p>
          <p className="figma-import-media__summary-value">
            {formatPlNumber(FIGMA_RESULT_CLIPS_STORED)}
          </p>
        </div>
        <div className="figma-import-media__summary-row">
          <p className="figma-import-media__summary-label">Pytania B nadal bez mediów</p>
          <p className="figma-import-media__summary-value">{missingLabel}</p>
        </div>
      </section>

      <p className="figma-import-media__footnote">
        {FIGMA_RESULT_FOOTNOTE_LINE}
        <br />
        {FIGMA_RESULT_FOOTNOTE_SECOND}
      </p>

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
    </>
  )
}
