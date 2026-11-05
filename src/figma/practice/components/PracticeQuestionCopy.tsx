interface PracticeQuestionCopyProps {
  prompt: string
  hint?: string
}

export function PracticeQuestionCopy({
  prompt,
  hint = 'Wybierz jedną odpowiedź. Ćwiczysz bez limitu czasu.',
}: PracticeQuestionCopyProps) {
  return (
    <div className="fp-question-block">
      <p className="fp-eyebrow">TREŚĆ ZASTĘPCZA · NIEOFICJALNA</p>
      <h2 className="fp-question-title">{prompt}</h2>
      <p className="fp-question-hint">{hint}</p>
    </div>
  )
}
