import { describe, expect, it } from 'vitest'
import {
  InMemoryQuestionBank,
  type Question,
} from './index.ts'

const sampleBasic: Question = {
  officialNumber: '9001',
  catalogFilename: 'fixture.xlsx',
  catalogModifiedAt: '2026-07-30T11:04:00Z',
  scope: 'basic',
  points: 3,
  categories: ['B', 'AM'],
  kind: 'yes-no',
  prompt: 'Przykladowe pytanie podstawowe?',
  answers: null,
  key: 'T',
  mediaFilename: 'clip.wmv',
  mediaKind: 'video',
}

describe('InMemoryQuestionBank', () => {
  it('lists questions by category and scope', () => {
    const bank = new InMemoryQuestionBank()
    bank.setCatalog([sampleBasic], {
      catalogFilename: 'fixture.xlsx',
      catalogModifiedAt: null,
    })
    expect(bank.listQuestions({ category: 'B', scope: 'basic' })).toHaveLength(1)
    expect(bank.listQuestions({ category: 'AM' })).toHaveLength(1)
  })
})
