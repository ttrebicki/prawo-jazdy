import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { MediaAvailabilityReason } from '../domain/types.ts'
import {
  isVideoZipName,
  prioritizeIds,
  type ClipBatchStatus,
  type ClipLoadProgress,
} from './clip-progress.ts'
import {
  findZipEntry,
  indexZipEntries,
  loadZipIndex,
  readZipEntry,
  ZipDirectoryUnreadableError,
  ZipEntryTruncatedError,
  type ZipEntryIndex,
  type ZipEntryMeta,
} from './zip-directory.ts'

type ShowOpenFilePicker = (options?: {
  multiple?: boolean
  excludeAcceptAllOption?: boolean
  types?: { description?: string; accept: Record<string, string[]> }[]
}) => Promise<FileSystemFileHandle[]>

interface MediaZipDb extends DBSchema {
  handles: {
    key: string
    value: {
      id: 'current'
      name: string
      handle: FileSystemFileHandle
    }
  }
  clips: {
    key: string
    value: { id: string; blob: Blob }
  }
}

const DB_NAME = 'prawo-jazdy-media-zip'
const DB_VERSION = 2

let dbPromise: Promise<IDBPDatabase<MediaZipDb>> | null = null

const getHandleDb = (): Promise<IDBPDatabase<MediaZipDb>> => {
  if (!dbPromise) {
    dbPromise = openDB<MediaZipDb>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('handles')) {
          db.createObjectStore('handles')
        }
        if (!db.objectStoreNames.contains('clips')) {
          db.createObjectStore('clips')
        }
      },
    })
  }
  return dbPromise
}

type FileHandleWithPermission = FileSystemFileHandle & {
  queryPermission?: (descriptor: { mode: 'read' }) => Promise<PermissionState>
  requestPermission?: (descriptor: { mode: 'read' }) => Promise<PermissionState>
}

export function getShowOpenFilePicker(): ShowOpenFilePicker | null {
  if (typeof window === 'undefined' || !('showOpenFilePicker' in window)) {
    return null
  }
  const picker = window.showOpenFilePicker as ShowOpenFilePicker
  return picker.bind(window)
}

const permissionOf = async (
  handle: FileSystemFileHandle,
  request: boolean,
): Promise<PermissionState> => {
  const permitted = handle as FileHandleWithPermission
  const descriptor = { mode: 'read' as const }
  if (request && permitted.requestPermission) {
    return permitted.requestPermission(descriptor)
  }
  if (permitted.queryPermission) {
    return permitted.queryPermission(descriptor)
  }
  return 'granted'
}

export type QuestionImageRead = {
  blob: Blob | null
  reason: MediaAvailabilityReason
}

/**
 * Remembers the user-chosen ZIP. The File System Access handle is stored so a
 * later visit can reopen the same desktop file. The fallback keeps the File
 * object in memory and does not copy the archive into IndexedDB.
 */
const clipCacheId = (file: File, entryName: string, compressedSize: number): string =>
  `${file.name}:${file.size}:${file.lastModified}:${entryName}:${compressedSize}`

type ClipJob = {
  id: string
  entry: ZipEntryMeta
  status: 'queued' | 'running' | 'done' | 'failed'
  result: QuestionImageRead | null
  listeners: Set<(progress: ClipLoadProgress) => void>
  waiters: Array<(result: QuestionImageRead) => void>
}

class MediaZipLibrary {
  private file: File | null = null
  private index: ZipEntryIndex | null = null
  private readonly cache = new Map<string, Blob>()
  private readonly clipCache = new Map<string, Blob>()
  private jobs = new Map<string, ClipJob>()
  private order: string[] = []
  private generation = 0
  private pumping = false
  private doneCount = 0
  private failedCount = 0
  private totalCount = 0
  private currentRatio = 0
  private readonly batchListeners = new Set<(status: ClipBatchStatus) => void>()

  get fileName(): string | null {
    return this.file?.name ?? null
  }

  get entryCount(): number {
    return this.index?.byPath.size ?? 0
  }

  hasImage(filename: string): boolean {
    if (!this.index) {
      return false
    }
    return findZipEntry(this.index, filename) !== null
  }

  private async indexFile(
    file: File,
    onProgress?: (message: string) => void,
  ): Promise<void> {
    onProgress?.('Czytam spis archiwum… 0%. Zdjęcia zostają w pliku ZIP.')
    const entries = await loadZipIndex(file, (loaded, total) => {
      const percent = total > 0 ? Math.min(100, Math.floor((loaded / total) * 100)) : 0
      onProgress?.(
        `Czytam spis archiwum… ${percent}%. Zdjęcia zostają w pliku ZIP.`,
      )
    })
    this.file = file
    this.index = indexZipEntries(entries)
    this.cache.clear()
    this.beginClipQueue()
    onProgress?.(
      `Archiwum podpięte (${this.entryCount} pozycji). Klipy konwertują się w tle.`,
    )
  }

  async attach(
    file: File,
    handle: FileSystemFileHandle | null,
    onProgress?: (message: string) => void,
  ): Promise<void> {
    await this.indexFile(file, onProgress)
    const db = await getHandleDb()
    if (handle) {
      await db.put('handles', { id: 'current', name: file.name, handle }, 'current')
      return
    }
    // Input-element fallback: keep the File in memory only.
    await db.delete('handles', 'current')
  }

  /** Reopens a previously granted handle. Reads the central directory, not images. */
  async restoreSaved(requestPermission: boolean): Promise<boolean> {
    const db = await getHandleDb()
    const saved = await db.get('handles', 'current')
    if (!saved) {
      return false
    }
    const permission = await permissionOf(saved.handle, requestPermission)
    if (permission !== 'granted') {
      return false
    }
    const file = await saved.handle.getFile()
    await this.indexFile(file)
    return this.file !== null
  }

  async readQuestionImage(
    filename: string,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<QuestionImageRead> {
    if (!this.file || !this.index) {
      return { blob: null, reason: 'not_attached' }
    }
    const entry = findZipEntry(this.index, filename)
    if (!entry) {
      return { blob: null, reason: 'missing_file' }
    }
    const cacheKey = entry.name.toLowerCase()
    const cached = this.cache.get(cacheKey)
    if (cached) {
      onProgress?.(cached.size, cached.size)
      return { blob: cached, reason: 'available' }
    }
    try {
      const bytes = await readZipEntry(this.file, entry, onProgress)
      const blob = new Blob([bytes.slice()], { type: 'image/jpeg' })
      this.cache.set(cacheKey, blob)
      if (this.cache.size > 12) {
        const oldest = this.cache.keys().next().value
        if (oldest) {
          this.cache.delete(oldest)
        }
      }
      return { blob, reason: 'available' }
    } catch (error) {
      if (error instanceof ZipEntryTruncatedError || error instanceof ZipDirectoryUnreadableError) {
        return { blob: null, reason: 'truncated' }
      }
      return { blob: null, reason: 'truncated' }
    }
  }

  private async storedClip(id: string): Promise<Blob | null> {
    const memory = this.clipCache.get(id)
    if (memory) {
      return memory
    }
    const db = await getHandleDb()
    const row = await db.get('clips', id)
    if (!row?.blob) {
      return null
    }
    this.clipCache.set(id, row.blob)
    return row.blob
  }

  private async rememberClip(id: string, blob: Blob): Promise<void> {
    this.clipCache.set(id, blob)
    const db = await getHandleDb()
    await db.put('clips', { id, blob }, id)
  }

  /** Puts practice clips ahead of the rest of the zip. Does not start a second converter. */
  prioritizeFilenames(filenames: readonly string[]): void {
    if (!this.file || !this.index || filenames.length === 0) {
      return
    }
    const preferred: string[] = []
    for (const name of filenames) {
      const entry = findZipEntry(this.index, name)
      if (!entry || !isVideoZipName(entry.name)) {
        continue
      }
      const id = clipCacheId(this.file, entry.name, entry.compressedSize)
      const job = this.jobs.get(id)
      if (job?.status === 'queued') {
        preferred.push(id)
      }
    }
    if (preferred.length === 0) {
      return
    }
    this.order = prioritizeIds(this.order, preferred)
  }

  subscribeClipBatch(listener: (status: ClipBatchStatus) => void): () => void {
    this.batchListeners.add(listener)
    listener(this.batchStatus())
    return () => {
      this.batchListeners.delete(listener)
    }
  }

  /**
   * Returns a clip the background queue already converted, or waits until that
   * queue reaches it. Opening a question does not start a new conversion.
   */
  async readQuestionClip(
    filename: string,
    onProgress?: (progress: ClipLoadProgress) => void,
  ): Promise<QuestionImageRead> {
    if (!this.file || !this.index) {
      return { blob: null, reason: 'not_attached' }
    }
    const entry = findZipEntry(this.index, filename)
    if (!entry) {
      return { blob: null, reason: 'missing_file' }
    }
    const id = clipCacheId(this.file, entry.name, entry.compressedSize)
    const cached = await this.storedClip(id)
    if (cached) {
      return { blob: cached, reason: 'available' }
    }
    const job = this.jobs.get(id)
    if (!job) {
      return { blob: null, reason: 'missing_file' }
    }
    if (job.result) {
      return job.result
    }
    if (job.status === 'queued') {
      this.order = prioritizeIds(this.order, [id])
      onProgress?.({ phase: 'queued' })
    } else if (job.status === 'running') {
      onProgress?.({ phase: 'convert', ratio: this.currentRatio })
    }
    return new Promise((resolve) => {
      job.waiters.push(resolve)
      if (onProgress) {
        job.listeners.add(onProgress)
      }
    })
  }

  private batchStatus(): ClipBatchStatus {
    return {
      done: this.doneCount,
      failed: this.failedCount,
      total: this.totalCount,
    }
  }

  private emitBatch(): void {
    const status = this.batchStatus()
    for (const listener of this.batchListeners) {
      listener(status)
    }
  }

  private beginClipQueue(): void {
    this.generation += 1
    const generation = this.generation
    for (const job of this.jobs.values()) {
      if (job.result) {
        continue
      }
      const dropped = { blob: null, reason: 'not_attached' as const }
      for (const waiter of job.waiters) {
        waiter(dropped)
      }
    }
    this.jobs = new Map()
    this.order = []
    this.doneCount = 0
    this.failedCount = 0
    this.totalCount = 0
    this.currentRatio = 0
    const file = this.file
    const index = this.index
    if (!file || !index) {
      this.emitBatch()
      return
    }
    for (const entry of index.byPath.values()) {
      if (!isVideoZipName(entry.name)) {
        continue
      }
      const id = clipCacheId(file, entry.name, entry.compressedSize)
      if (this.jobs.has(id)) {
        continue
      }
      this.jobs.set(id, {
        id,
        entry,
        status: 'queued',
        result: null,
        listeners: new Set(),
        waiters: [],
      })
      this.order.push(id)
    }
    this.totalCount = this.order.length
    this.emitBatch()
    void this.pump(generation)
  }

  private finishJob(job: ClipJob, result: QuestionImageRead): void {
    job.status = result.blob ? 'done' : 'failed'
    job.result = result
    if (result.blob) {
      this.doneCount += 1
    } else {
      this.failedCount += 1
    }
    for (const waiter of job.waiters) {
      waiter(result)
    }
    job.waiters = []
    job.listeners.clear()
    this.emitBatch()
  }

  private async pump(generation: number): Promise<void> {
    if (this.pumping) {
      return
    }
    this.pumping = true
    try {
      while (generation === this.generation && this.order.length > 0) {
        const id = this.order.shift()
        const job = id ? this.jobs.get(id) : undefined
        const file = this.file
        if (!id || !job || job.status !== 'queued' || !file) {
          continue
        }
        const cached = await this.storedClip(id)
        if (generation !== this.generation) {
          return
        }
        if (cached) {
          this.finishJob(job, { blob: cached, reason: 'available' })
          continue
        }
        job.status = 'running'
        this.currentRatio = 0
        this.emitBatch()
        try {
          const wmv = await readZipEntry(file, job.entry, (loaded, total) => {
            this.currentRatio = total > 0 ? loaded / total : 0
            const progress: ClipLoadProgress = { phase: 'read', loaded, total }
            for (const listener of job.listeners) {
              listener(progress)
            }
          })
          if (generation !== this.generation) {
            return
          }
          const { convertWmvToMp4 } = await import('./wmv-to-mp4.ts')
          const mp4 = await convertWmvToMp4(wmv, (ratio) => {
            this.currentRatio = ratio
            const progress: ClipLoadProgress = { phase: 'convert', ratio }
            for (const listener of job.listeners) {
              listener(progress)
            }
          })
          if (generation !== this.generation) {
            return
          }
          await this.rememberClip(id, mp4)
          this.finishJob(job, { blob: mp4, reason: 'available' })
        } catch (error) {
          if (generation !== this.generation) {
            return
          }
          const reason =
            error instanceof ZipEntryTruncatedError || error instanceof ZipDirectoryUnreadableError
              ? 'truncated'
              : 'conversion_failed'
          this.finishJob(job, { blob: null, reason })
        }
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
    } finally {
      this.pumping = false
      this.emitBatch()
      if (generation !== this.generation && this.order.length > 0) {
        void this.pump(this.generation)
      }
    }
  }
}

export const mediaZipLibrary = new MediaZipLibrary()
