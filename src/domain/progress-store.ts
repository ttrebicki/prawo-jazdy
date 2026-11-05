import type {
  BasicKey,
  CategoryCode,
  LastOutcome,
  QuestionProgress,
  SpecialistKey,
} from './types.ts'

export type UserAnswer = BasicKey | SpecialistKey

export interface RecordAnswerInput {
  number: string
  category: CategoryCode
  userAnswer: UserAnswer
  correctAnswer: UserAnswer
  mediaViewable: boolean
  answeredAt?: string
}

export class ProgressStore {
  private progress = new Map<string, QuestionProgress>()

  private key(number: string, category: CategoryCode): string {
    return `${category}:${number}`
  }

  load(entries: QuestionProgress[]): void {
    this.progress.clear()
    for (const entry of entries) {
      this.progress.set(this.key(entry.number, entry.category), entry)
    }
  }

  dump(category?: CategoryCode): QuestionProgress[] {
    const all = [...this.progress.values()]
    if (!category) {
      return all
    }
    return all.filter((p) => p.category === category)
  }

  get(number: string, category: CategoryCode): QuestionProgress | undefined {
    return this.progress.get(this.key(number, category))
  }

  asMap(category: CategoryCode): Map<string, QuestionProgress> {
    const map = new Map<string, QuestionProgress>()
    for (const entry of this.dump(category)) {
      map.set(entry.number, entry)
    }
    return map
  }

  recordAnswer(input: RecordAnswerInput): QuestionProgress {
    const existing = this.progress.get(this.key(input.number, input.category))
    const isCorrect = input.userAnswer === input.correctAnswer
    const answeredAt = input.answeredAt ?? new Date().toISOString()

    let lastOutcome: LastOutcome
    let timesCorrect = existing?.timesCorrect ?? 0

    if (!isCorrect) {
      lastOutcome = 'incorrect'
    } else if (input.mediaViewable) {
      lastOutcome = 'correct'
      timesCorrect += 1
    } else {
      // Correct guess without seeing clip/photo does not count as mastery.
      lastOutcome = existing?.lastOutcome ?? 'unanswered'
    }

    const updated: QuestionProgress = {
      number: input.number,
      category: input.category,
      timesSeen: (existing?.timesSeen ?? 0) + 1,
      timesCorrect,
      lastOutcome,
      lastAnsweredAt: answeredAt,
    }

    this.progress.set(this.key(input.number, input.category), updated)
    return updated
  }

  listMistakes(category: CategoryCode): QuestionProgress[] {
    return this.dump(category)
      .filter((p) => p.lastOutcome === 'incorrect')
      .sort((a, b) =>
        (b.lastAnsweredAt ?? '').localeCompare(a.lastAnsweredAt ?? ''),
      )
  }

  countSeen(category: CategoryCode): number {
    return this.dump(category).filter((p) => p.timesSeen > 0).length
  }

  countMistakes(category: CategoryCode): number {
    return this.listMistakes(category).length
  }

  /** Returns official numbers removed from the live catalog. */
  reconcileAfterImport(
    category: CategoryCode,
    liveNumbers: Set<string>,
  ): string[] {
    const removed: string[] = []
    for (const entry of this.dump(category)) {
      if (!liveNumbers.has(entry.number)) {
        this.progress.delete(this.key(entry.number, category))
        removed.push(entry.number)
      }
    }
    return removed
  }
}

export function getCorrectAnswerKey(
  question: import('./types.ts').QuestionRecord,
): UserAnswer {
  if (question.scope === 'basic') {
    if (!question.basicKey) {
      throw new Error('Brak klucza T/N')
    }
    return question.basicKey
  }
  if (!question.specialistKey) {
    throw new Error('Brak klucza A/B/C')
  }
  return question.specialistKey
}

export function formatUserAnswerLabel(answer: UserAnswer): string {
  if (answer === 'T') {
    return 'TAK'
  }
  if (answer === 'N') {
    return 'NIE'
  }
  return answer
}
