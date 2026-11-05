import type { StudyApp } from '../../app/study-app.ts'
import { ACTIVE_CATEGORY } from '../../domain/types.ts'
import type { PracticeDependencies } from '../types.ts'

/** Maps the app shell facade to practice dependencies without touching storage. */
export function practiceDepsFromStudyApp(app: StudyApp): PracticeDependencies {
  return {
    bank: app.bank,
    progress: app.progress,
    category: ACTIVE_CATEGORY,
    mediaLookup: app.mediaLookup,
    hasImageOnDevice: app.hasImageOnDevice,
    recordAnswer: async (input) => {
      await app.recordAnswer(input)
    },
  }
}
