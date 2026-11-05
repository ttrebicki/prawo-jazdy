import type {
  CategoryCode,
  MediaResolution,
  PracticeFilters,
  QuestionProgress,
  QuestionRecord,
  QuestionScope,
} from './types.ts'
import { ACTIVE_CATEGORY } from './types.ts'

export interface QuestionBankSnapshot {
  questions: QuestionRecord[]
  catalogLastModified: string | null
  catalogFilename: string | null
}

export type MediaLookup = (filename: string | null) => Promise<Blob | null>

function questionMatchesCategory(
  question: QuestionRecord,
  category: CategoryCode,
): boolean {
  return question.categories.includes(category)
}

export function isMediaViewable(
  question: QuestionRecord,
  resolution: MediaResolution,
): boolean {
  if (question.mediaKind === 'none') {
    return true
  }
  return resolution.reason === 'available'
}

export async function resolveMediaForQuestion(
  question: QuestionRecord,
  lookup: MediaLookup,
): Promise<MediaResolution> {
  if (question.mediaKind === 'none' || !question.mediaFilename) {
    return {
      kind: 'none',
      reason: 'none_needed',
      blob: null,
      filename: null,
    }
  }

  if (question.mediaKind === 'video') {
    return {
      kind: 'video',
      reason: 'video_wmv',
      blob: null,
      filename: question.mediaFilename,
    }
  }

  const blob = await lookup(question.mediaFilename)
  if (blob) {
    return {
      kind: 'image',
      reason: 'available',
      blob,
      filename: question.mediaFilename,
    }
  }

  return {
    kind: 'image',
    reason: 'missing_file',
    blob: null,
    filename: question.mediaFilename,
  }
}

export class QuestionBank {
  private questions: QuestionRecord[] = []
  private catalogLastModified: string | null = null
  private catalogFilename: string | null = null

  load(snapshot: QuestionBankSnapshot): void {
    this.questions = snapshot.questions
    this.catalogLastModified = snapshot.catalogLastModified
    this.catalogFilename = snapshot.catalogFilename
  }

  getSnapshot(): QuestionBankSnapshot {
    return {
      questions: this.questions,
      catalogLastModified: this.catalogLastModified,
      catalogFilename: this.catalogFilename,
    }
  }

  hasCatalog(): boolean {
    return this.questions.length > 0
  }

  getCatalogMeta() {
    return {
      filename: this.catalogFilename,
      lastModified: this.catalogLastModified,
      totalQuestions: this.questions.length,
    }
  }

  listForCategory(category: CategoryCode): QuestionRecord[] {
    return this.questions.filter((q) => questionMatchesCategory(q, category))
  }

  getByNumber(number: string): QuestionRecord | undefined {
    return this.questions.find((q) => q.number === number)
  }

  countByCategory(category: CategoryCode): number {
    return this.listForCategory(category).length
  }

  countMissingDisplayableMedia(
    category: CategoryCode,
    hasImageOnDevice: (filename: string) => boolean,
  ): number {
    return this.listForCategory(category).filter((q) => {
      if (q.mediaKind === 'none') {
        return false
      }
      if (q.mediaKind === 'video') {
        return true
      }
      if (!q.mediaFilename) {
        return true
      }
      return !hasImageOnDevice(q.mediaFilename)
    }).length
  }

  filterPracticeCandidates(
    category: CategoryCode,
    filters: PracticeFilters,
    progress: Map<string, QuestionProgress>,
    hasImageOnDevice: (filename: string) => boolean,
  ): QuestionRecord[] {
    let list = this.listForCategory(category)

    if (filters.scopeBasic && !filters.scopeSpecialist) {
      list = list.filter((q) => q.scope === 'basic')
    } else if (filters.scopeSpecialist && !filters.scopeBasic) {
      list = list.filter((q) => q.scope === 'specialist')
    } else if (!filters.scopeBasic && !filters.scopeSpecialist) {
      return []
    }

    if (filters.onlyUnseen) {
      list = list.filter((q) => {
        const p = progress.get(q.number)
        return !p || p.timesSeen === 0
      })
    }

    if (filters.onlyMistakes) {
      list = list.filter((q) => progress.get(q.number)?.lastOutcome === 'incorrect')
    }

    if (filters.onlyWithPhoto) {
      list = list.filter((q) => {
        if (q.mediaKind !== 'image' || !q.mediaFilename) {
          return false
        }
        return hasImageOnDevice(q.mediaFilename)
      })
    }

    if (filters.onlyMissingFile) {
      list = list.filter((q) => {
        if (q.mediaKind === 'video') {
          return true
        }
        if (q.mediaKind === 'image' && q.mediaFilename) {
          return !hasImageOnDevice(q.mediaFilename)
        }
        return false
      })
    }

    return list
  }

  pickRandom(
    candidates: QuestionRecord[],
    excludeNumber?: string,
  ): QuestionRecord | null {
    const pool = excludeNumber
      ? candidates.filter((q) => q.number !== excludeNumber)
      : candidates
    if (pool.length === 0) {
      return candidates.length > 0
        ? candidates[Math.floor(Math.random() * candidates.length)] ?? null
        : null
    }
    return pool[Math.floor(Math.random() * pool.length)] ?? null
  }
}

export function formatScopeLabel(scope: QuestionScope): string {
  return scope === 'basic' ? 'Podstawowe' : 'Specjalistyczne'
}

export function activeCategoryLabel(): string {
  return ACTIVE_CATEGORY
}
