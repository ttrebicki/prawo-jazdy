import { useState } from 'react'
import {
  MEDIA_ZIP_SIZE_LABEL,
  OFFICIAL_MEDIA_ZIP_URL,
  OFFICIAL_PAGE_URL,
  OFFICIAL_WORKBOOK_URL,
  WORKBOOK_FILENAME,
} from '../../domain/constants.ts'
import type { ImportStats } from '../../domain/types.ts'

interface ImportViewProps {
  online: boolean
  onBack: () => void
  onImportWorkbook: (
    buffer: ArrayBuffer,
    meta: { filename: string; lastModified: string | null },
  ) => Promise<ImportStats>
  onImportMediaZip: (file: File) => Promise<{ stored: number; skipped: number }>
}

export function ImportView({
  online,
  onBack,
  onImportWorkbook,
  onImportMediaZip,
}: ImportViewProps) {
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [lastStats, setLastStats] = useState<ImportStats | null>(null)
  const [mediaResult, setMediaResult] = useState<{
    stored: number
    skipped: number
  } | null>(null)

  const handleDownload = async () => {
    if (!online) {
      setError('Brak sieci. Wskaż plik zapisany na urządzeniu.')
      return
    }
    setBusy(true)
    setError(null)
    setStatus('Pobieranie katalogu z gov.pl…')
    try {
      const response = await fetch(OFFICIAL_WORKBOOK_URL)
      if (!response.ok) {
        throw new Error(`Serwer zwrócił ${response.status}`)
      }
      const buffer = await response.arrayBuffer()
      const stats = await onImportWorkbook(buffer, {
        filename: WORKBOOK_FILENAME,
        lastModified: response.headers.get('Last-Modified'),
      })
      setLastStats(stats)
      setStatus('Katalog zapisany na urządzeniu.')
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message}. Możesz wskazać plik ręcznie.`
          : 'Nie udało się pobrać pliku.',
      )
      setStatus(null)
    } finally {
      setBusy(false)
    }
  }

  const handleFilePick = async (file: File | undefined) => {
    if (!file) {
      return
    }
    setBusy(true)
    setError(null)
    setStatus('Wczytywanie wskazanego pliku…')
    try {
      const buffer = await file.arrayBuffer()
      const stats = await onImportWorkbook(buffer, {
        filename: file.name,
        lastModified: null,
      })
      setLastStats(stats)
      setStatus('Katalog zapisany na urządzeniu.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Odrzucono plik.')
      setStatus(null)
    } finally {
      setBusy(false)
    }
  }

  const handleMediaPick = async (file: File | undefined) => {
    if (!file) {
      return
    }
    setBusy(true)
    setError(null)
    setStatus('Import zdjęć z archiwum (tylko JPG)…')
    try {
      const result = await onImportMediaZip(file)
      setMediaResult(result)
      setStatus(`Zapisano ${result.stored} zdjęć na urządzeniu.`)
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Import multimediów nie powiódł się. Poprzednie pliki pozostają.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="stack">
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        ← Wróć
      </button>
      <h1 className="page-title">Katalog i multimedia</h1>
      <p className="muted">
        Źródło:{' '}
        <a href={OFFICIAL_PAGE_URL} target="_blank" rel="noreferrer">
          gov.pl — prawo jazdy
        </a>
        . Arkusz „W trakcie weryfikacji” nie trafia do nauki.
      </p>

      {!online && (
        <div className="banner banner-warning">
          Jesteś offline. Pobieranie z gov.pl wymaga sieci — wskaż plik z pamięci
          urządzenia, jeśli masz kopię.
        </div>
      )}

      {error && <div className="banner banner-error">{error}</div>}
      {status && <div className="banner banner-success">{status}</div>}

      <button
        type="button"
        className="btn"
        disabled={busy}
        onClick={() => void handleDownload()}
      >
        Pobierz katalog z gov.pl
      </button>

      <label className="btn btn-secondary">
        Wskaż plik Excel na urządzeniu
        <input
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          hidden
          disabled={busy}
          onChange={(e) => void handleFilePick(e.target.files?.[0])}
        />
      </label>

      {lastStats && (
        <div className="card stack muted">
          <p>
            Pytania w bazie: <strong>{lastStats.kept}</strong>
          </p>
          <p>Pominięte puste wiersze: {lastStats.blankRowsSkipped}</p>
          <p>
            W katalogu: {lastStats.imagesInCatalog} zdjęć · {lastStats.videosInCatalog}{' '}
            nagrań WMV · {lastStats.noMediaInCatalog} bez pliku
          </p>
          {lastStats.verificationSkipped ? (
            <p>Arkusz weryfikacyjny w pliku — nieimportowany.</p>
          ) : null}
        </div>
      )}

      <section className="card stack">
        <h2 className="page-title-sm">Zdjęcia (opcjonalnie)</h2>
        <p className="muted">
          Archiwum „Multimedia do pytań” ma około {MEDIA_ZIP_SIZE_LABEL}. Import
          zapisuje tylko pliki JPG/JPEG na urządzeniu. Klipy WMV nadal wymagają
          osobnej obsługi w przeglądarce.
        </p>
        <a className="muted" href={OFFICIAL_MEDIA_ZIP_URL} target="_blank" rel="noreferrer">
          Link do archiwum na gov.pl
        </a>
        <label className="btn btn-secondary">
          Wskaż pobrany plik ZIP ze zdjęciami
          <input
            type="file"
            accept=".zip,application/zip"
            hidden
            disabled={busy}
            onChange={(e) => void handleMediaPick(e.target.files?.[0])}
          />
        </label>
        {mediaResult && (
          <p className="muted">
            Zapisano {mediaResult.stored} plików · pominięto {mediaResult.skipped}
          </p>
        )}
      </section>
    </div>
  )
}
