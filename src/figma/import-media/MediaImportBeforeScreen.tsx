import {
  FIGMA_BEFORE_ARCHIVE_SIZE,
  FIGMA_BEFORE_SIZE_NOTE,
} from './figma-display-copy.ts'
import {
  IconArchive,
  IconClapperboard,
  IconDownload,
  IconImage,
  IconWifi,
} from './icons.tsx'
import { MediaImportPrivacyLine } from './MediaImportPrivacyLine.tsx'

interface MediaImportBeforeScreenProps {
  busy: boolean
  online: boolean
  statusMessage: string | null
  progressPercent: number | null
  error: string | null
  onBeginDownload: () => void
  onSkip: () => void
}

export function MediaImportBeforeScreen({
  busy,
  online,
  statusMessage,
  progressPercent,
  error,
  onBeginDownload,
  onSkip,
}: MediaImportBeforeScreenProps) {
  return (
    <>
      <div className="figma-import-media__intro">
        <p className="figma-import-media__eyebrow">KROK 2 Z 2 · OPCJONALNIE</p>
        <h2 className="figma-import-media__headline">
          Dodaj obraz.
          <br />
          Zachowaj spokój.
        </h2>
        <p className="figma-import-media__lead">
          Zdjęcia i klipy zapiszą się na telefonie. Katalog pytań pozostanie bez zmian.
        </p>
      </div>

      <section className="figma-import-media__card" aria-labelledby="archive-size-heading">
        <div className="figma-import-media__type-row" aria-hidden>
          <div className="figma-import-media__type-icon">
            <IconImage />
          </div>
          <div className="figma-import-media__type-icon">
            <IconClapperboard />
          </div>
          <div className="figma-import-media__type-icon">
            <IconArchive />
          </div>
        </div>
        <div>
          <p id="archive-size-heading" className="figma-import-media__size-label">
            Rozmiar archiwum przed pobraniem
          </p>
          <p className="figma-import-media__size-value">{FIGMA_BEFORE_ARCHIVE_SIZE}</p>
          <p className="figma-import-media__size-note">{FIGMA_BEFORE_SIZE_NOTE}</p>
        </div>
      </section>

      <div className="figma-import-media__callout">
        <IconWifi />
        <div>
          <p className="figma-import-media__callout-title">Najlepiej przez Wi-Fi</p>
          <p className="figma-import-media__callout-body">
            To duży plik. Możesz pominąć pobieranie i wrócić do niego z ekranu startowego.
          </p>
        </div>
      </div>

      {(statusMessage || progressPercent !== null) && (
        <div className="figma-import-media__progress" aria-live="polite">
          {statusMessage && (
            <p className="figma-import-media__status">{statusMessage}</p>
          )}
          {progressPercent !== null && (
            <div
              className="figma-import-media__progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
            >
              <div
                className="figma-import-media__progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="figma-import-media__error" role="alert">
          {error}
        </p>
      )}

      <div className="figma-import-media__actions">
        <button
          type="button"
          className="figma-import-media__btn figma-import-media__btn--primary"
          disabled={busy || !online}
          onClick={onBeginDownload}
        >
          {busy ? 'Pobieranie…' : 'Rozpocznij pobieranie'}
          <IconDownload />
        </button>
        <button
          type="button"
          className="figma-import-media__btn figma-import-media__btn--secondary"
          disabled={busy}
          onClick={onSkip}
        >
          Pomiń i ćwicz
        </button>
      </div>

      <MediaImportPrivacyLine />
    </>
  )
}
