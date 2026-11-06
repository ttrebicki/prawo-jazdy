import { useRef, useState } from 'react'
import { useFigmaLayoutOptional } from '../layout/FigmaLayoutContext.tsx'
import { getShowOpenFilePicker } from '../../storage/media-zip-library.ts'
import { ZipDirectoryUnreadableError } from '../../storage/zip-directory.ts'
import { MediaImportWideResultScreen } from './MediaImportWideResultScreen.tsx'
import { MediaImportBeforeScreen } from './MediaImportBeforeScreen.tsx'
import { MediaImportWideBeforeScreen } from './MediaImportWideBeforeScreen.tsx'
import { MediaImportResultScreen } from './MediaImportResultScreen.tsx'
import { MediaImportShell } from './MediaImportShell.tsx'
import {
  isMediaZipFile,
  mediaZipValidationError,
  OFFICIAL_MEDIA_ZIP_URL,
} from './media-zip-file.ts'
import type { MediaImportProgressUpdate } from './run-media-import-save.ts'
import type { MediaImportSavePayload, MediaImportSaveResult } from './types.ts'
import './import-media.css'

export interface ImportMediaFlowProps {
  online: boolean
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
  onBack,
  onSkipPractice,
  onStartPractice,
  onBackToStart,
  onSave,
  onError,
}: ImportMediaFlowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [phase, setPhase] = useState<'before' | 'result'>('before')
  const [busy, setBusy] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [officialUrlHint, setOfficialUrlHint] = useState(false)
  const [linked, setLinked] = useState<{ fileName: string; entryCount: number } | null>(null)

  const reportError = (message: string | null, showOfficialUrl = false) => {
    setError(message)
    setOfficialUrlHint(showOfficialUrl)
    onError?.(message)
  }

  const linkZipFile = async (file: File, handle: FileSystemFileHandle | null) => {
    setBusy(true)
    reportError(null)
    setStatusMessage(`Podpinam archiwum: ${file.name}`)
    try {
      const saved = await onSave({ kind: 'file', file, handle }, (update) => {
        setStatusMessage(update.message)
      })
      setLinked({ fileName: saved.linkedName, entryCount: saved.entryCount })
      setPhase('result')
      setStatusMessage(null)
    } catch (e) {
      const incomplete = e instanceof ZipDirectoryUnreadableError
      reportError(
        incomplete
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Nie udało się podpiąć archiwum. Pytania bez obrazu dalej działają.',
        incomplete,
      )
      setStatusMessage(null)
    } finally {
      setBusy(false)
    }
  }

  const handleBrowserDownload = () => {
    if (busy) {
      return
    }
    if (!online) {
      reportError('Brak sieci. Pobieranie archiwum wymaga połączenia.')
      return
    }
    reportError(null)
    setStatusMessage(
      'Pobieranie uruchamia przeglądarka (Chrome / system). Gdy plik będzie na dysku, wskaż go poniżej.',
    )
    const anchor = document.createElement('a')
    anchor.href = OFFICIAL_MEDIA_ZIP_URL
    anchor.rel = 'noopener noreferrer'
    anchor.download = 'multimedia_do_pytan.zip'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }

  const handlePickFile = (file: File | undefined, handle: FileSystemFileHandle | null) => {
    if (!file || busy) {
      return
    }
    if (!isMediaZipFile(file)) {
      reportError(mediaZipValidationError(file.name), true)
      setStatusMessage(null)
      return
    }
    void linkZipFile(file, handle)
  }

  const openFilePicker = () => {
    if (busy) {
      return
    }
    const picker = getShowOpenFilePicker()
    if (!picker) {
      fileInputRef.current?.click()
      return
    }
    void picker({
      multiple: false,
      excludeAcceptAllOption: false,
      types: [
        {
          description: 'Archiwum ZIP',
          accept: { 'application/zip': ['.zip'] },
        },
      ],
    })
      .then(async ([handle]) => {
        if (!handle) {
          return
        }
        const file = await handle.getFile()
        handlePickFile(file, handle)
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        fileInputRef.current?.click()
      })
  }

  const layout = useFigmaLayoutOptional()
  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept=".zip,application/zip,application/x-zip-compressed"
      hidden
      onChange={(event) => {
        handlePickFile(event.target.files?.[0], null)
        event.target.value = ''
      }}
    />
  )

  const beforeProps = {
    busy,
    online,
    statusMessage,
    error,
    showOfficialUrlHint: officialUrlHint,
    onBrowserDownload: handleBrowserDownload,
    onPickFile: openFilePicker,
    onSkip: onSkipPractice,
  }

  if (layout?.isWide) {
    return (
      <>
        {fileInput}
        {phase === 'before' && <MediaImportWideBeforeScreen {...beforeProps} />}
        {phase === 'result' && linked && (
          <MediaImportWideResultScreen
            fileName={linked.fileName}
            entryCount={linked.entryCount}
            onStartPractice={onStartPractice}
            onBackToStart={onBackToStart}
          />
        )}
      </>
    )
  }

  return (
    <MediaImportShell onBack={onBack}>
      {fileInput}
      {phase === 'before' && <MediaImportBeforeScreen {...beforeProps} />}
      {phase === 'result' && linked && (
        <MediaImportResultScreen
          fileName={linked.fileName}
          entryCount={linked.entryCount}
          onStartPractice={onStartPractice}
          onBackToStart={onBackToStart}
        />
      )}
    </MediaImportShell>
  )
}

export type {
  MediaImportSavePayload,
  MediaImportSaveResult,
  MediaImportResultViewModel,
} from './types.ts'
