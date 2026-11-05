import { useCallback, useEffect, useMemo, useState } from 'react'
import { studyApp } from './app/study-app.ts'
import {
  DEFAULT_PRACTICE_FILTERS,
  type PracticeFilters,
  type QuestionRecord,
} from './domain/types.ts'
import { ImportMediaFlow } from './figma/import-media/index.ts'
import { runMediaImportSave } from './figma/import-media/run-media-import-save.ts'
import { ImportWorkbookFlow } from './figma/import-workbook/index.ts'
import { FigmaMistakesScreen } from './figma/mistakes/index.ts'
import { EgzaminProbnyNiedostepnyMock } from './figma/mock/index.ts'
import { FigmaPracticeQuestionView } from './figma/practice/index.ts'
import { StartScreen } from './figma/start/index.ts'
import { useOnline } from './hooks/useOnline.ts'
import {
  practiceDepsFromStudyApp,
  usePracticeSession,
} from './practice/index.ts'
import {
  VIEW_HOME,
  VIEW_IMPORT_MEDIA,
  VIEW_IMPORT_WORKBOOK,
  VIEW_MISTAKES,
  VIEW_MOCK,
  VIEW_PRACTICE,
  type AppView,
} from './ui/navigation.ts'

function App() {
  const online = useOnline()
  const [ready, setReady] = useState(false)
  const [view, setView] = useState<AppView>(VIEW_HOME)
  const [filters] = useState<PracticeFilters>(DEFAULT_PRACTICE_FILTERS)
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

  const startPractice = useCallback(() => {
    const q = pickQuestion()
    if (!q) {
      window.alert('Brak pytań dla wybranych filtrów.')
      return
    }
    setCurrentQuestion(q)
    setView(VIEW_PRACTICE)
  }, [pickQuestion])

  const handleNext = useCallback(
    (previous: QuestionRecord) => {
      const next = pickQuestion(previous.number)
      if (!next) {
        window.alert('To było ostatnie pytanie w tym filtrze.')
        setView(VIEW_HOME)
        setCurrentQuestion(null)
        refresh()
        return
      }
      setCurrentQuestion(next)
    },
    [pickQuestion, refresh],
  )

  if (!ready) {
    return <p className="figma-start__privacy-text">Ładowanie danych z urządzenia…</p>
  }

  switch (view) {
    case VIEW_IMPORT_WORKBOOK:
      return (
        <ImportWorkbookFlow
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
          onContinueToMedia={() => setView(VIEW_IMPORT_MEDIA)}
          onGoToPractice={startPractice}
        />
      )
    case VIEW_IMPORT_MEDIA:
      return (
        <ImportMediaFlow
          online={online}
          onBack={() => {
            setView(VIEW_HOME)
            refresh()
          }}
          onSkipPractice={startPractice}
          onStartPractice={startPractice}
          onBackToStart={() => {
            setView(VIEW_HOME)
            refresh()
          }}
          onSave={(payload) => runMediaImportSave(studyApp, payload)}
        />
      )
    case VIEW_PRACTICE:
      return currentQuestion ? (
        <FigmaPracticeQuestionView
          deps={practiceDeps}
          question={currentQuestion}
          questionIndex={1}
          questionTotal={Math.max(
            1,
            practiceDeps.bank.countByCategory(practiceDeps.category),
          )}
          onNext={handleNext}
          onBack={() => {
            setView(VIEW_HOME)
            setCurrentQuestion(null)
            refresh()
          }}
        />
      ) : null
    case VIEW_MISTAKES:
      return (
        <FigmaMistakesScreen
          progress={studyApp.progress}
          getQuestion={(number) => studyApp.bank.getByNumber(number)}
          onOpenQuestion={(q) => {
            setCurrentQuestion(q)
            setView(VIEW_PRACTICE)
          }}
          onBack={() => setView(VIEW_HOME)}
        />
      )
    case VIEW_MOCK:
      return (
        <EgzaminProbnyNiedostepnyMock
          onBack={() => setView(VIEW_HOME)}
          onPractice={startPractice}
          onHome={() => setView(VIEW_HOME)}
        />
      )
    case VIEW_HOME:
    default:
      return (
        <StartScreen
          bank={studyApp.bank}
          progress={studyApp.progress}
          hasImageOnDevice={studyApp.hasImageOnDevice}
          onPractice={startPractice}
          onMistakes={() => setView(VIEW_MISTAKES)}
          onImport={() => setView(VIEW_IMPORT_WORKBOOK)}
          onImportMedia={() => setView(VIEW_IMPORT_MEDIA)}
          onMockExam={() => setView(VIEW_MOCK)}
        />
      )
  }
}

export default App
