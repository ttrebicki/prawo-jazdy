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

const MEDIA_DOWNLOAD_CONFIRM_MESSAGE = `Archiwum „Multimedia do pytań” ma około ${MEDIA_ZIP_SIZE_LABEL}. Import zapisuje tylko zdjęcia JPG/JPEG pasujące do katalogu. Pobieranie z gov.pl rozpocznie się dopiero po naciśnięciu „Zapisz multimedia”. Czy wybrać pobieranie z gov.pl?`

export interface ImportMediaFlowProps {
  online: boolean
  archiveSizeLabel?: string
  catalogDateLabel: string
  questionsBWithoutMedia: number
  /** Called after a successful import; defaults to `questionsBWithoutMedia`. */
  resolveQuestionsBWithoutMedia?: () => number
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
  catalogDateLabel,
  questionsBWithoutMedia,
  resolveQuestionsBWithoutMedia,
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

  const saveEnabled = isMediaImportSaveEnabled(draft, busy)

  const reportError = (message: string | null) => {
    onError?.(message)
  }

  const handleConfirmDownload = () => {
    if (!online) {
      reportError(
        'Brak sieci. Pobieranie archiwum wymaga połączenia — wskaż plik ZIP z pamięci urządzenia.',
      )
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
    reportError(null)
    setStatusMessage(
      `Wybrano pobieranie z gov.pl (${archiveSizeLabel}). Naciśnij „Zapisz multimedia”, aby rozpocząć transfer.`,
    )
  }

  const handlePickZip = (file: File) => {
    setDraft({
      action: 'pick',
      pendingFile: file,
      isDownloadConfirmed: false,
    })
    reportError(null)
    setStatusMessage(
      `Wybrano plik: ${file.name}. Naciśnij „Zapisz multimedia”, aby rozpocząć import.`,
    )
  }

  const handleSave = async () => {
    if (!saveEnabled) {
      return
    }
    setBusy(true)
    reportError(null)
    setStatusMessage(
      draft.action === 'download'
        ? `Pobieranie archiwum (${archiveSizeLabel}) i import zdjęć…`
        : 'Import zdjęć z archiwum (tylko JPG/JPEG)…',
    )
    try {
      const payload: MediaImportSavePayload =
        draft.pendingFile !== null
          ? { kind: 'file', file: draft.pendingFile }
          : { kind: 'download' }
      const importResult = await onSave(payload)
      const missingCount =
        resolveQuestionsBWithoutMedia?.() ?? questionsBWithoutMedia
      const viewModel = buildMediaImportResultViewModel(
        importResult,
        missingCount,
        catalogDateLabel,
      )
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

  return (
    <MediaImportShell onBack={onBack}>
      {phase === 'before' && (
        <MediaImportBeforeScreen
          archiveSizeLabel={archiveSizeLabel}
          saveEnabled={saveEnabled}
          busy={busy}
          online={online}
          statusMessage={statusMessage}
          onConfirmDownload={handleConfirmDownload}
          onSave={() => void handleSave()}
          onPickZip={handlePickZip}
          onSkip={onSkipPractice}
        />
      )}
      {phase === 'result' && result && (
        <MediaImportResultScreen
          result={result}
          onStartPractice={onStartPractice}
          onBackToStart={onBackToStart}
        />
      )}
    </MediaImportShell>
  )
}

export type { MediaImportSavePayload, MediaImportSaveResult, MediaImportResultViewModel }
