import { describe, expect, it } from 'vitest'
import {
  InMemoryProgressStore,
  listMistakesFromState,
  loadProgressState,
  reconcileProgressAfterImport,
  recordAnswerInState,
} from './index.ts'

describe('progress rules', () => {
  it('records mistakes and keeps history after re-import', () => {
    const store = new InMemoryProgressStore()
    store.recordAnswer({
      officialNumber: '10',
      category: 'B',
      userKey: 'T',
      correctKey: 'N',
      mediaViewable: true,
    })
    expect(store.listMistakes('B').map((m) => m.officialNumber)).toEqual(['10'])

    const state = loadProgressState([])
    recordAnswerInState(state, {
      officialNumber: '1',
      category: 'B',
      userKey: 'T',
      correctKey: 'T',
      mediaViewable: true,
    })
    recordAnswerInState(state, {
      officialNumber: '2',
      category: 'B',
      userKey: 'T',
      correctKey: 'N',
      mediaViewable: true,
    })
    reconcileProgressAfterImport(state, 'B', new Set(['2']))
    expect([...state.values()].map((v) => v.officialNumber)).toEqual(['2'])
    expect(listMistakesFromState(state, 'B').map((m) => m.officialNumber)).toEqual(
      ['2'],
    )
  })

  it('does not count mastery when media is not viewable', () => {
    const store = new InMemoryProgressStore()
    const row = store.recordAnswer({
      officialNumber: '77',
      category: 'B',
      userKey: 'N',
      correctKey: 'N',
      mediaViewable: false,
    })
    expect(row.lastOutcome).toBe('unanswered')
    expect(row.timesCorrect).toBe(0)
  })
})
