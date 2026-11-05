interface PracticeMetaProgressProps {
  questionLabel: string
  progressLabel: string
  progressRatio: number
  categoryCode?: string
}

export function PracticeMetaProgress({
  questionLabel,
  progressLabel,
  progressRatio,
  categoryCode = 'B',
}: PracticeMetaProgressProps) {
  const clamped = Math.min(1, Math.max(0, progressRatio))
  const fillWidth = `${clamped * 100}%`

  return (
    <div className="fp-meta-block">
      <div className="fp-meta-row">
        <div className="fp-meta-id">
          <span className="fp-category-pill">{categoryCode}</span>
          <p className="fp-meta-label">{questionLabel}</p>
        </div>
        <p className="fp-meta-progress">{progressLabel}</p>
      </div>
      <div className="fp-progress-track">
        <div className="fp-progress-fill" style={{ width: fillWidth }} />
      </div>
    </div>
  )
}
