import { useRef, useState } from 'react'
import {
  MEDIA_ZIP_SIZE_LABEL,
  OFFICIAL_MEDIA_ZIP_URL,
  OFFICIAL_PAGE_URL,
  OFFICIAL_WORKBOOK_URL,
  WORKBOOK_FILENAME,
} from '../../domain/constants.ts'
import type { ImportStats } from '../../domain/types.ts'

interface ImportProps {
  online: boolean
  onBack: () => void
  onImportWorkbook: (
    buffer: ArrayBuffer,
    meta: { filename: string; lastModified: string | null },
  ) => Promise<ImportStats>
  onImportMediaZip: (file: File) => Promise<{ stored: number; skipped: number }>
}

const MEDIA_CONFIRM_MESSAGE = `Archiwum „Multimedia do pytań” ma około ${MEDIA_ZIP_SIZE_LABEL}. Import zapisuje tylko zdjęcia JPG/JPEG pasujące do katalogu. Klipy WMV nadal nie odtwarzają się w typowej przeglądarce mobilnej. Czy chcesz wskazać plik ZIP?`

const NOT_MINISTRY_LINE =
  'To nie jest aplikacja Ministerstwa Infrastruktury ani WORD.'

export function Import({
  online,
  onBack,
  onImportWorkbook,
  onImportMediaZip,
}: ImportProps) {
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [lastStats, setLastStats] = useState<ImportStats | null>(null)
  const [mediaResult, setMediaResult] = useState<{
    stored: number
    skipped: number
  } | null>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)

  const handleDownload = async () => {
    if (!online) {
      setError('Brak sieci. Wskaż plik Excel zapisany na urządzeniu.')
      return
    }
    setBusy(true)
    setError(null)
    setStatus('Pobieranie oficjalnego katalogu z gov.pl…')
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
          ? `${e.message} Możesz wskazać plik ręcznie — poprzednia baza zostaje, dopóki import się nie uda.`
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
      setError(
        e instanceof Error
          ? e.message
          : 'Plik odrzucony. Użyj oficjalnego katalogu z gov.pl.',
      )
      setStatus(null)
    } finally {
      setBusy(false)
    }
  }

  const openMediaPicker = () => {
    if (!window.confirm(MEDIA_CONFIRM_MESSAGE)) {
      return
    }
    mediaInputRef.current?.click()
  }

  const handleMediaPick = async (file: File | undefined) => {
    if (!file) {
      return
    }
    setBusy(true)
    setError(null)
    setStatus('Import zdjęć z archiwum (tylko JPG/JPEG)…')
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
    <div className="stack view-import">
      <button type="button" className="btn btn-ghost view-import__back" onClick={onBack}>
        ← Wróć
      </button>

      <header className="stack">
        <p className="eyebrow muted">{NOT_MINISTRY_LINE}</p>
        <h1 className="page-title">Katalog i multimedia</h1>
        <p className="muted">
          Źródło:{' '}
          <a href={OFFICIAL_PAGE_URL} target="_blank" rel="noreferrer">
            Ministerstwo Infrastruktury — prawo jazdy
          </a>
          . Arkusz „W trakcie weryfikacji” nie trafia do nauki.
        </p>
      </header>

      {!online && (
        <div className="banner banner-warning">
          Jesteś offline. Pobieranie z gov.pl wymaga sieci — wskaż kopię katalogu z
          pamięci urządzenia. Nauka z zapisaną bazą działa bez sieci.
        </div>
      )}

      {error && <div className="banner banner-error">{error}</div>}
      {status && <div className="banner banner-success">{status}</div>}

      <section className="card stack">
        <h2 className="page-title-sm">Katalog pytań</h2>
        <p className="muted">
          Główna ścieżka: pobierz oficjalny plik Excel na to urządzenie. Przy słabej
          sieci wskaż plik pobrany wcześniej.
        </p>
        <button
          type="button"
          className="btn"
          disabled={busy || !online}
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
      </section>

      {lastStats && (
        <section className="card stack import-report" aria-live="polite">
          <h2 className="page-title-sm">Raport importu katalogu</h2>
          <ul className="import-report__list muted">
            <li>
              Pytania na liście żywej: <strong>{lastStats.kept}</strong>
            </li>
            <li>
              Wiersze w arkuszu weryfikacyjnym (pominięte):{' '}
              <strong>{lastStats.verificationSkipped}</strong>
            </li>
            <li>
              Zdjęcia w katalogu: <strong>{lastStats.imagesInCatalog}</strong>
            </li>
            <li>
              Klipy WMV (nieodtwarzalne w tej przeglądarce):{' '}
              <strong>{lastStats.videosInCatalog}</strong>
            </li>
            <li>
              Pytania bez pliku multimedialnego:{' '}
              <strong>{lastStats.noMediaInCatalog}</strong>
            </li>
          </ul>
        </section>
      )}

      <section className="card stack">
        <h2 className="page-title-sm">Multimedia (osobna operacja)</h2>
        <p className="muted">
          Przed wyborem pliku zobaczysz potwierdzenie z rozmiarem archiwum (
          {MEDIA_ZIP_SIZE_LABEL}). Import zapisuje tylko JPG/JPEG na urządzeniu.
        </p>
        <a className="muted text-link" href={OFFICIAL_MEDIA_ZIP_URL} target="_blank" rel="noreferrer">
          Oficjalne archiwum na gov.pl
        </a>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy}
          onClick={openMediaPicker}
        >
          Wskaż pobrany plik ZIP ({MEDIA_ZIP_SIZE_LABEL})
        </button>
        <input
          ref={mediaInputRef}
          type="file"
          accept=".zip,application/zip"
          hidden
          disabled={busy}
          onChange={(e) => void handleMediaPick(e.target.files?.[0])}
        />
        {mediaResult && (
          <p className="muted">
            Zapisano <strong>{mediaResult.stored}</strong> plików · pominięto{' '}
            {mediaResult.skipped}
          </p>
        )}
      </section>
    </div>
  )
}
