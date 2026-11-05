import type {
  BasicKey,
  CategoryCode,
  LastOutcome,
  QuestionProgress,
  SpecialistKey,
} from './types.ts'

export type UserAnswer = BasicKey | SpecialistKey

export type SessionKind = 'practice' | 'exam'

export interface SessionAnswer {
  number: string
  userAnswer: UserAnswer
  correct: boolean
}

export interface StudySession {
  id: number
  kind: SessionKind
  category: CategoryCode
  questionNumbers: string[]
  answers: SessionAnswer[]
  score: number | null
  passed: boolean | null
  startedAt: string
  finishedAt: string | null
}

export interface RecordAnswerInput {
  number: string
  category: CategoryCode
  userAnswer: UserAnswer
  correctAnswer: UserAnswer
  mediaViewable: boolean
  answeredAt?: string
  sessionId?: number
}

export class ProgressStore {
  private progress = new Map<string, QuestionProgress>()
  private sessions: StudySession[] = []

  private key(number: string, category: CategoryCode): string {
    return `${category}:${number}`
  }

  static async openFromIndexedDB(): Promise<ProgressStore> {
    const { loadProgress, loadSessions } = await import('../storage/app-database.ts')
    const store = new ProgressStore()
    store.load(await loadProgress())
    store.loadSessions(await loadSessions())
    return store
  }

  load(entries: QuestionProgress[]): void {
    this.progress.clear()
    for (const entry of entries) {
      this.progress.set(this.key(entry.number, entry.category), entry)
    }
  }

  loadSessions(entries: StudySession[]): void {
    this.sessions = [...entries].sort((a, b) => b.startedAt.localeCompare(a.startedAt))
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

    if (input.sessionId !== undefined) {
      this.appendSessionAnswer(input.sessionId, {
        number: input.number,
        userAnswer: input.userAnswer,
        correct: isCorrect,
      })
    }

    return updated
  }

  async recordAnswerPersisted(input: RecordAnswerInput): Promise<QuestionProgress> {
    const updated = this.recordAnswer(input)
    const { saveProgressEntry, saveSession } = await import('../storage/app-database.ts')
    await saveProgressEntry(updated)
    if (input.sessionId !== undefined) {
      const session = this.sessions.find((row) => row.id === input.sessionId)
      if (session) {
        await saveSession(session)
      }
    }
    return updated
  }

  listMistakes(category: CategoryCode): QuestionProgress[] {
    return this.dump(category)
      .filter((p) => p.lastOutcome === 'incorrect')
      .sort((a, b) =>
        (b.lastAnsweredAt ?? '').localeCompare(a.lastAnsweredAt ?? ''),
      )
  }

  listSessions(category?: CategoryCode): StudySession[] {
    if (!category) {
      return [...this.sessions]
    }
    return this.sessions.filter((row) => row.category === category)
  }

  startSession(input: {
    kind: SessionKind
    category: CategoryCode
    questionNumbers: string[]
  }): StudySession {
    const session: StudySession = {
      id: 0,
      kind: input.kind,
      category: input.category,
      questionNumbers: [...input.questionNumbers],
      answers: [],
      score: null,
      passed: null,
      startedAt: new Date().toISOString(),
      finishedAt: null,
    }
    this.sessions.unshift(session)
    return session
  }

  async startSessionPersisted(input: {
    kind: SessionKind
    category: CategoryCode
    questionNumbers: string[]
  }): Promise<StudySession> {
    const session = this.startSession(input)
    const { saveSession } = await import('../storage/app-database.ts')
    const saved = await saveSession(session)
    const index = this.sessions.indexOf(session)
    if (index >= 0) {
      this.sessions[index] = saved
    }
    return saved
  }

  finishSession(input: {
    sessionId: number
    score: number
    passed: boolean
  }): StudySession | undefined {
    const session = this.sessions.find((row) => row.id === input.sessionId)
    if (!session) {
      return undefined
    }
    session.score = input.score
    session.passed = input.passed
    session.finishedAt = new Date().toISOString()
    return session
  }

  async finishSessionPersisted(input: {
    sessionId: number
    score: number
    passed: boolean
  }): Promise<StudySession | undefined> {
    const session = this.finishSession(input)
    if (!session) {
      return undefined
    }
    const { saveSession } = await import('../storage/app-database.ts')
    await saveSession(session)
    return session
  }

  countSeen(category: CategoryCode): number {
    return this.dump(category).filter((p) => p.timesSeen > 0).length
  }

  countMistakes(category: CategoryCode): number {
    return this.listMistakes(category).length
  }

  /**
   * After a new live catalog import, progress for official numbers no longer in
   * the bank stays on the device (matched again if the number returns).
   */
  reconcileAfterImport(
    _category: CategoryCode,
    _liveNumbers: Set<string>,
  ): string[] {
    return []
  }

  private appendSessionAnswer(sessionId: number, answer: SessionAnswer): void {
    const session = this.sessions.find((row) => row.id === sessionId)
    if (!session) {
      return
    }
    session.answers = [...session.answers, answer]
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
