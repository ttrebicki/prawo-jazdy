import { useCallback } from 'react'
import type { PracticeFilters, QuestionRecord } from '../../domain/types.ts'
import type { PracticeDependencies } from '../types.ts'

export function usePracticeSession(
  deps: PracticeDependencies,
  filters: PracticeFilters,
) {
  const pickQuestion = useCallback(
    (excludeNumber?: string): QuestionRecord | null => {
      const progressMap = deps.progress.asMap(deps.category)
      const candidates = deps.bank.filterPracticeCandidates(
        deps.category,
        filters,
        progressMap,
        deps.hasImageOnDevice,
      )
      return deps.bank.pickRandom(candidates, excludeNumber)
    },
    [deps, filters],
  )

  return { pickQuestion }
}
