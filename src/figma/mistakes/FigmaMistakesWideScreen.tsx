import { useMemo, useState } from 'react'
import { useFigmaLayout } from '../layout/FigmaLayoutContext.tsx'
import type { FigmaMistakesScreenProps } from './FigmaMistakesScreen.tsx'
import {
  formatListDate,
  mistakeCountKicker,
  showRemainingQuestionsLabel,
  answerTypeLabel,
} from './format.ts'
import { getLastWrongAnswerLabel } from './lastWrongAnswer.ts'
import { demoQuestionLabel, placeholderPrompt } from './placeholders.ts'
import rotateCcwUrl from './assets/rotate-ccw.svg'
import chevronRightUrl from './assets/chevron-right.svg'

const INITIAL_VISIBLE = 4

/** Desktop · Błędy · lista pytań kategorii B (15:12776) / Tablet · Błędy (15:13747) */
export function FigmaMistakesWideScreen({
  progress,
  getQuestion,
  onOpenQuestion,
  category = 'B',
}: FigmaMistakesScreenProps) {
  const { isDesktop } = useFigmaLayout()
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
    <div
      className="figma-wide__content"
      data-node-id={isDesktop ? '15:12776' : '15:13747'}
      data-name={
        isDesktop
          ? 'Desktop · Błędy · lista pytań kategorii B'
          : 'Tablet · Błędy · lista pytań kategorii B'
      }
    >
      <div className="figma-wide__intro-block">
        <p className="figma-wide__intro-eyebrow">
          {mistakeCountKicker(mistakeRows.length, category)}
        </p>
        <h1 className="figma-wide__intro-title">Wróć do tego, co trudne</h1>
        <p className="figma-wide__intro-lead">
          Pytania, na które ostatnio odpowiadasz błędnie. Kolejna poprawna odpowiedź
          usunie pytanie z listy.
        </p>
      </div>

      <div className="figma-wide__callout">
        <img src={rotateCcwUrl} alt="" width={20} height={20} />
        <div>
          <p className="figma-wide__callout-title">Te same ćwiczenia, więcej uwagi</p>
          <p className="figma-wide__callout-text">
            Wybierz pytanie, aby otworzyć je w zwykłym widoku ćwiczeń — z odpowiedziami
            i przyciskiem Dlaczego.
          </p>
        </div>
      </div>

      {mistakeRows.length === 0 ? (
        <p className="figma-wide__hint">
          Brak zapisanych błędów. Ćwicz dalej — lista wypełni się po niepoprawnej
          odpowiedzi.
        </p>
      ) : (
        <section className="figma-wide__mistakes-list" aria-label="Lista błędów">
          <div className="figma-wide__mistakes-list-meta">
            <p>OSTATNIO BŁĘDNIE</p>
            {listDate ? <p>{listDate}</p> : null}
          </div>
          {visibleRows.map((row) => (
            <button
              key={row.key}
              type="button"
              className="figma-wide__mistake-row"
              onClick={() => onOpenQuestion(row.question)}
            >
              <div className="figma-wide__mistake-row-body">
                <div className="figma-wide__mistake-row-meta">
                  <p className="figma-wide__mistake-row-id">
                    {demoQuestionLabel(row.question.number)}
                  </p>
                  <p className="figma-wide__mistake-row-type">
                    {answerTypeLabel(row.question.scope)}
                  </p>
                </div>
                <p className="figma-wide__mistake-row-prompt">
                  {placeholderPrompt(row.index)}
                </p>
                <p className="figma-wide__mistake-row-status">
                  {row.lastAnswerLabel
                    ? `Ostatnio: ${row.lastAnswerLabel} · niepoprawnie`
                    : 'Ostatnio: niepoprawnie'}
                </p>
              </div>
              <img src={chevronRightUrl} alt="" width={18} height={18} />
            </button>
          ))}
        </section>
      )}

      {!showAll && hiddenCount > 0 ? (
        <button
          type="button"
          className="figma-wide__btn-outline"
          onClick={() => setShowAll(true)}
        >
          {showRemainingQuestionsLabel(hiddenCount)}
        </button>
      ) : null}

      <p className="figma-wide__hint">
        Lista pokazowa. Wszystkie treści są zastępcze.
      </p>
    </div>
  )
}
