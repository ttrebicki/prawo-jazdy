import { useFigmaLayout } from '../layout/FigmaLayoutContext.tsx'
import {
  FIGMA_RESULT_CLIPS_STORED,
  FIGMA_RESULT_FOOTNOTE_LINE,
  FIGMA_RESULT_FOOTNOTE_SECOND,
  FIGMA_RESULT_IMAGES_FOUND,
  FIGMA_RESULT_QUESTIONS_B_WITHOUT_MEDIA,
} from './figma-display-copy.ts'
import { IconArrowRight, IconFolderCheck, IconInfo } from './icons.tsx'
import { formatPlNumber } from './format-pl-number.ts'

interface MediaImportWideResultScreenProps {
  onStartPractice: () => void
  onBackToStart: () => void
}

/** Desktop · Multimedia · wynik importu (15:12503) / Tablet · Multimedia · wynik importu (15:13474) */
export function MediaImportWideResultScreen({
  onStartPractice,
  onBackToStart,
}: MediaImportWideResultScreenProps) {
  const { isDesktop } = useFigmaLayout()
  const missingLabel = formatPlNumber(FIGMA_RESULT_QUESTIONS_B_WITHOUT_MEDIA)

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
        <h1 className="figma-wide__intro-title">Materiały na miejscu</h1>
        <p className="figma-wide__intro-lead">
          Pliki zostały dopasowane do katalogu. Możesz korzystać z nich bez połączenia z
          internetem.
        </p>
      </div>

      <div className="figma-wide__summary-card">
        <div className="figma-wide__summary-row">
          <p className="figma-wide__summary-label">Znalezione obrazy</p>
          <p className="figma-wide__summary-value">
            {formatPlNumber(FIGMA_RESULT_IMAGES_FOUND)}
          </p>
        </div>
        <div className="figma-wide__summary-row">
          <p className="figma-wide__summary-label">Zapisane klipy</p>
          <p className="figma-wide__summary-value">
            {formatPlNumber(FIGMA_RESULT_CLIPS_STORED)}
          </p>
        </div>
        <div className="figma-wide__summary-row">
          <p className="figma-wide__summary-label">Pytania B nadal bez mediów</p>
          <p className="figma-wide__summary-value">{missingLabel}</p>
        </div>
      </div>

      <p className="figma-wide__hint">
        {FIGMA_RESULT_FOOTNOTE_LINE}
        <br />
        {FIGMA_RESULT_FOOTNOTE_SECOND}
      </p>

      <div className="figma-wide__callout">
        <IconInfo />
        <div>
          <p className="figma-wide__callout-title">
            {missingLabel} pytań bez użytecznych mediów
          </p>
          <p className="figma-wide__callout-text">
            Brakujące lub nieczytelne pliki nie blokują ćwiczeń. Przy takim pytaniu pokażemy
            informację o braku materiału.
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
