import {
  mergeQuestionsByNumber,
  parseWorkbookBuffer,
} from '../domain/import-catalog.ts'
import { QuestionBank } from '../domain/question-bank.ts'
import { ProgressStore } from '../domain/progress-store.ts'
import type { CatalogMeta, ImportStats, QuestionProgress } from '../domain/types.ts'
import { ACTIVE_CATEGORY } from '../domain/types.ts'
import {
  deleteProgressEntry,
  getQuestionExplanation,
  loadCatalog,
  loadProgress,
  saveCatalog,
  saveProgressEntry,
  saveQuestionExplanation,
} from '../storage/app-database.ts'
import { mediaZipLibrary } from '../storage/media-zip-library.ts'
import type { QuestionImageRead } from '../storage/media-zip-library.ts'
import type { ClipLoadProgress } from '../storage/clip-progress.ts'

export class StudyApp {
  readonly bank = new QuestionBank()
  readonly progress = new ProgressStore()

  async hydrate(): Promise<void> {
    const catalog = await loadCatalog()
    if (catalog) {
      this.bank.load({
        questions: catalog.questions,
        catalogFilename: catalog.meta.filename,
        catalogLastModified: catalog.meta.lastModified,
      })
    }
    this.progress.load(await loadProgress())
    await mediaZipLibrary.restoreSaved(false).catch(() => false)
  }

  async importWorkbook(
    buffer: ArrayBuffer,
    meta: Pick<CatalogMeta, 'filename' | 'lastModified'>,
  ): Promise<ImportStats> {
    const parsed = parseWorkbookBuffer(buffer)
    const existing = this.bank.getSnapshot().questions
    const merged = mergeQuestionsByNumber(existing, parsed.questions)
    const catalogMeta: CatalogMeta = {
      filename: meta.filename,
      lastModified: meta.lastModified,
      importedAt: new Date().toISOString(),
    }
    await saveCatalog(catalogMeta, merged)
    this.bank.load({
      questions: merged,
      catalogFilename: catalogMeta.filename,
      catalogLastModified: catalogMeta.lastModified,
    })
    const liveNumbers = new Set(
      merged
        .filter((q) => q.categories.includes(ACTIVE_CATEGORY))
        .map((q) => q.number),
    )
    const removed = this.progress.reconcileAfterImport(ACTIVE_CATEGORY, liveNumbers)
    for (const number of removed) {
      await deleteProgressEntry(number, ACTIVE_CATEGORY)
    }
    return parsed.stats
  }

  async recordAnswer(
    ...args: Parameters<ProgressStore['recordAnswer']>
  ): Promise<QuestionProgress> {
    const updated = this.progress.recordAnswer(...args)
    await saveProgressEntry(updated)
    return updated
  }

  mediaLookup = async (filename: string | null): Promise<Blob | null> => {
    if (!filename) {
      return null
    }
    const read = await mediaZipLibrary.readQuestionImage(filename)
    return read.blob
  }

  fetchQuestionImage = (
    filename: string,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<QuestionImageRead> => mediaZipLibrary.readQuestionImage(filename, onProgress)

  fetchQuestionClip = (
    filename: string,
    onProgress?: (progress: ClipLoadProgress) => void,
  ): Promise<QuestionImageRead> => mediaZipLibrary.readQuestionClip(filename, onProgress)

  hasImageOnDevice = (filename: string): boolean => mediaZipLibrary.hasImage(filename)

  async refreshMediaIndex(): Promise<number> {
    return mediaZipLibrary.entryCount
  }

  /** Links a local ZIP. Does not copy image bytes into the app. */
  async attachMediaZip(
    file: File,
    handle: FileSystemFileHandle | null,
    onProgress?: (message: string) => void,
  ): Promise<{ entryCount: number; fileName: string }> {
    await mediaZipLibrary.attach(file, handle, onProgress)
    return { entryCount: mediaZipLibrary.entryCount, fileName: file.name }
  }

  /** User gesture: reopen the ZIP remembered with the File System Access API. */
  async restoreMediaZip(): Promise<boolean> {
    return mediaZipLibrary.restoreSaved(true)
  }

  async importMediaZip(
    file: File,
  ): Promise<{ stored: number; skipped: number }> {
    const linked = await this.attachMediaZip(file, null)
    return { stored: linked.entryCount, skipped: 0 }
  }

  async importOfficialMediaZip(): Promise<{ stored: number; skipped: number }> {
    throw new Error(
      'Aplikacja nie pobiera całego archiwum. Pobierz plik w przeglądarce i wskaż go z dysku.',
    )
  }

  getExplanation = async (officialNumber: string): Promise<string | null> => {
    return getQuestionExplanation(officialNumber)
  }

  saveExplanation = async (
    officialNumber: string,
    text: string,
  ): Promise<void> => {
    await saveQuestionExplanation({ officialNumber, text })
  }
}

export const studyApp = new StudyApp()

/** Polish label for catalog Last-Modified / import metadata (UI). */
export function formatCatalogDateLabel(isoOrHttpDate: string | null): string {
  if (!isoOrHttpDate) {
    return 'nieznana'
  }
  const parsed = Date.parse(isoOrHttpDate)
  if (Number.isNaN(parsed)) {
    return isoOrHttpDate
  }
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed)
}
