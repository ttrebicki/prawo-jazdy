import { describe, expect, it } from 'vitest'
import type { QuestionExplanation } from '../src/domain/types.ts'
import { normalizeExplanationText } from '../src/storage/explanation-text.ts'

/** Invented fixture — not from the official workbook. */
export const FIXTURE_EXPLANATION: QuestionExplanation = {
  officialNumber: 'fixture-1001',
  text: 'Przy znaku stop ustąp pierwszeństwa wszystkim pojazdom na skrzyżowaniu, dlatego poprawna odpowiedź to TAK.',
}

describe('normalizeExplanationText', () => {
  it('trims and keeps short Polish copy', () => {
    expect(normalizeExplanationText(`  ${FIXTURE_EXPLANATION.text}  `)).toBe(
      FIXTURE_EXPLANATION.text,
    )
  })

  it('drops empty strings so UI can hide the block', () => {
    expect(normalizeExplanationText('   ')).toBeNull()
  })
})

describe('question explanation fixture', () => {
  it('uses an invented official number', () => {
    expect(FIXTURE_EXPLANATION.officialNumber.startsWith('fixture-')).toBe(true)
  })
})
