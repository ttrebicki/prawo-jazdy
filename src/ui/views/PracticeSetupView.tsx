import type { PracticeFilters } from '../../domain/types.ts'
import { DEFAULT_PRACTICE_FILTERS } from '../../domain/types.ts'

interface PracticeSetupViewProps {
  filters: PracticeFilters
  onChange: (filters: PracticeFilters) => void
  onStart: () => void
  onBack: () => void
}

const FILTER_LABELS: {
  key: keyof PracticeFilters
  label: string
}[] = [
  { key: 'scopeBasic', label: 'Wiedza podstawowa' },
  { key: 'scopeSpecialist', label: 'Wiedza specjalistyczna' },
  { key: 'onlyUnseen', label: 'Jeszcze nie odpowiadane' },
  { key: 'onlyMistakes', label: 'Tylko błędy' },
  { key: 'onlyWithPhoto', label: 'Ze zdjęciem na urządzeniu' },
  { key: 'onlyMissingFile', label: 'Brak pliku / WMV' },
]

export function PracticeSetupView({
  filters,
  onChange,
  onStart,
  onBack,
}: PracticeSetupViewProps) {
  const toggle = (key: keyof PracticeFilters) => {
    onChange({ ...filters, [key]: !filters[key] })
  }

  return (
    <div className="stack">
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        ← Wróć
      </button>
      <h1 className="page-title">Filtry ćwiczeń</h1>
      <p className="muted">Jedno pytanie na ekran. Wynik od razu po odpowiedzi.</p>

      <div className="stack">
        {FILTER_LABELS.map(({ key, label }) => (
          <label key={key} className="card checkbox-row">
            <input
              type="checkbox"
              checked={filters[key]}
              onChange={() => toggle(key)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <button type="button" className="btn" onClick={onStart}>
        Start
      </button>
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => onChange({ ...DEFAULT_PRACTICE_FILTERS })}
      >
        Reset filtrów
      </button>
    </div>
  )
}
