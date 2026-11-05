import { useRef } from 'react'
import {
  FIGMA_BEFORE_ARCHIVE_SIZE,
  FIGMA_BEFORE_SIZE_NOTE,
} from './figma-display-copy.ts'
import {
  IconArchive,
  IconClapperboard,
  IconDownload,
  IconImage,
  IconSmartphone,
  IconWifi,
} from './icons.tsx'

interface MediaImportBeforeScreenProps {
  saveEnabled: boolean
  busy: boolean
  online: boolean
  statusMessage: string | null
  onConfirmDownload: () => void
  onSave: () => void
  onPickZip: (file: File) => void
  onSkip: () => void
}

export function MediaImportBeforeScreen({
  saveEnabled,
  busy,
  online,
  statusMessage,
  onConfirmDownload,
  onSave,
  onPickZip,
  onSkip,
}: MediaImportBeforeScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const saveDisabled = busy || !saveEnabled

  const handleFileChange = (file: File | undefined) => {
    if (!file) {
      return
    }
    onPickZip(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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

      {statusMessage && (
        <p className="figma-import-media__status" aria-live="polite">
          {statusMessage}
        </p>
      )}

      <label className="figma-import-media__btn figma-import-media__btn--ghost figma-import-media__pick">
        Wskaż pobrany plik ZIP
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,application/zip"
          hidden
          disabled={busy}
          onChange={(e) => handleFileChange(e.target.files?.[0])}
        />
      </label>

      <div className="figma-import-media__actions">
        <button
          type="button"
          className="figma-import-media__btn figma-import-media__btn--primary"
          disabled={busy || !online}
          onClick={onConfirmDownload}
        >
          Rozpocznij pobieranie
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
        <button
          type="button"
          className="figma-import-media__btn figma-import-media__btn--primary"
          disabled={saveDisabled}
          onClick={onSave}
        >
          Zapisz multimedia
          <IconDownload />
        </button>
      </div>

      <p className="figma-import-media__privacy">
        <IconSmartphone />
        Bez konta. Postępy tylko na tym telefonie.
      </p>
    </>
  )
}
