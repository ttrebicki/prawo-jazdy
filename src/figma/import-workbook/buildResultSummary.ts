import type { ImportStats } from '../../domain/types.ts'
import { ACTIVE_CATEGORY } from '../../domain/types.ts'
import type { QuestionBank } from '../../domain/question-bank.ts'
import type { ImportWorkbookResultSummary } from './ImportWorkbookResultView.tsx'

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
