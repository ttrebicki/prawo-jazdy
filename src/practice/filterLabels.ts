import type { PracticeFilters } from '../domain/types.ts'

export const PRACTICE_FILTER_OPTIONS: {
  key: keyof PracticeFilters
  label: string
}[] = [
  { key: 'scopeBasic', label: 'Wiedza podstawowa' },
  { key: 'scopeSpecialist', label: 'Wiedza specjalistyczna' },
  { key: 'onlyUnseen', label: 'Jeszcze nie odpowiadane' },
  { key: 'onlyMistakes', label: 'Błędy' },
  { key: 'onlyWithPhoto', label: 'Ze zdjęciem na urządzeniu' },
  { key: 'onlyMissingFile', label: 'Brak pliku / WMV' },
]
