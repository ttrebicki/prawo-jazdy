import { useRef, useState } from 'react'
import {
  MEDIA_ZIP_SIZE_LABEL,
  OFFICIAL_MEDIA_ZIP_URL,
} from '../../domain/constants.ts'
import {
  emptyMediaImportDraft,
  isMediaImportSaveEnabled,
  type MediaImportDraft,
} from '../media-import/can-save-media-import.ts'

export type MediaImportSavePayload =
  | { kind: 'file'; file: File }
  | { kind: 'download' }

interface MediaImportActionProps {
  busy: boolean
  online: boolean
  onSave: (payload: MediaImportSavePayload) => Promise<{ stored: number; skipped: number }>
  onBusyChange: (busy: boolean) => void
  onStatus: (message: string | null) => void
  onError: (message: string | null) => void
  onResult: (result: { stored: number; skipped: number }) => void
}

const MEDIA_DOWNLOAD_CONFIRM_MESSAGE = `Archiwum „Multimedia do pytań” ma około ${MEDIA_ZIP_SIZE_LABEL}. Import zapisuje tylko zdjęcia JPG/JPEG pasujące do katalogu. Pobieranie z gov.pl rozpocznie się dopiero po naciśnięciu „Zapisz multimedia”. Czy wybrać pobieranie z gov.pl?`

export function MediaImportAction({
  busy,
  online,
  onSave,
  onBusyChange,
  onStatus,
  onError,
  onResult,
}: MediaImportActionProps) {
  const [draft, setDraft] = useState<MediaImportDraft>(emptyMediaImportDraft)
  const mediaInputRef = useRef<HTMLInputElement>(null)
  const isSaveEnabled = isMediaImportSaveEnabled(draft, busy)

  const resetPicker = () => {
    if (mediaInputRef.current) {
      mediaInputRef.current.value = ''
    }
  }

  const handleFileChange = (file: File | undefined) => {
    if (!file) {
      return
    }
    setDraft({
      action: 'pick',
      pendingFile: file,
      isDownloadConfirmed: false,
    })
    resetPicker()
    onError(null)
    onStatus(`Wybrano plik: ${file.name}. Naciśnij „Zapisz multimedia”, aby rozpocząć import.`)
  }

  const chooseDownloadAction = () => {
    if (!online) {
      onError('Brak sieci. Pobieranie archiwum wymaga połączenia — wskaż plik ZIP z pamięci urządzenia.')
      return
    }
    if (!window.confirm(MEDIA_DOWNLOAD_CONFIRM_MESSAGE)) {
      return
    }
    setDraft({
      action: 'download',
      pendingFile: null,
      isDownloadConfirmed: true,
    })
    onError(null)
    onStatus(
      `Wybrano pobieranie z gov.pl (${MEDIA_ZIP_SIZE_LABEL}). Naciśnij „Zapisz multimedia”, aby rozpocząć transfer.`,
    )
  }

  const handleSave = async () => {
    if (!isSaveEnabled) {
      return
    }
    onBusyChange(true)
    onError(null)
    onStatus(
      draft.action === 'download'
        ? `Pobieranie archiwum (${MEDIA_ZIP_SIZE_LABEL}) i import zdjęć…`
        : 'Import zdjęć z archiwum (tylko JPG/JPEG)…',
    )
    try {
      const payload: MediaImportSavePayload =
        draft.pendingFile !== null
          ? { kind: 'file', file: draft.pendingFile }
          : { kind: 'download' }
      const result = await onSave(payload)
      onResult(result)
      onStatus(`Zapisano ${result.stored} zdjęć na urządzeniu.`)
      setDraft(emptyMediaImportDraft())
      resetPicker()
    } catch (e) {
      onError(
        e instanceof Error
          ? e.message
          : 'Import multimediów nie powiódł się. Poprzednie pliki pozostają.',
      )
      onStatus(null)
    } finally {
      onBusyChange(false)
    }
  }

  return (
    <section className="card stack">
      <h2 className="page-title-sm">Multimedia (osobna operacja)</h2>
      <p className="muted">
        Najpierw wybierz plik ZIP albo potwierdź pobieranie z gov.pl (rozmiar{' '}
        {MEDIA_ZIP_SIZE_LABEL}), potem zapisz import na urządzeniu.
      </p>
      <a className="muted text-link" href={OFFICIAL_MEDIA_ZIP_URL} target="_blank" rel="noreferrer">
        Oficjalne archiwum na gov.pl
      </a>
      <label className="btn btn-secondary">
        Wskaż pobrany plik ZIP
        <input
          ref={mediaInputRef}
          type="file"
          accept=".zip,application/zip"
          hidden
          disabled={busy}
          onChange={(e) => handleFileChange(e.target.files?.[0])}
        />
      </label>
      <button
        type="button"
        className="btn btn-secondary"
        disabled={busy || !online}
        onClick={chooseDownloadAction}
      >
        Pobierz z gov.pl ({MEDIA_ZIP_SIZE_LABEL})
      </button>
      <button
        type="button"
        className="btn"
        disabled={!isSaveEnabled}
        onClick={() => void handleSave()}
      >
        Zapisz multimedia
      </button>
    </section>
  )
}
