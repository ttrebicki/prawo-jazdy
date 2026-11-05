import { useMemo } from 'react'
import { ACTIVE_CATEGORY } from '../../domain/types.ts'
import { useFigmaLayout } from '../layout/FigmaLayoutContext.tsx'
import {
  MOCK_EXAM_LOCK_REASON,
  START_LOCKED_CATEGORY_CODES,
  START_LOCKED_CATEGORY_REASON,
} from './lockedCategories.ts'
import {
  START_SAMPLE_MISTAKES,
  START_SAMPLE_PRACTICE_ANSWERS,
  buildStartCatalogLineOne,
  buildStartCatalogLineTwo,
} from './sampleCopy.ts'
import { getStartThemeAssets } from './themeAssets.ts'
import type { StartScreenProps } from './types.ts'

const countFormat = new Intl.NumberFormat('pl-PL')

function Icon({ src, size = 16 }: { src: string; size?: number }) {
  return <img src={src} alt="" width={size} height={size} />
}

/** Desktop · Start · kategoria B (15:12180) / Tablet · Start · kategoria B (15:13148) */
export function StartWideScreen({
  bank,
  hasImageOnDevice,
  onPractice,
  onMistakes,
  onImport,
  onImportMedia,
  onMockExam,
  theme,
}: StartScreenProps) {
  const { isDesktop } = useFigmaLayout()
  const assets = useMemo(() => getStartThemeAssets(theme), [theme])

  const meta = bank.getCatalogMeta()
  const totalB = bank.countByCategory(ACTIVE_CATEGORY)
  const missingMedia = bank.countMissingDisplayableMedia(
    ACTIVE_CATEGORY,
    hasImageOnDevice,
  )

  const catalogLineOne = useMemo(
    () => buildStartCatalogLineOne(meta.lastModified),
    [meta.lastModified],
  )

  const catalogLineTwoParts = useMemo(() => {
    const line = buildStartCatalogLineTwo(totalB, missingMedia, countFormat)
    const match = line.match(/^([\d\s]+)\s+(pytań B)\s+·\s+([\d\s]+)\s+(.*)$/)
    if (match) {
      return {
        questionsValue: match[1].trim(),
        questionsLabel: match[2],
        mediaValue: match[3].trim(),
        mediaLabel: match[4],
      }
    }
    return null
  }, [missingMedia, totalB])

  const openMediaImport = onImportMedia ?? onImport

  return (
    <div
      className="figma-wide__content"
      data-node-id={isDesktop ? '15:12180' : '15:13148'}
      data-name={
        isDesktop
          ? 'Desktop · Start · kategoria B'
          : 'Tablet · Start · kategoria B'
      }
    >
      <div className="figma-wide__intro-block">
        <p className="figma-wide__intro-eyebrow">TWOJA TEORIA, W SWOIM TEMPIE</p>
        <h1 className="figma-wide__intro-title">Spokojnie. Dasz radę.</h1>
      </div>

      <div className="figma-wide__columns">
        <section className="figma-wide__card" aria-label="Wybrana kategoria B">
          <div className="figma-wide__category-row">
            <div className="figma-wide__category-badge">
              <p className="figma-wide__category-badge-letter">B</p>
            </div>
            <div>
              <p className="figma-wide__category-name">Samochód osobowy</p>
              <p className="figma-wide__category-selected">✓ Wybrana kategoria</p>
            </div>
          </div>
          <button
            type="button"
            className="figma-wide__btn-primary"
            onClick={onPractice}
          >
            Ćwicz
            <Icon src={assets.arrowRight} size={20} />
          </button>
          <div className="figma-wide__stats-row">
            <p className="figma-wide__stats-muted">{START_SAMPLE_PRACTICE_ANSWERS}</p>
            <p className="figma-wide__stats-strong">{START_SAMPLE_MISTAKES}</p>
          </div>
          <hr className="figma-wide__divider" />
          <div className="figma-wide__modes-row">
            <span
              className="figma-wide__mode"
              title={MOCK_EXAM_LOCK_REASON}
              role={onMockExam ? 'button' : undefined}
              tabIndex={onMockExam ? 0 : undefined}
              onClick={onMockExam}
              onKeyDown={
                onMockExam
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onMockExam()
                      }
                    }
                  : undefined
              }
            >
              <Icon src={assets.lockKeyhole} />
              Egzamin próbny
            </span>
            <button
              type="button"
              className="figma-wide__mode figma-wide__mode--accent"
              onClick={onMistakes}
            >
              <Icon src={assets.rotateCcw} />
              Błędy
            </button>
          </div>
        </section>

        <section
          className="figma-wide__card figma-wide__card--catalog"
          aria-label="Katalog na urządzeniu"
        >
          <div className="figma-wide__catalog-head">
            <p className="figma-wide__catalog-title">Katalog na urządzeniu</p>
            {isDesktop ? (
              <Icon src={assets.imagePlus} size={20} />
            ) : null}
          </div>
          <p className="figma-wide__catalog-meta">{catalogLineOne}</p>
          {catalogLineTwoParts ? (
            <div className="figma-wide__catalog-stats">
              <div>
                <p className="figma-wide__catalog-stat-value">
                  {catalogLineTwoParts.questionsValue}
                </p>
                <p className="figma-wide__catalog-stat-label">
                  {catalogLineTwoParts.questionsLabel}
                </p>
              </div>
              <div>
                <p className="figma-wide__catalog-stat-value">
                  {catalogLineTwoParts.mediaValue}
                </p>
                <p className="figma-wide__catalog-stat-label">
                  {catalogLineTwoParts.mediaLabel}
                </p>
              </div>
            </div>
          ) : (
            <p className="figma-wide__catalog-meta">
              {buildStartCatalogLineTwo(totalB, missingMedia, countFormat)}
            </p>
          )}
          <button
            type="button"
            className="figma-wide__btn-outline"
            onClick={onImport}
          >
            Importuj katalog
            <Icon src={assets.arrowRight} size={20} />
          </button>
          <button
            type="button"
            className="figma-wide__link"
            onClick={openMediaImport}
          >
            Uzupełnij materiały multimedialne →
          </button>
        </section>
      </div>

      <section aria-labelledby="wide-other-categories">
        <p className="figma-wide__section-title" id="wide-other-categories">
          Pozostałe kategorie
        </p>
        <div className="figma-wide__category-grid">
          {START_LOCKED_CATEGORY_CODES.map((code) => (
            <div key={code} className="figma-wide__category-tile">
              <div className="figma-wide__category-tile-head">
                <p className="figma-wide__category-tile-code">{code}</p>
                <Icon src={assets.lockKeyholeSm} size={14} />
              </div>
              <p className="figma-wide__category-tile-reason">
                {START_LOCKED_CATEGORY_REASON}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
