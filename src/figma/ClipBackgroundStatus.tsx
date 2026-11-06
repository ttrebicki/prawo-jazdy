import { useEffect, useState } from 'react'
import { clipBatchLabel, type ClipBatchStatus } from '../storage/clip-progress.ts'
import { mediaZipLibrary } from '../storage/media-zip-library.ts'

const EMPTY_BATCH: ClipBatchStatus = { done: 0, failed: 0, total: 0 }

/** A small line while WMV clips convert. It does not block navigation. */
export function ClipBackgroundStatus() {
  const [status, setStatus] = useState<ClipBatchStatus>(EMPTY_BATCH)

  useEffect(() => mediaZipLibrary.subscribeClipBatch(setStatus), [])

  const label = clipBatchLabel(status)
  if (!label) {
    return null
  }

  return (
    <p className="clip-bg-status" aria-live="polite">
      {label}
    </p>
  )
}
