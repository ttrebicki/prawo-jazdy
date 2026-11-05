import { useMemo, useState } from 'react'
import type { ProgressStore } from '../../domain/progress-store.ts'
import type { CategoryCode, QuestionRecord } from '../../domain/types.ts'
import {
  formatListDate,
  mistakeCountKicker,
  showRemainingQuestionsLabel,
} from './format.ts'
import { getLastWrongAnswerLabel } from './lastWrongAnswer.ts'
import { MistakeQuestionRow } from './MistakeQuestionRow.tsx'
import arrowLeftUrl from './assets/arrow-left.svg'
import { demoQuestionLabel } from './placeholders.ts'
import iosBatteryUrl from './assets/ios-battery.svg'
import iosSignalUrl from './assets/ios-signal.svg'
import iosWifiUrl from './assets/ios-wifi.svg'
import moreHorizontalUrl from './assets/more-horizontal.svg'
import rotateCcwUrl from './assets/rotate-ccw.svg'
import smartphoneUrl from './assets/smartphone.svg'

const INITIAL_VISIBLE = 4

export interface FigmaMistakesScreenProps {
  progress: ProgressStore
  getQuestion: (number: string) => QuestionRecord | undefined
  onOpenQuestion: (question: QuestionRecord) => void
  onBack: () => void
  category?: CategoryCode
}

export function FigmaMistakesScreen({
  progress,
  getQuestion,
  onOpenQuestion,
  onBack,
  category = 'B',
}: FigmaMistakesScreenProps) {
  const [showAll, setShowAll] = useState(false)

  const mistakeRows = useMemo(() => {
    return progress
      .listMistakes(category)
      .map((entry, index) => {
        const question = getQuestion(entry.number)
        if (!question) {
          return null
        }
        const lastAnswerLabel = getLastWrongAnswerLabel(
          progress,
          entry.number,
          category,
        )
        return {
          key: entry.number,
          question,
          index,
          lastAnswerLabel,
          answeredAt: entry.lastAnsweredAt,
        }
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
  }, [category, getQuestion, progress])

  const listDate = formatListDate(mistakeRows[0]?.answeredAt)
  const visibleRows = showAll ? mistakeRows : mistakeRows.slice(0, INITIAL_VISIBLE)
  const hiddenCount = Math.max(mistakeRows.length - INITIAL_VISIBLE, 0)

  return (
    <div className="figma-mistakes-root" data-node-id="5:3832">
      <div className="figma-mistakes-status-bar" data-node-id="5:3833" aria-hidden="true">
        <p className="figma-mistakes-status-time">9:41</p>
        <div className="figma-mistakes-status-icons">
          <img
            className="figma-mistakes-icon-18"
            src={iosSignalUrl}
            alt=""
            width={18}
            height={18}
          />
          <img
            className="figma-mistakes-icon-18"
            src={iosWifiUrl}
            alt=""
            width={18}
            height={18}
          />
          <img
            className="figma-mistakes-icon-battery"
            src={iosBatteryUrl}
            alt=""
            width={25}
            height={18}
          />
        </div>
      </div>

      <header className="figma-mistakes-header" data-node-id="5:3839">
        <button
          type="button"
          className="figma-mistakes-back"
          onClick={onBack}
          aria-label="Wróć"
        >
          <img src={arrowLeftUrl} alt="" width={18} height={18} />
        </button>
        <h1 className="figma-mistakes-header-title">Błędy</h1>
        <button
          type="button"
          className="figma-mistakes-header-more"
          aria-label="Więcej opcji"
        >
          <img src={moreHorizontalUrl} alt="" width={20} height={20} />
        </button>
      </header>

      <div className="figma-mistakes-content" data-node-id="5:3844">
        <div className="figma-mistakes-intro" data-node-id="5:3845">
          <p className="figma-mistakes-kicker">
            {mistakeCountKicker(mistakeRows.length, category)}
          </p>
          <h2 className="figma-mistakes-heading">Wróć do tego, co trudne</h2>
          <p className="figma-mistakes-lead">
            Pytania, na które ostatnio odpowiadasz błędnie. Kolejna poprawna
            odpowiedź usunie pytanie z listy.
          </p>
        </div>

        <div className="figma-mistakes-info" data-node-id="5:3849">
          <span className="figma-mistakes-info-icon" aria-hidden="true">
            <img src={rotateCcwUrl} alt="" width={18} height={18} />
          </span>
          <div className="figma-mistakes-info-copy">
            <p className="figma-mistakes-info-title">Te same ćwiczenia, więcej uwagi</p>
            <p className="figma-mistakes-info-text">
              Dotknij pytania, aby otworzyć je w zwykłym widoku ćwiczeń — z
              odpowiedziami i przyciskiem Dlaczego.
            </p>
          </div>
        </div>

        <div className="figma-mistakes-list-block" data-node-id="5:3854">
          {mistakeRows.length === 0 ? (
            <p className="figma-mistakes-empty">
              Brak zapisanych błędów. Ćwicz dalej — lista wypełni się po
              niepoprawnej odpowiedzi.
            </p>
          ) : (
            <>
              <div className="figma-mistakes-list-meta" data-node-id="5:3855">
                <p>OSTATNIO BŁĘDNIE</p>
                {listDate ? <p>{listDate}</p> : null}
              </div>
              {visibleRows.map((row) => (
                <MistakeQuestionRow
                  key={row.key}
                  question={row.question}
                  listIndex={row.index}
                  lastAnswerLabel={row.lastAnswerLabel}
                  onOpen={onOpenQuestion}
                />
              ))}
            </>
          )}
        </div>

        {!showAll && hiddenCount > 0 ? (
          <button
            type="button"
            className="figma-mistakes-show-more"
            onClick={() => setShowAll(true)}
          >
            {showRemainingQuestionsLabel(hiddenCount)}
          </button>
        ) : null}

        <p className="figma-mistakes-footnote" data-node-id="5:3892">
          Lista pokazowa. Wszystkie treści są zastępcze.
        </p>

        <div className="figma-mistakes-privacy" data-node-id="5:3893">
          <img src={smartphoneUrl} alt="" width={14} height={14} />
          <p>Bez konta. Postępy tylko na tym telefonie.</p>
        </div>
      </div>

      <div className="figma-mistakes-home-indicator" data-node-id="5:3896" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

export type OpenMistakeInPractice = FigmaMistakesScreenProps['onOpenQuestion']

/** Re-export for callers wiring practice without importing domain types twice. */
export type { QuestionRecord }

export function figmaMistakesDemoLabel(number: string): string {
  return demoQuestionLabel(number)
}
