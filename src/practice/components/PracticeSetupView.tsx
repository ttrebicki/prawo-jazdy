import type { PracticeFilters } from '../../domain/types.ts'
import { DEFAULT_PRACTICE_FILTERS } from '../../domain/types.ts'
import { PRACTICE_FILTER_OPTIONS } from '../filterLabels.ts'

interface PracticeSetupViewProps {
  filters: PracticeFilters
  onChange: (filters: PracticeFilters) => void
  onStart: () => void
  onBack: () => void
}

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
    <div className="practice-setup">
      <button
        type="button"
        className="practice-btn practice-btn-ghost"
        onClick={onBack}
      >
        ← Wróć
      </button>
      <h1 className="practice-title">Ćwicz — kategoria B</h1>
      <p className="practice-muted">
        Jedno pytanie na ekranie. Bez zegara. Wynik od razu po odpowiedzi.
      </p>

      <fieldset className="practice-filters">
        <legend className="practice-visually-hidden">Filtry pytań</legend>
        {PRACTICE_FILTER_OPTIONS.map(({ key, label }) => (
          <label key={key} className="practice-filter-row">
            <input
              type="checkbox"
              checked={filters[key]}
              onChange={() => toggle(key)}
            />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      <button type="button" className="practice-btn" onClick={onStart}>
        Start
      </button>
      <button
        type="button"
        className="practice-btn practice-btn-ghost"
        onClick={() => onChange({ ...DEFAULT_PRACTICE_FILTERS })}
      >
        Reset filtrów
      </button>
    </div>
  )
}
