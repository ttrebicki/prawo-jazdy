import {
  listMistakesFromState,
  loadProgressState,
  progressKey,
  reconcileProgressAfterImport,
  recordAnswerInState,
  type ProgressState,
} from './progress-rules.ts'
import type {
  CategoryCode,
  ExamSession,
  ProgressStore,
  RecordAnswerParams,
  StudyProgress,
} from './types.ts'

export class InMemoryProgressStore implements ProgressStore {
  private state: ProgressState = new Map()
  private sessions: ExamSession[] = []

  constructor(initial: StudyProgress[] = []) {
    this.state = loadProgressState(initial)
  }

  recordAnswer(params: RecordAnswerParams): StudyProgress {
    return recordAnswerInState(this.state, params)
  }

  getProgress(
    officialNumber: string,
    category: CategoryCode,
  ): StudyProgress | undefined {
    return this.state.get(progressKey(officialNumber, category))
  }

  listMistakes(category: CategoryCode): StudyProgress[] {
    return listMistakesFromState(this.state, category)
  }

  listPastPapers(category: CategoryCode): ExamSession[] {
    return this.sessions.filter((session) => session.category === category)
  }

  reconcileAfterImport(
    category: CategoryCode,
    liveOfficialNumbers: ReadonlySet<string>,
  ): string[] {
    return reconcileProgressAfterImport(
      this.state,
      category,
      liveOfficialNumbers,
    )
  }
}
