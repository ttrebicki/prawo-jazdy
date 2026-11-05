import type {
  CategoryCode,
  LastOutcome,
  RecordAnswerParams,
  StudyProgress,
} from './types.ts'

export type ProgressState = Map<string, StudyProgress>

export function progressKey(
  officialNumber: string,
  category: CategoryCode,
): string {
  return `${category}:${officialNumber}`
}

export function recordAnswerInState(
  state: ProgressState,
  params: RecordAnswerParams,
): StudyProgress {
  const existing = state.get(progressKey(params.officialNumber, params.category))
  const isCorrect = params.userKey === params.correctKey
  const answeredAt = params.answeredAt ?? new Date().toISOString()

  let lastOutcome: LastOutcome
  let timesCorrect = existing?.timesCorrect ?? 0

  if (!isCorrect) {
    lastOutcome = 'incorrect'
  } else if (params.mediaViewable) {
    lastOutcome = 'correct'
    timesCorrect += 1
  } else {
    lastOutcome = existing?.lastOutcome ?? 'unanswered'
  }

  const updated: StudyProgress = {
    officialNumber: params.officialNumber,
    category: params.category,
    timesSeen: (existing?.timesSeen ?? 0) + 1,
    timesCorrect,
    lastOutcome,
    lastAnsweredAt: answeredAt,
  }

  state.set(progressKey(params.officialNumber, params.category), updated)
  return updated
}

export function listMistakesFromState(
  state: ProgressState,
  category: CategoryCode,
): StudyProgress[] {
  return [...state.values()]
    .filter(
      (entry) =>
        entry.category === category && entry.lastOutcome === 'incorrect',
    )
    .sort((a, b) =>
      (b.lastAnsweredAt ?? '').localeCompare(a.lastAnsweredAt ?? ''),
    )
}

export function reconcileProgressAfterImport(
  state: ProgressState,
  category: CategoryCode,
  liveOfficialNumbers: ReadonlySet<string>,
): string[] {
  const removed: string[] = []
  for (const entry of state.values()) {
    if (entry.category !== category) {
      continue
    }
    if (!liveOfficialNumbers.has(entry.officialNumber)) {
      state.delete(progressKey(entry.officialNumber, category))
      removed.push(entry.officialNumber)
    }
  }
  return removed
}

export function loadProgressState(entries: StudyProgress[]): ProgressState {
  const state: ProgressState = new Map()
  for (const entry of entries) {
    state.set(progressKey(entry.officialNumber, entry.category), entry)
  }
  return state
}
