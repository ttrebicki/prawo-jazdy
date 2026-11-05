import { describe, expect, it } from 'vitest'
import {
  displayExplanationText,
  MISSING_QUESTION_EXPLANATION,
} from '../src/practice/explanationMessages.ts'

describe('displayExplanationText', () => {
  it('returns stored copy when present', () => {
    expect(displayExplanationText('  Wyjaśnienie testowe  ')).toBe(
      'Wyjaśnienie testowe',
    )
  })

  it('returns Polish placeholder when nothing is stored', () => {
    expect(displayExplanationText(null)).toBe(MISSING_QUESTION_EXPLANATION)
    expect(displayExplanationText('   ')).toBe(MISSING_QUESTION_EXPLANATION)
  })
})
