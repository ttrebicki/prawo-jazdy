import {
  OFFICIAL_MEDIA_ZIP_URL,
  OFFICIAL_PAGE_URL,
} from '../../domain/constants.ts'
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
  error: string | null
  showOfficialUrlHint: boolean
  onBrowserDownload: () => void
  onPickFile: () => void
  onSkip: () => void
}

export function MediaImportBeforeScreen({
  busy,
  online,
  statusMessage,
  error,
  showOfficialUrlHint,
  onBrowserDownload,
  onPickFile,
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
          Najpierw pobierz archiwum przez przeglądarkę (duży plik — bez przerw może
          trwać godzinami). Potem wskaż ten sam plik ZIP, aby zapisać zdjęcia w
          aplikacji.
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
            Pobieranie prowadzi Chrome lub system operacyjny — aplikacja nie trzyma
            transferu w tle.
          </p>
        </div>
      </div>

      {statusMessage && (
        <p className="figma-import-media__status" aria-live="polite">
          {statusMessage}
        </p>
      )}

      {error && (
        <div className="figma-import-media__error" role="alert">
          <p>{error}</p>
          {showOfficialUrlHint && (
            <p className="figma-import-media__error-links">
              Oficjalne archiwum:{' '}
              <a href={OFFICIAL_MEDIA_ZIP_URL} target="_blank" rel="noreferrer">
                {OFFICIAL_MEDIA_ZIP_URL}
              </a>
              <br />
              Strona Ministerstwa:{' '}
              <a href={OFFICIAL_PAGE_URL} target="_blank" rel="noreferrer">
                {OFFICIAL_PAGE_URL}
              </a>
            </p>
          )}
        </div>
      )}

      <div className="figma-import-media__actions">
        <button
          type="button"
          className="figma-import-media__btn figma-import-media__btn--primary"
          disabled={busy || !online}
          onClick={onBrowserDownload}
        >
          Rozpocznij pobieranie
          <IconDownload />
        </button>
        <button
          type="button"
          className="figma-import-media__btn figma-import-media__btn--secondary"
          disabled={busy}
          onClick={onPickFile}
        >
          Wskaż plik ZIP z dysku
        </button>
        <p className="figma-import-media__step-hint">
          Po pobraniu wybierz ten sam plik .zip albo wskaż kopię zapisana wcześniej na
          urządzeniu.
        </p>
        <button
          type="button"
          className="figma-import-media__btn figma-import-media__btn--ghost"
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
