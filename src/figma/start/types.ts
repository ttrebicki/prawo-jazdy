import type { QuestionBank } from '../../domain/question-bank.ts'
import type { ProgressStore } from '../../domain/progress-store.ts'
import type { StartTheme } from './themeAssets.ts'

export interface StartScreenProps {
  bank: QuestionBank
  progress: ProgressStore
  hasImageOnDevice: (filename: string) => boolean
  onPractice: () => void
  onMistakes: () => void
  onImport: () => void
  /** Opens import / media flow; defaults to `onImport`. */
  onImportMedia?: () => void
  /** Opens the locked mock-exam screen (start tile is visually locked). */
  onMockExam?: () => void
  initialTheme?: StartTheme
}
