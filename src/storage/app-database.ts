import { Unzip, UnzipInflate } from 'fflate'
import {
  IncompleteMediaZipError,
  type ZipReadProgress,
  normalizeZipReadError,
  pushZipChunk,
} from './zip-read.ts'
import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type {
  CatalogMeta,
  CategoryCode,
  QuestionExplanation,
  QuestionProgress,
  QuestionRecord,
} from '../domain/types.ts'
import { normalizeExplanationText } from './explanation-text.ts'

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
  explanations: {
    key: string
    value: {
      officialNumber: string
      text: string
      updatedAt: string
    }
  }
}

const DB_NAME = 'prawo-jazdy-study'
const DB_VERSION = 3

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
        if (oldVersion < 3 && !db.objectStoreNames.contains('explanations')) {
          db.createObjectStore('explanations', { keyPath: 'officialNumber' })
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

export async function saveQuestionExplanation(
  explanation: QuestionExplanation,
): Promise<void> {
  const text = normalizeExplanationText(explanation.text)
  if (!text) {
    return
  }
  const db = await getDb()
  await db.put('explanations', {
    officialNumber: explanation.officialNumber,
    text,
    updatedAt: new Date().toISOString(),
  })
}

export async function getQuestionExplanation(
  officialNumber: string,
): Promise<string | null> {
  const db = await getDb()
  const row = await db.get('explanations', officialNumber)
  if (!row?.text?.trim()) {
    return null
  }
  return row.text.trim()
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

const drainZipEntry = (
  file: Parameters<NonNullable<Unzip['onfile']>>[0],
  noteFailure: (error: unknown) => void,
): Promise<void> =>
  new Promise((resolve, reject) => {
    file.ondata = (err, _data, final) => {
      if (err) {
        const normalized = normalizeZipReadError(err)
        noteFailure(normalized)
        reject(normalized)
        return
      }
      if (final) {
        resolve()
      }
    }
    try {
      file.start()
    } catch (error) {
      const normalized = normalizeZipReadError(error)
      noteFailure(normalized)
      reject(normalized)
    }
  })

/** Streams zip members; never loads the whole archive into one in-memory blob. */
const importZipImagesFromStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onProgress: ((progress: ZipReadProgress) => void) | undefined,
  totalBytes: number | null,
): Promise<{ stored: number; skipped: number; wmvGaps: number }> => {
  const unzip = new Unzip()
  unzip.register(UnzipInflate)

  let stored = 0
  let skipped = 0
  let wmvGaps = 0
  let processed = 0
  let bytesRead = 0
  let readError: Error | null = null
  let lastEmit = 0
  const pending: Promise<void>[] = []

  const noteFailure = (error: unknown) => {
    if (!readError) {
      readError = normalizeZipReadError(error)
    }
  }

  const emit = (force = false): boolean => {
    const now = Date.now()
    if (!force && now - lastEmit < 250) {
      return false
    }
    lastEmit = now
    onProgress?.({
      bytesRead,
      totalBytes,
      filesProcessed: processed,
      stored,
    })
    return true
  }

  // Paint 0% before the first chunk is inflated.
  emit(true)
  await new Promise((resolve) => setTimeout(resolve, 0))

  unzip.onfile = (entry) => {
    const base = entry.name.split('/').pop() ?? entry.name
    const lower = base.toLowerCase()

    if (lower.endsWith('.wmv')) {
      pending.push(
        drainZipEntry(entry, noteFailure).then(async () => {
          processed += 1
          emit()
          await putMediaGap(base)
          wmvGaps += 1
        }),
      )
      return
    }

    if (!lower.endsWith('.jpg') && !lower.endsWith('.jpeg')) {
      pending.push(
        drainZipEntry(entry, noteFailure).then(() => {
          processed += 1
          emit()
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
            const normalized = normalizeZipReadError(err)
            noteFailure(normalized)
            reject(normalized)
            return
          }
          if (data) {
            chunks.push(data)
          }
          if (final) {
            processed += 1
            emit()
            const bytes = concatBytes(chunks)
            putMediaFile(base, new Blob([bytes.slice()], { type: 'image/jpeg' }))
              .then(() => {
                stored += 1
                emit()
                resolve()
              })
              .catch((error: unknown) => {
                noteFailure(error)
                reject(error)
              })
          }
        }
        try {
          entry.start()
        } catch (error) {
          const normalized = normalizeZipReadError(error)
          noteFailure(normalized)
          reject(normalized)
        }
      }),
    )
  }

  while (!readError) {
    const { done, value } = await reader.read()
    const chunk = value ?? new Uint8Array(0)
    bytesRead += chunk.length
    try {
      pushZipChunk(unzip, chunk, done)
    } catch (error) {
      noteFailure(error)
    }
    if (done && totalBytes != null && bytesRead < totalBytes) {
      noteFailure(new IncompleteMediaZipError())
    }
    if (emit() || readError) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
    if (done || readError) {
      break
    }
  }

  await Promise.allSettled(pending)
  if (readError) {
    await reader.cancel().catch(() => undefined)
    throw readError
  }
  if (processed === 0) {
    throw new IncompleteMediaZipError()
  }

  emit(true)
  return { stored, skipped, wmvGaps }
}

export async function importZipImagesFromFile(
  file: File,
  onProgress?: (progress: ZipReadProgress) => void,
): Promise<{ stored: number; skipped: number; wmvGaps: number }> {
  return importZipImagesFromStream(file.stream().getReader(), onProgress, file.size)
}

export async function importZipImagesFromResponse(
  response: Response,
  onProgress?: (progress: ZipReadProgress) => void,
): Promise<{ stored: number; skipped: number; wmvGaps: number }> {
  if (!response.body) {
    throw new Error('Serwer nie zwrócił strumienia danych.')
  }
  const lengthHeader = Number(response.headers.get('content-length'))
  const totalBytes = Number.isFinite(lengthHeader) && lengthHeader > 0 ? lengthHeader : null
  return importZipImagesFromStream(response.body.getReader(), onProgress, totalBytes)
}

export type { ZipReadProgress }
