import { useCallback, useEffect, useMemo, useState } from 'react'
import { studyApp } from './app/study-app.ts'
import { useOnline } from './hooks/useOnline.ts'
import {
  DEFAULT_PRACTICE_FILTERS,
  type PracticeFilters,
  type QuestionRecord,
} from './domain/types.ts'
import {
  PracticeMistakesView,
  PracticeQuestionView,
  PracticeSetupView,
  practiceDepsFromStudyApp,
  usePracticeSession,
} from './practice/index.ts'
import {
  VIEW_HOME,
  VIEW_IMPORT,
  VIEW_MISTAKES,
  VIEW_PRACTICE,
  VIEW_PRACTICE_SETUP,
  type AppView,
} from './ui/navigation.ts'
import { Home } from './ui/views/Home.tsx'
import { Import } from './ui/views/Import.tsx'

function App() {
  const online = useOnline()
  const [ready, setReady] = useState(false)
  const [view, setView] = useState<AppView>(VIEW_HOME)
  const [filters, setFilters] = useState<PracticeFilters>(DEFAULT_PRACTICE_FILTERS)
  const [currentQuestion, setCurrentQuestion] = useState<QuestionRecord | null>(
    null,
  )
  const [, tick] = useState(0)

  const practiceDeps = useMemo(() => practiceDepsFromStudyApp(studyApp), [])
  const { pickQuestion } = usePracticeSession(practiceDeps, filters)

  const refresh = useCallback(() => tick((n) => n + 1), [])

  useEffect(() => {
    void (async () => {
      await studyApp.hydrate()
      await studyApp.refreshMediaIndex()
      setReady(true)
    })()
  }, [])

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
        <Import
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
          deps={practiceDeps}
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
        <PracticeMistakesView
          deps={practiceDeps}
          onOpenQuestion={(q) => {
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
        <Home
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
