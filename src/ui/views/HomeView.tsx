import {
  ACTIVE_CATEGORY,
  LOCKED_CATEGORIES,
} from '../../domain/types.ts'
import type { QuestionBank } from '../../domain/question-bank.ts'
import type { ProgressStore } from '../../domain/progress-store.ts'

interface HomeViewProps {
  bank: QuestionBank
  progress: ProgressStore
  hasImageOnDevice: (filename: string) => boolean
  onPractice: () => void
  onMistakes: () => void
  onImport: () => void
}

export function HomeView({
  bank,
  progress,
  hasImageOnDevice,
  onPractice,
  onMistakes,
  onImport,
}: HomeViewProps) {
  const meta = bank.getCatalogMeta()
  const totalB = bank.countByCategory(ACTIVE_CATEGORY)
  const missingMedia = bank.countMissingDisplayableMedia(
    ACTIVE_CATEGORY,
    hasImageOnDevice,
  )
  const seen = progress.countSeen(ACTIVE_CATEGORY)
  const mistakes = progress.countMistakes(ACTIVE_CATEGORY)
  const hasCatalog = bank.hasCatalog()

  return (
    <div className="stack">
      <header className="stack">
        <p className="muted">Nauka na urządzeniu · nie jest produktem WORD ani MI</p>
        <h1 className="page-title">Kategoria {ACTIVE_CATEGORY}</h1>
        {hasCatalog ? (
          <p className="muted">
            Katalog: {meta.filename ?? '—'}
            {meta.lastModified ? ` · ${meta.lastModified}` : ''}
            <br />
            Pytania {ACTIVE_CATEGORY} na urządzeniu: {totalB}
            <br />
            Bez pliku do wyświetlenia: {missingMedia}
            <br />
            Zobaczone: {seen} · Błędy: {mistakes}
          </p>
        ) : (
          <div className="banner banner-warning">
            <strong>Brak bazy pytań.</strong> Pobierz oficjalny plik Excel z gov.pl
            albo wskaż kopię zapisaną na urządzeniu.
          </div>
        )}
      </header>

      <div className="stack">
        <button
          type="button"
          className="btn"
          disabled={!hasCatalog}
          onClick={onPractice}
        >
          Ćwicz
        </button>
        <button type="button" className="btn btn-secondary" disabled>
          Egzamin próbny (wkrótce)
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!hasCatalog || mistakes === 0}
          onClick={onMistakes}
        >
          Błędy ({mistakes})
        </button>
        <button type="button" className="btn btn-ghost" onClick={onImport}>
          Pobierz / wskaż katalog
        </button>
      </div>

      <section className="card stack">
        <h2 className="page-title-sm">Inne kategorie</h2>
        <div className="chip-row">
          <span className="chip">{ACTIVE_CATEGORY} · aktywna</span>
          {LOCKED_CATEGORIES.map((item) => (
            <span
              key={item.code}
              className="chip chip-locked"
              title={item.reason}
            >
              {item.label} · zablokowana
            </span>
          ))}
        </div>
      </section>

      <p className="muted">
        Oficjalne materiały pobierasz samodzielnie z{' '}
        <a href="https://www.gov.pl/web/infrastruktura/prawo-jazdy" target="_blank" rel="noreferrer">
          strony Ministerstwa Infrastruktury
        </a>
        . Aplikacja nie wysyła pytań na serwer.
      </p>
    </div>
  )
}
