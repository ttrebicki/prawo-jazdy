import type { ImportStats } from '../../domain/types.ts'
import { ACTIVE_CATEGORY } from '../../domain/types.ts'
import type { QuestionBank } from '../../domain/question-bank.ts'

/** Live import metrics (UI may still show Figma sample rows on the result screen). */
export interface ImportWorkbookResultSummary {
  catalogDateLabel: string | null
  keptActive: number
  categoryBCount: number
  verificationExcluded: number
  categoryBWithoutMedia: number
}

export function buildImportWorkbookResultSummary(
  stats: ImportStats,
  bank: QuestionBank,
  hasImageOnDevice: (filename: string) => boolean,
): ImportWorkbookResultSummary {
  const meta = bank.getCatalogMeta()
  return {
    catalogDateLabel: meta.lastModified,
    keptActive: stats.kept,
    categoryBCount: bank.countByCategory(ACTIVE_CATEGORY),
    verificationExcluded: stats.verificationSkipped,
    categoryBWithoutMedia: bank.countMissingDisplayableMedia(
      ACTIVE_CATEGORY,
      hasImageOnDevice,
    ),
  }
}
