import type { QuestionBank, MediaLookup } from '../domain/question-bank.ts'
import type {
  ProgressStore,
  RecordAnswerInput,
} from '../domain/progress-store.ts'
import type { CategoryCode } from '../domain/types.ts'

/** Dependencies injected from the app shell; practice does not touch storage. */
export interface PracticeDependencies {
  bank: QuestionBank
  progress: ProgressStore
  category: CategoryCode
  mediaLookup: MediaLookup
  hasImageOnDevice: (filename: string) => boolean
  recordAnswer: (input: RecordAnswerInput) => Promise<void>
}
