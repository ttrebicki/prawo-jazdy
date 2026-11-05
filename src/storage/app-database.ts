import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type {
  CatalogMeta,
  QuestionProgress,
  QuestionRecord,
} from '../domain/types.ts'

interface StoredProgress extends QuestionProgress {
  id: string
}

interface StudyDb extends DBSchema {
  catalog: {
    key: string
    value: {
      id: 'current'
      meta: CatalogMeta
      questions: QuestionRecord[]
    }
  }
  progress: {
    key: string
    value: StoredProgress
    indexes: { byCategory: QuestionProgress['category'] }
  }
  media: {
    key: string
    value: { filename: string; blob: Blob; updatedAt: string }
  }
}

const DB_NAME = 'prawo-jazdy-study'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<StudyDb>> | null = null

export function getDb(): Promise<IDBPDatabase<StudyDb>> {
  if (!dbPromise) {
    dbPromise = openDB<StudyDb>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('catalog')) {
          db.createObjectStore('catalog')
        }
        if (!db.objectStoreNames.contains('progress')) {
          const store = db.createObjectStore('progress', { keyPath: 'id' })
          store.createIndex('byCategory', 'category')
        }
        if (!db.objectStoreNames.contains('media')) {
          db.createObjectStore('media', { keyPath: 'filename' })
        }
      },
    })
  }
  return dbPromise
}

function progressId(
  number: string,
  category: QuestionProgress['category'],
): string {
  return `${category}:${number}`
}

export async function saveCatalog(
  meta: CatalogMeta,
  questions: QuestionRecord[],
): Promise<void> {
  const db = await getDb()
  await db.put('catalog', { id: 'current', meta, questions }, 'current')
}

export async function loadCatalog(): Promise<{
  meta: CatalogMeta
  questions: QuestionRecord[]
} | null> {
  const db = await getDb()
  const row = await db.get('catalog', 'current')
  if (!row) {
    return null
  }
  return { meta: row.meta, questions: row.questions }
}

export async function deleteProgressEntry(
  number: string,
  category: QuestionProgress['category'],
): Promise<void> {
  const db = await getDb()
  await db.delete('progress', progressId(number, category))
}

export async function saveProgressEntry(entry: QuestionProgress): Promise<void> {
  const db = await getDb()
  await db.put('progress', {
    ...entry,
    id: progressId(entry.number, entry.category),
  })
}

export async function loadProgress(): Promise<QuestionProgress[]> {
  const db = await getDb()
  const rows = await db.getAll('progress')
  return rows.map(({ id: _id, ...rest }) => rest)
}

export async function putMediaFile(filename: string, blob: Blob): Promise<void> {
  const db = await getDb()
  await db.put('media', {
    filename,
    blob,
    updatedAt: new Date().toISOString(),
  })
}

export async function getMediaFile(filename: string): Promise<Blob | null> {
  const db = await getDb()
  const row = await db.get('media', filename)
  return row?.blob ?? null
}

export async function hasMediaFile(filename: string): Promise<boolean> {
  const blob = await getMediaFile(filename)
  return blob !== null
}

export async function countMediaFiles(): Promise<number> {
  const db = await getDb()
  return db.count('media')
}

export async function importZipImagesFromFile(
  file: File,
  onProgress?: (processed: number) => void,
): Promise<{ stored: number; skipped: number }> {
  const { unzip } = await import('fflate')
  const buffer = await file.arrayBuffer()
  let stored = 0
  let skipped = 0
  let processed = 0

  await new Promise<void>((resolve, reject) => {
    unzip(new Uint8Array(buffer), async (err, data) => {
      if (err) {
        reject(err)
        return
      }
      for (const [path, bytes] of Object.entries(data)) {
        processed += 1
        onProgress?.(processed)
        const base = path.split('/').pop() ?? path
        const lower = base.toLowerCase()
        if (!lower.endsWith('.jpg') && !lower.endsWith('.jpeg')) {
          skipped += 1
          continue
        }
        const blob = new Blob([bytes], { type: 'image/jpeg' })
        await putMediaFile(base, blob)
        stored += 1
      }
      resolve()
    })
  })

  return { stored, skipped }
}
