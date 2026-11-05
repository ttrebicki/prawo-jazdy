import type { FigmaPracticeAssets } from '../assets.ts'

interface PracticeWhyPanelProps {
  assets: FigmaPracticeAssets
  text: string
  expanded: boolean
  onToggle: () => void
}

export function PracticeWhyPanel({
  assets,
  text,
  expanded,
  onToggle,
}: PracticeWhyPanelProps) {
  if (expanded) {
    return (
      <section className="fp-why-card" aria-labelledby="fp-why-title">
        <button
          type="button"
          className="fp-why-header"
          aria-expanded="true"
          onClick={onToggle}
        >
          <img className="fp-icon fp-icon--18" src={assets.circleHelp} alt="" />
          <h2 id="fp-why-title" className="fp-why-title">
            Dlaczego
          </h2>
          <img className="fp-icon fp-icon--16" src={assets.chevronUp} alt="" />
        </button>
        <p className="fp-why-text">{text}</p>
      </section>
    )
  }

  return (
    <button
      type="button"
      className="fp-why-toggle"
      aria-expanded="false"
      onClick={onToggle}
    >
      Dlaczego
      <img className="fp-icon fp-icon--18" src={assets.chevronDown} alt="" />
    </button>
  )
}
