import { Unzip, UnzipInflate } from 'fflate'
import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type {
  CatalogMeta,
  CategoryCode,
  QuestionProgress,
  QuestionRecord,
} from '../domain/types.ts'

/** Mirrors `StudySession` in progress-store (kept here to avoid import cycles). */
export interface StoredStudySession {
  id: number
  kind: 'practice' | 'exam'
  category: CategoryCode
  questionNumbers: string[]
  answers: {
    number: string
    userAnswer: 'T' | 'N' | 'A' | 'B' | 'C'
    correct: boolean
  }[]
  score: number | null
  passed: boolean | null
  startedAt: string
  finishedAt: string | null
}

interface StoredProgress extends QuestionProgress {
  id: string
}

interface MediaGapRow {
  filename: string
  recordedAt: string
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
  mediaGaps: {
    key: string
    value: MediaGapRow
  }
  sessions: {
    key: number
    value: StoredStudySession
  }
}

const DB_NAME = 'prawo-jazdy-study'
const DB_VERSION = 2

let dbPromise: Promise<IDBPDatabase<StudyDb>> | null = null

export function getDb(): Promise<IDBPDatabase<StudyDb>> {
  if (!dbPromise) {
    dbPromise = openDB<StudyDb>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
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
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains('mediaGaps')) {
            db.createObjectStore('mediaGaps', { keyPath: 'filename' })
          }
          if (!db.objectStoreNames.contains('sessions')) {
            db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true })
          }
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

export async function putMediaGap(filename: string): Promise<void> {
  const db = await getDb()
  await db.put('mediaGaps', {
    filename,
    recordedAt: new Date().toISOString(),
  })
}

export async function hasMediaGap(filename: string): Promise<boolean> {
  const db = await getDb()
  const row = await db.get('mediaGaps', filename)
  return row !== undefined
}

export async function saveSession(
  session: StoredStudySession,
): Promise<StoredStudySession> {
  const db = await getDb()
  if (session.id === 0) {
    const id = Number(
      await db.add('sessions', {
        kind: session.kind,
        category: session.category,
        questionNumbers: session.questionNumbers,
        answers: session.answers,
        score: session.score,
        passed: session.passed,
        startedAt: session.startedAt,
        finishedAt: session.finishedAt,
        id: undefined as unknown as number,
      }),
    )
    return { ...session, id }
  }
  await db.put('sessions', session)
  return session
}

export async function loadSessions(): Promise<StoredStudySession[]> {
  const db = await getDb()
  return db.getAll('sessions')
}

const concatBytes = (chunks: Uint8Array[]): Uint8Array => {
  const total = chunks.reduce((sum, part) => sum + part.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const part of chunks) {
    out.set(part, offset)
    offset += part.length
  }
  return out
}

const drainZipEntry = (file: Parameters<NonNullable<Unzip['onfile']>>[0]): Promise<void> =>
  new Promise((resolve, reject) => {
    file.ondata = (err, _data, final) => {
      if (err) {
        reject(err)
        return
      }
      if (final) {
        resolve()
      }
    }
    file.start()
  })

/** Streams zip members; never loads the whole archive into one in-memory blob. */
export async function importZipImagesFromFile(
  file: File,
  onProgress?: (processed: number) => void,
): Promise<{ stored: number; skipped: number; wmvGaps: number }> {
  const unzip = new Unzip()
  unzip.register(UnzipInflate)

  let stored = 0
  let skipped = 0
  let wmvGaps = 0
  let processed = 0
  const pending: Promise<void>[] = []

  unzip.onfile = (entry) => {
    const base = entry.name.split('/').pop() ?? entry.name
    const lower = base.toLowerCase()

    if (lower.endsWith('.wmv')) {
      pending.push(
        drainZipEntry(entry).then(async () => {
          processed += 1
          onProgress?.(processed)
          await putMediaGap(base)
          wmvGaps += 1
        }),
      )
      return
    }

    if (!lower.endsWith('.jpg') && !lower.endsWith('.jpeg')) {
      pending.push(
        drainZipEntry(entry).then(() => {
          processed += 1
          onProgress?.(processed)
          skipped += 1
        }),
      )
      return
    }

    pending.push(
      new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = []
        entry.ondata = (err, data, final) => {
          if (err) {
            reject(err)
            return
          }
          if (data) {
            chunks.push(data)
          }
          if (final) {
            processed += 1
            onProgress?.(processed)
            const bytes = concatBytes(chunks)
            putMediaFile(base, new Blob([bytes.slice()], { type: 'image/jpeg' }))
              .then(() => {
                stored += 1
                resolve()
              })
              .catch(reject)
          }
        }
        entry.start()
      }),
    )
  }

  const reader = file.stream().getReader()
  while (true) {
    const { done, value } = await reader.read()
    unzip.push(value ?? new Uint8Array(0), done)
    if (done) {
      break
    }
  }

  await Promise.all(pending)
  return { stored, skipped, wmvGaps }
}
