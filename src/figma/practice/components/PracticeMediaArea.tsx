import type { FigmaPracticeAssets } from '../assets.ts'

interface PracticeMediaCardProps {
  assets: FigmaPracticeAssets
  mediaUrl?: string | null
}

export function PracticeMediaCard({ assets, mediaUrl }: PracticeMediaCardProps) {
  return (
    <div className="fp-media-card">
      {mediaUrl ? (
        <img src={mediaUrl} alt="Materiał poglądowy do pytania" />
      ) : (
        <>
          <div className="fp-media-symbol">
            <img className="fp-icon fp-icon--25" src={assets.image} alt="" />
          </div>
          <p className="fp-media-title">Materiał poglądowy</p>
          <p className="fp-media-sub">Makieta · bez sytuacji drogowej</p>
        </>
      )}
    </div>
  )
}

interface PracticeTextOnlyHintProps {
  assets: FigmaPracticeAssets
}

export function PracticeTextOnlyHint({ assets }: PracticeTextOnlyHintProps) {
  return (
    <div className="fp-text-only-hint">
      <img className="fp-icon fp-icon--16" src={assets.text} alt="" />
      <p>Pytanie tekstowe · bez materiału</p>
    </div>
  )
}
