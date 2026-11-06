import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { MediaAvailabilityReason } from '../domain/types.ts'
import {
  findZipEntry,
  indexZipEntries,
  loadZipIndex,
  readZipEntry,
  ZipDirectoryUnreadableError,
  ZipEntryTruncatedError,
  type ZipEntryIndex,
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
}

const DB_NAME = 'prawo-jazdy-media-zip'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<MediaZipDb>> | null = null

const getHandleDb = (): Promise<IDBPDatabase<MediaZipDb>> => {
  if (!dbPromise) {
    dbPromise = openDB<MediaZipDb>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('handles')) {
          db.createObjectStore('handles')
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
class MediaZipLibrary {
  private file: File | null = null
  private index: ZipEntryIndex | null = null
  private readonly cache = new Map<string, Blob>()

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
    onProgress?.(
      `Archiwum podpięte (${this.entryCount} pozycji). Obraz wczyta się przy pytaniu.`,
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
}

export const mediaZipLibrary = new MediaZipLibrary()
