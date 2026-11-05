import {
  OFFICIAL_MEDIA_ZIP_URL,
  OFFICIAL_PAGE_URL,
} from '../../domain/constants.ts'
import { useFigmaLayout } from '../layout/FigmaLayoutContext.tsx'
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

interface MediaImportWideBeforeScreenProps {
  busy: boolean
  online: boolean
  statusMessage: string | null
  error: string | null
  showOfficialUrlHint: boolean
  onBrowserDownload: () => void
  onPickFile: () => void
  onSkip: () => void
}

/** Desktop · Multimedia · przed pobraniem (15:12448) / Tablet · Multimedia · przed pobraniem (15:13418) */
export function MediaImportWideBeforeScreen({
  busy,
  online,
  statusMessage,
  error,
  showOfficialUrlHint,
  onBrowserDownload,
  onPickFile,
  onSkip,
}: MediaImportWideBeforeScreenProps) {
  const { isDesktop } = useFigmaLayout()

  return (
    <div
      className="figma-wide__content figma-wide__content--narrow"
      data-node-id={isDesktop ? '15:12448' : '15:13418'}
      data-name={
        isDesktop
          ? 'Desktop · Multimedia · przed pobraniem'
          : 'Tablet · Multimedia · przed pobraniem'
      }
    >
      <div className="figma-wide__intro-block">
        <p className="figma-wide__intro-eyebrow">KROK 2 Z 2 · OPCJONALNIE</p>
        <h1 className="figma-wide__intro-title">Dodaj obraz. Zachowaj spokój.</h1>
        <p className="figma-wide__intro-lead">
          Zdjęcia i klipy zapiszą się na tym urządzeniu. Katalog pytań pozostanie bez
          zmian.
        </p>
      </div>

      <section className="figma-wide__media-card" aria-labelledby="wide-archive-size">
        <div className="figma-wide__media-types" aria-hidden>
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
          <p id="wide-archive-size" className="figma-import-media__size-label">
            Rozmiar archiwum przed pobraniem
          </p>
          <p className="figma-wide__size-value">{FIGMA_BEFORE_ARCHIVE_SIZE}</p>
          <p className="figma-import-media__size-note">{FIGMA_BEFORE_SIZE_NOTE}</p>
        </div>
      </section>

      <div className="figma-wide__callout">
        <IconWifi />
        <div>
          <p className="figma-wide__callout-title">Najlepiej przez Wi-Fi</p>
          <p className="figma-wide__callout-text">
            To duży plik. Możesz pominąć pobieranie i wrócić do niego z ekranu startowego.
          </p>
        </div>
      </div>

      {statusMessage ? (
        <p className="figma-wide__status" aria-live="polite">
          {statusMessage}
        </p>
      ) : null}

      {error ? (
        <div className="figma-wide__error" role="alert">
          <p>{error}</p>
          {showOfficialUrlHint ? (
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
          ) : null}
        </div>
      ) : null}

      <div className="figma-wide__action-row">
        <button
          type="button"
          className="figma-wide__btn-primary"
          disabled={busy || !online}
          onClick={onBrowserDownload}
        >
          Rozpocznij pobieranie
          <IconDownload />
        </button>
        <button
          type="button"
          className="figma-wide__btn-outline"
          disabled={busy}
          onClick={onSkip}
        >
          Pomiń i ćwicz
        </button>
      </div>

      <div className="figma-wide__action-row figma-wide__action-row--stack">
        <button
          type="button"
          className="figma-wide__btn-outline"
          disabled={busy}
          onClick={onPickFile}
        >
          Wskaż plik ZIP z dysku
        </button>
        <p className="figma-wide__hint">
          Po pobraniu wybierz ten sam plik .zip albo wskaż kopię zapisaną wcześniej na
          urządzeniu.
        </p>
      </div>
    </div>
  )
}
