import {
  mergeQuestionsByNumber,
  parseWorkbookBuffer,
} from '../domain/import-catalog.ts'
import { QuestionBank } from '../domain/question-bank.ts'
import { ProgressStore } from '../domain/progress-store.ts'
import type { CatalogMeta, ImportStats, QuestionProgress } from '../domain/types.ts'
import { ACTIVE_CATEGORY } from '../domain/types.ts'
import {
  OFFICIAL_MEDIA_ZIP_URL,
} from '../domain/constants.ts'
import {
  countMediaFiles,
  deleteProgressEntry,
  getMediaFile,
  getQuestionExplanation,
  hasMediaFile,
  importZipImagesFromFile,
  importZipImagesFromResponse,
  loadCatalog,
  loadProgress,
  saveCatalog,
  saveProgressEntry,
  saveQuestionExplanation,
} from '../storage/app-database.ts'

export class StudyApp {
  readonly bank = new QuestionBank()
  readonly progress = new ProgressStore()
  private mediaCache = new Map<string, boolean>()

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
    this.mediaCache.clear()
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
    return getMediaFile(filename)
  }

  hasImageOnDevice = (filename: string): boolean => {
    return this.mediaCache.get(filename) ?? false
  }

  async refreshMediaIndex(): Promise<number> {
    this.mediaCache.clear()
    const catalog = this.bank.getSnapshot().questions
    for (const q of catalog) {
      if (q.mediaFilename && q.mediaKind === 'image') {
        const exists = await hasMediaFile(q.mediaFilename)
        this.mediaCache.set(q.mediaFilename, exists)
      }
    }
    return countMediaFiles()
  }

  async importMediaZip(
    file: File,
    onProgress?: (n: number) => void,
  ): Promise<{ stored: number; skipped: number }> {
    const result = await importZipImagesFromFile(file, onProgress)
    await this.refreshMediaIndex()
    return { stored: result.stored, skipped: result.skipped }
  }

  async importOfficialMediaZip(
    onProgress?: (n: number) => void,
  ): Promise<{ stored: number; skipped: number }> {
    const response = await fetch(OFFICIAL_MEDIA_ZIP_URL)
    if (!response.ok) {
      throw new Error(`Serwer zwrócił ${response.status}`)
    }
    const result = await importZipImagesFromResponse(response, onProgress)
    await this.refreshMediaIndex()
    return { stored: result.stored, skipped: result.skipped }
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
