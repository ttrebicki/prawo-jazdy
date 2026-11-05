import { describe, expect, it } from 'vitest'
import { ProgressStore } from '../src/domain/progress-store.ts'

describe('ProgressStore', () => {
  it('counts a correct answer when media was viewable', () => {
    const store = new ProgressStore()
    const updated = store.recordAnswer({
      number: '42',
      category: 'B',
      userAnswer: 'T',
      correctAnswer: 'T',
      mediaViewable: true,
      answeredAt: '2026-11-05T12:00:00.000Z',
    })
    expect(updated.lastOutcome).toBe('correct')
    expect(updated.timesCorrect).toBe(1)
    expect(updated.timesSeen).toBe(1)
  })

  it('does not treat a correct guess on unseen clip as mastery', () => {
    const store = new ProgressStore()
    const updated = store.recordAnswer({
      number: '77',
      category: 'B',
      userAnswer: 'N',
      correctAnswer: 'N',
      mediaViewable: false,
      answeredAt: '2026-11-05T12:00:00.000Z',
    })
    expect(updated.lastOutcome).toBe('unanswered')
    expect(updated.timesCorrect).toBe(0)
    expect(updated.timesSeen).toBe(1)
  })

  it('records mistakes and lists them for category B', () => {
    const store = new ProgressStore()
    store.recordAnswer({
      number: '10',
      category: 'B',
      userAnswer: 'T',
      correctAnswer: 'N',
      mediaViewable: true,
    })
    store.recordAnswer({
      number: '11',
      category: 'B',
      userAnswer: 'A',
      correctAnswer: 'A',
      mediaViewable: true,
    })
    const mistakes = store.listMistakes('B')
    expect(mistakes.map((m) => m.number)).toEqual(['10'])
  })

  it('keeps progress when an official number leaves the live catalog', () => {
    const store = new ProgressStore()
    store.recordAnswer({
      number: '1',
      category: 'B',
      userAnswer: 'T',
      correctAnswer: 'T',
      mediaViewable: true,
    })
    store.recordAnswer({
      number: '2',
      category: 'B',
      userAnswer: 'T',
      correctAnswer: 'N',
      mediaViewable: true,
    })
    store.reconcileAfterImport('B', new Set(['2']))
    expect(store.dump('B').map((p) => p.number).sort()).toEqual(['1', '2'])
  })

  it('tracks practice sessions and answers in order', () => {
    const store = new ProgressStore()
    const session = store.startSession({
      kind: 'practice',
      category: 'B',
      questionNumbers: ['5', '6'],
    })

    store.recordAnswer({
      number: '5',
      category: 'B',
      userAnswer: 'T',
      correctAnswer: 'T',
      mediaViewable: true,
      sessionId: session.id,
    })

    const finished = store.finishSession({
      sessionId: session.id,
      score: 1,
      passed: true,
    })

    expect(finished?.answers.map((a) => a.number)).toEqual(['5'])
    expect(store.listSessions('B')).toHaveLength(1)
  })
})
