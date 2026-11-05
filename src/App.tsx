import { useCallback, useEffect, useState } from 'react'
import { studyApp } from './app/study-app.ts'
import { useOnline } from './hooks/useOnline.ts'
import {
  ACTIVE_CATEGORY,
  DEFAULT_PRACTICE_FILTERS,
  type PracticeFilters,
  type QuestionRecord,
} from './domain/types.ts'
import {
  VIEW_HOME,
  VIEW_IMPORT,
  VIEW_MISTAKES,
  VIEW_PRACTICE,
  VIEW_PRACTICE_SETUP,
  type AppView,
} from './ui/navigation.ts'
import { HomeView } from './ui/views/HomeView.tsx'
import { ImportView } from './ui/views/ImportView.tsx'
import { MistakesView } from './ui/views/MistakesView.tsx'
import { PracticeQuestionView } from './ui/views/PracticeQuestionView.tsx'
import { PracticeSetupView } from './ui/views/PracticeSetupView.tsx'

function App() {
  const online = useOnline()
  const [ready, setReady] = useState(false)
  const [view, setView] = useState<AppView>(VIEW_HOME)
  const [filters, setFilters] = useState<PracticeFilters>(DEFAULT_PRACTICE_FILTERS)
  const [currentQuestion, setCurrentQuestion] = useState<QuestionRecord | null>(
    null,
  )
  const [, tick] = useState(0)

  const refresh = useCallback(() => tick((n) => n + 1), [])

  useEffect(() => {
    void (async () => {
      await studyApp.hydrate()
      await studyApp.refreshMediaIndex()
      setReady(true)
    })()
  }, [])

  const pickQuestion = useCallback(
    (exclude?: string): QuestionRecord | null => {
      const progressMap = studyApp.progress.asMap(ACTIVE_CATEGORY)
      const candidates = studyApp.bank.filterPracticeCandidates(
        ACTIVE_CATEGORY,
        filters,
        progressMap,
        studyApp.hasImageOnDevice,
      )
      return studyApp.bank.pickRandom(candidates, exclude)
    },
    [filters],
  )

  const startPractice = () => {
    const q = pickQuestion()
    if (!q) {
      window.alert('Brak pytań dla wybranych filtrów.')
      return
    }
    setCurrentQuestion(q)
    setView(VIEW_PRACTICE)
  }

  const handleNext = (previous: QuestionRecord) => {
    const next = pickQuestion(previous.number)
    if (!next) {
      window.alert('To było ostatnie pytanie w tym filtrze.')
      setView(VIEW_HOME)
      setCurrentQuestion(null)
      refresh()
      return
    }
    setCurrentQuestion(next)
  }

  if (!ready) {
    return (
      <div className="app-shell">
        <p className="muted">Ładowanie danych z urządzenia…</p>
      </div>
    )
  }

  let content = null
  switch (view) {
    case VIEW_IMPORT:
      content = (
        <ImportView
          online={online}
          onBack={() => {
            setView(VIEW_HOME)
            refresh()
          }}
          onImportWorkbook={async (buffer, meta) => {
            const stats = await studyApp.importWorkbook(buffer, meta)
            await studyApp.refreshMediaIndex()
            refresh()
            return stats
          }}
          onImportMediaZip={async (file) => {
            const result = await studyApp.importMediaZip(file)
            refresh()
            return result
          }}
        />
      )
      break
    case VIEW_PRACTICE_SETUP:
      content = (
        <PracticeSetupView
          filters={filters}
          onChange={setFilters}
          onStart={startPractice}
          onBack={() => setView(VIEW_HOME)}
        />
      )
      break
    case VIEW_PRACTICE:
      content = currentQuestion ? (
        <PracticeQuestionView
          app={studyApp}
          question={currentQuestion}
          onNext={handleNext}
          onBack={() => {
            setView(VIEW_HOME)
            setCurrentQuestion(null)
            refresh()
          }}
        />
      ) : null
      break
    case VIEW_MISTAKES:
      content = (
        <MistakesView
          progress={studyApp.progress}
          getQuestion={(n) => studyApp.bank.getByNumber(n)}
          onOpen={(q) => {
            setCurrentQuestion(q)
            setView(VIEW_PRACTICE)
          }}
          onBack={() => setView(VIEW_HOME)}
        />
      )
      break
    case VIEW_HOME:
    default:
      content = (
        <HomeView
          bank={studyApp.bank}
          progress={studyApp.progress}
          hasImageOnDevice={studyApp.hasImageOnDevice}
          onPractice={() => setView(VIEW_PRACTICE_SETUP)}
          onMistakes={() => setView(VIEW_MISTAKES)}
          onImport={() => setView(VIEW_IMPORT)}
        />
      )
  }

  return (
    <div className="app-shell stack">
      {!online && view !== VIEW_IMPORT && (
        <div className="banner banner-warning">
          Tryb offline — korzystasz z katalogu zapisanego na urządzeniu.
        </div>
      )}
      {content}
    </div>
  )
}

export default App
