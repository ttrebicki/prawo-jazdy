import { useState } from 'react'
import { MEDIA_ZIP_SIZE_LABEL } from '../../domain/constants.ts'
import { buildMediaImportResultViewModel } from './build-result-view-model.ts'
import { MediaImportBeforeScreen } from './MediaImportBeforeScreen.tsx'
import { MediaImportResultScreen } from './MediaImportResultScreen.tsx'
import { MediaImportShell } from './MediaImportShell.tsx'
import type { MediaImportProgressUpdate } from './run-media-import-save.ts'
import type {
  MediaImportResultViewModel,
  MediaImportSavePayload,
  MediaImportSaveResult,
} from './types.ts'
import './import-media.css'

export interface ImportMediaFlowProps {
  online: boolean
  archiveSizeLabel?: string
  onBack: () => void
  onSkipPractice: () => void
  onStartPractice: () => void
  onBackToStart: () => void
  onSave: (
    payload: MediaImportSavePayload,
    onProgress?: (update: MediaImportProgressUpdate) => void,
  ) => Promise<MediaImportSaveResult>
  onError?: (message: string | null) => void
}

export function ImportMediaFlow({
  online,
  archiveSizeLabel = MEDIA_ZIP_SIZE_LABEL,
  onBack,
  onSkipPractice,
  onStartPractice,
  onBackToStart,
  onSave,
  onError,
}: ImportMediaFlowProps) {
  const [phase, setPhase] = useState<'before' | 'result'>('before')
  const [busy, setBusy] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [progressPercent, setProgressPercent] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<MediaImportResultViewModel | null>(null)

  const reportError = (message: string | null) => {
    setError(message)
    onError?.(message)
  }

  const handleSave = async () => {
    setBusy(true)
    reportError(null)
    setProgressPercent(0)
    setStatusMessage(`Pobieranie archiwum (${archiveSizeLabel})…`)
    try {
      const payload: MediaImportSavePayload = { kind: 'download' }
      await onSave(payload, (update) => {
        setStatusMessage(update.message)
        setProgressPercent(
          update.percent === undefined ? null : update.percent,
        )
      })
      const viewModel = buildMediaImportResultViewModel()
      setResult(viewModel)
      setPhase('result')
      setStatusMessage(null)
      setProgressPercent(null)
    } catch (e) {
      reportError(
        e instanceof Error
          ? e.message
          : 'Import multimediów nie powiódł się. Poprzednie pliki pozostają.',
      )
      setStatusMessage(null)
      setProgressPercent(null)
    } finally {
      setBusy(false)
    }
  }

  const handleBeginDownload = () => {
    if (busy) {
      return
    }
    if (!online) {
      reportError('Brak sieci. Pobieranie archiwum wymaga połączenia.')
      return
    }
    void handleSave()
  }

  return (
    <MediaImportShell onBack={onBack}>
      {phase === 'before' && (
        <MediaImportBeforeScreen
          busy={busy}
          online={online}
          statusMessage={statusMessage}
          progressPercent={progressPercent}
          error={error}
          onBeginDownload={handleBeginDownload}
          onSkip={onSkipPractice}
        />
      )}
      {phase === 'result' && result && (
        <MediaImportResultScreen
          onStartPractice={onStartPractice}
          onBackToStart={onBackToStart}
        />
      )}
    </MediaImportShell>
  )
}

export type { MediaImportSavePayload, MediaImportSaveResult, MediaImportResultViewModel }
