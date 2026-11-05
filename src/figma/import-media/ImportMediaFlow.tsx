import { useState } from 'react'
import { MEDIA_ZIP_SIZE_LABEL } from '../../domain/constants.ts'
import {
  emptyMediaImportDraft,
  isMediaImportSaveEnabled,
  type MediaImportDraft,
} from '../../ui/media-import/can-save-media-import.ts'
import { buildMediaImportResultViewModel } from './build-result-view-model.ts'
import { MediaImportBeforeScreen } from './MediaImportBeforeScreen.tsx'
import { MediaImportResultScreen } from './MediaImportResultScreen.tsx'
import { MediaImportShell } from './MediaImportShell.tsx'
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
  onSave: (payload: MediaImportSavePayload) => Promise<MediaImportSaveResult>
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
  const [draft, setDraft] = useState<MediaImportDraft>(emptyMediaImportDraft)
  const [busy, setBusy] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [result, setResult] = useState<MediaImportResultViewModel | null>(null)

  const reportError = (message: string | null) => {
    onError?.(message)
  }

  const handleSave = async () => {
    if (!isMediaImportSaveEnabled(draft, busy)) {
      return
    }
    setBusy(true)
    reportError(null)
    setStatusMessage(`Pobieranie archiwum (${archiveSizeLabel}) i import zdjęć…`)
    try {
      const payload: MediaImportSavePayload = { kind: 'download' }
      await onSave(payload)
      const viewModel = buildMediaImportResultViewModel()
      setResult(viewModel)
      setPhase('result')
      setDraft(emptyMediaImportDraft())
      setStatusMessage(null)
    } catch (e) {
      reportError(
        e instanceof Error
          ? e.message
          : 'Import multimediów nie powiódł się. Poprzednie pliki pozostają.',
      )
      setStatusMessage(null)
    } finally {
      setBusy(false)
    }
  }

  const handleBeginDownload = () => {
    if (busy || !online) {
      if (!online) {
        reportError('Brak sieci. Pobieranie archiwum wymaga połączenia.')
      }
      return
    }

    if (!isMediaImportSaveEnabled(draft, false)) {
      setDraft({
        action: 'download',
        pendingFile: null,
        isDownloadConfirmed: true,
      })
      reportError(null)
      setStatusMessage(
        `Potwierdzono pobieranie (${archiveSizeLabel}). Naciśnij ponownie „Rozpocznij pobieranie”, aby rozpocząć transfer.`,
      )
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
