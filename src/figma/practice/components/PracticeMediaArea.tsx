import type { FigmaPracticeAssets } from '../assets.ts'

interface PracticeMediaCardProps {
  assets: FigmaPracticeAssets
  mediaUrl?: string | null
  status?: string | null
  video?: boolean
}

export function PracticeMediaCard({ assets, mediaUrl, status, video = false }: PracticeMediaCardProps) {
  const stage = video || Boolean(mediaUrl)
  return (
    <div className={stage ? 'fp-media-card fp-media-card--stage' : 'fp-media-card'} aria-live="polite">
      {mediaUrl && video ? (
        <video src={mediaUrl} controls playsInline preload="metadata" />
      ) : mediaUrl ? (
        <img src={mediaUrl} alt="Materiał poglądowy do pytania" />
      ) : (
        <>
          <div className="fp-media-symbol">
            <img className="fp-icon fp-icon--25" src={assets.image} alt="" />
          </div>
          <p className="fp-media-title">{video ? 'Klip' : 'Materiał poglądowy'}</p>
          <p className="fp-media-sub">{status ?? 'Makieta · bez sytuacji drogowej'}</p>
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
