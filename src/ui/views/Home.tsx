import {
  ACTIVE_CATEGORY,
  LOCKED_CATEGORIES,
} from '../../domain/types.ts'
import { OFFICIAL_PAGE_URL } from '../../domain/constants.ts'
import type { QuestionBank } from '../../domain/question-bank.ts'
import type { ProgressStore } from '../../domain/progress-store.ts'
import { formatCatalogDateLabel } from '../../app/study-app.ts'

interface HomeProps {
  bank: QuestionBank
  progress: ProgressStore
  hasImageOnDevice: (filename: string) => boolean
  onPractice: () => void
  onMistakes: () => void
  onImport: () => void
}

const MOCK_EXAM_LOCK_REASON =
  'Egzamin próbny zgodny z WORD — faza 2 (wymaga wideo i zegarów).'

const NOT_MINISTRY_LINE =
  'To nie jest aplikacja Ministerstwa Infrastruktury ani WORD.'

export function Home({
  bank,
  progress,
  hasImageOnDevice,
  onPractice,
  onMistakes,
  onImport,
}: HomeProps) {
  const meta = bank.getCatalogMeta()
  const totalB = bank.countByCategory(ACTIVE_CATEGORY)
  const missingMedia = bank.countMissingDisplayableMedia(
    ACTIVE_CATEGORY,
    hasImageOnDevice,
  )
  const mistakes = progress.countMistakes(ACTIVE_CATEGORY)
  const hasCatalog = bank.hasCatalog()

  return (
    <div className="stack view-start">
      <header className="stack view-start__hero">
        <p className="eyebrow muted">{NOT_MINISTRY_LINE}</p>
        <h1 className="page-title">Kategoria {ACTIVE_CATEGORY}</h1>
        <p className="muted view-start__lead">
          Nauka offline z oficjalnego katalogu zapisanego na tym urządzeniu — bez
          konta.
        </p>
      </header>

      {hasCatalog ? (
        <section className="card">
          <h2 className="page-title-sm">Stan danych</h2>
          <dl className="data-line">
            <div className="data-line__row">
              <dt>Data katalogu</dt>
              <dd>{formatCatalogDateLabel(meta.lastModified)}</dd>
            </div>
            <div className="data-line__row">
              <dt>Pytania kat. {ACTIVE_CATEGORY} na urządzeniu</dt>
              <dd>{totalB}</dd>
            </div>
            <div className="data-line__row">
              <dt>Bez pliku, który przeglądarka pokaże</dt>
              <dd>{missingMedia}</dd>
            </div>
          </dl>
        </section>
      ) : (
        <div className="banner banner-warning stack">
          <strong>Brak bazy pytań na urządzeniu.</strong>
          <span>
            Pobierz oficjalny plik Excel z gov.pl albo wskaż kopię, którą już masz.
          </span>
          <button type="button" className="btn btn-secondary" onClick={onImport}>
            Przejdź do importu
          </button>
        </div>
      )}

      <nav className="stack view-start__actions" aria-label="Główne działania">
        <button
          type="button"
          className="btn"
          disabled={!hasCatalog}
          onClick={onPractice}
        >
          Ćwicz
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-locked"
          disabled
          title={MOCK_EXAM_LOCK_REASON}
          aria-describedby="mock-exam-hint"
        >
          Egzamin próbny
        </button>
        <p id="mock-exam-hint" className="muted lock-hint">
          {MOCK_EXAM_LOCK_REASON}
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!hasCatalog || mistakes === 0}
          onClick={onMistakes}
        >
          Błędy{mistakes > 0 ? ` (${mistakes})` : ''}
        </button>
      </nav>

      <button type="button" className="btn btn-ghost" onClick={onImport}>
        Katalog i multimedia
      </button>

      <section className="card stack">
        <h2 className="page-title-sm">Inne kategorie</h2>
        <p className="muted">Widoczne, zablokowane do fazy 3.</p>
        <ul className="category-lock-list">
          <li className="category-lock category-lock--active">
            <span className="category-lock__code">{ACTIVE_CATEGORY}</span>
            <span className="category-lock__state">Aktywna</span>
          </li>
          {LOCKED_CATEGORIES.map((item) => (
            <li key={item.code} className="category-lock category-lock--locked">
              <span className="category-lock__code">{item.label}</span>
              <span className="category-lock__state" title={item.reason}>
                Zablokowana
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="muted view-start__footer">
        Materiały pobierasz samodzielnie z{' '}
        <a href={OFFICIAL_PAGE_URL} target="_blank" rel="noreferrer">
          oficjalnej strony Ministerstwa Infrastruktury
        </a>
        . Pytania nie trafiają na serwer.
      </p>
    </div>
  )
}
