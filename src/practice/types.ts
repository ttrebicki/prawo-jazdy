import type { QuestionBank, MediaLookup } from '../domain/question-bank.ts'
import type {
  ProgressStore,
  RecordAnswerInput,
} from '../domain/progress-store.ts'
import type { CategoryCode } from '../domain/types.ts'
import type { ClipLoadProgress } from '../storage/clip-progress.ts'
import type { QuestionImageRead } from '../storage/media-zip-library.ts'

/** Dependencies injected from the app shell; practice does not touch storage. */
export interface PracticeDependencies {
  bank: QuestionBank
  progress: ProgressStore
  category: CategoryCode
  mediaLookup: MediaLookup
  fetchQuestionImage: (
    filename: string,
    onProgress?: (loaded: number, total: number) => void,
  ) => Promise<QuestionImageRead>
  fetchQuestionClip: (
    filename: string,
    onProgress?: (progress: ClipLoadProgress) => void,
  ) => Promise<QuestionImageRead>
  hasImageOnDevice: (filename: string) => boolean
  recordAnswer: (input: RecordAnswerInput) => Promise<void>
  getExplanation: (officialNumber: string) => Promise<string | null>
}
