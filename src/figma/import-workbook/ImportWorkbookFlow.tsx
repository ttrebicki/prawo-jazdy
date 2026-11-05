import { useCallback, useState } from 'react'
import {
  OFFICIAL_WORKBOOK_URL,
  WORKBOOK_FILENAME,
} from '../../domain/constants.ts'
import { ImportWorkbookChoiceView } from './ImportWorkbookChoiceView.tsx'
import { ImportWorkbookResultView } from './ImportWorkbookResultView.tsx'
import './import-workbook.css'

export interface ImportWorkbookFlowProps {
  online: boolean
  onBack: () => void
  onImportWorkbook: (
    buffer: ArrayBuffer,
    meta: { filename: string; lastModified: string | null },
  ) => Promise<unknown>
  onContinueToMedia: () => void
  onGoToPractice: () => void
}

type ImportWorkbookStep = 'choice' | 'result'

export function ImportWorkbookFlow({
  online,
  onBack,
  onImportWorkbook,
  onContinueToMedia,
  onGoToPractice,
}: ImportWorkbookFlowProps) {
  const [step, setStep] = useState<ImportWorkbookStep>('choice')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runImport = useCallback(
    async (
      loadBuffer: () => Promise<{
        buffer: ArrayBuffer
        meta: { filename: string; lastModified: string | null }
      }>,
      statusMessage: string,
    ) => {
      setBusy(true)
      setError(null)
      setStatus(statusMessage)
      try {
        const { buffer, meta } = await loadBuffer()
        await onImportWorkbook(buffer, meta)
        setStep('result')
        setStatus(null)
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : 'Import nie powiódł się. Spróbuj ponownie lub wskaż inny plik.',
        )
        setStatus(null)
      } finally {
        setBusy(false)
      }
    },
    [onImportWorkbook],
  )

  const handleDownloadOfficial = useCallback(() => {
    if (!online) {
      setError('Brak sieci. Wskaż plik Excel zapisany na urządzeniu.')
      return
    }
    void runImport(async () => {
      const response = await fetch(OFFICIAL_WORKBOOK_URL)
      if (!response.ok) {
        throw new Error(`Serwer zwrócił ${response.status}`)
      }
      return {
        buffer: await response.arrayBuffer(),
        meta: {
          filename: WORKBOOK_FILENAME,
          lastModified: response.headers.get('Last-Modified'),
        },
      }
    }, 'Pobieranie oficjalnego katalogu z gov.pl…')
  }, [online, runImport])

  const handlePickFile = useCallback(
    (file: File) => {
      void runImport(async () => ({
        buffer: await file.arrayBuffer(),
        meta: { filename: file.name, lastModified: null },
      }), 'Wczytywanie wskazanego pliku…')
    },
    [runImport],
  )

  const handleBackFromResult = useCallback(() => {
    setStep('choice')
    setError(null)
    setStatus(null)
  }, [])

  if (step === 'result') {
    return (
      <ImportWorkbookResultView
        busy={busy}
        onBack={handleBackFromResult}
        onContinueToMedia={onContinueToMedia}
        onGoToPractice={onGoToPractice}
      />
    )
  }

  return (
    <ImportWorkbookChoiceView
      online={online}
      busy={busy}
      error={error}
      status={status}
      onBack={onBack}
      onDownloadOfficial={handleDownloadOfficial}
      onPickFile={handlePickFile}
    />
  )
}
