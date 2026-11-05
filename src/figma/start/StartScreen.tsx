import { useCallback, useMemo } from 'react'
import { ACTIVE_CATEGORY } from '../../domain/types.ts'
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
import './start.css'
import { getStartThemeAssets } from './themeAssets.ts'
import type { StartScreenProps } from './types.ts'

const countFormat = new Intl.NumberFormat('pl-PL')

interface IconProps {
  src: string
  sizeClass: string
}

function StartIcon({ src, sizeClass }: IconProps) {
  return (
    <span className={`figma-start__icon ${sizeClass}`}>
      <img src={src} alt="" />
    </span>
  )
}

export function StartScreen({
  bank,
  progress: _progress,
  hasImageOnDevice,
  onPractice,
  onMistakes,
  onImport,
  onImportMedia,
  onMockExam,
  theme,
  onThemeChange,
}: StartScreenProps) {
  void _progress

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

  const catalogLineTwo = useMemo(
    () => buildStartCatalogLineTwo(totalB, missingMedia, countFormat),
    [missingMedia, totalB],
  )

  const toggleTheme = useCallback(() => {
    onThemeChange(theme === 'light' ? 'dark' : 'light')
  }, [onThemeChange, theme])

  const openMediaImport = onImportMedia ?? onImport

  return (
    <div className="figma-start" data-theme={theme}>
      <header className="figma-start__header">
        <div className="figma-start__logo" aria-hidden="true">
          <StartIcon src={assets.route} sizeClass="figma-start__icon--18" />
        </div>
        <p className="figma-start__brand">dobry kierunek</p>
        <button
          type="button"
          className="figma-start__theme-toggle"
          onClick={toggleTheme}
          aria-label={
            theme === 'light'
              ? 'Włącz motyw ciemny'
              : 'Włącz motyw jasny'
          }
        >
          <StartIcon
            src={assets.themeToggle}
            sizeClass="figma-start__icon--20"
          />
        </button>
      </header>

      <main className="figma-start__body">
        <section className="figma-start__intro" aria-labelledby="start-intro">
          <p className="figma-start__intro-eyebrow" id="start-intro">
            TWOJA TEORIA, W SWOIM TEMPIE
          </p>
          <div className="figma-start__intro-title">
            <p>Spokojnie.</p>
            <p>Dasz radę.</p>
          </div>
        </section>

        <section
          className="figma-start__card"
          aria-label="Wybrana kategoria B"
        >
          <div className="figma-start__category-row">
            <div className="figma-start__category-badge">
              <p className="figma-start__category-letter">B</p>
            </div>
            <div className="figma-start__category-copy">
              <p className="figma-start__category-name">Samochód osobowy</p>
              <div className="figma-start__category-selected">
                <StartIcon
                  src={assets.circleCheck}
                  sizeClass="figma-start__icon--14"
                />
                <p className="figma-start__category-selected-label">
                  Wybrana kategoria
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="figma-start__practice-btn"
            onClick={onPractice}
          >
            Ćwicz
            <StartIcon
              src={assets.arrowRight}
              sizeClass="figma-start__icon--18"
            />
          </button>

          <div className="figma-start__stats">
            <p className="figma-start__stats-muted">
              {START_SAMPLE_PRACTICE_ANSWERS}
            </p>
            <p className="figma-start__stats-strong">{START_SAMPLE_MISTAKES}</p>
          </div>

          <hr className="figma-start__divider" />

          <div className="figma-start__modes">
            <span
              className="figma-start__mode figma-start__mode--grow figma-start__mode--locked"
              title={MOCK_EXAM_LOCK_REASON}
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
              role={onMockExam ? 'button' : undefined}
              tabIndex={onMockExam ? 0 : undefined}
            >
              <StartIcon
                src={assets.lockKeyhole}
                sizeClass="figma-start__icon--16"
              />
              Egzamin próbny
            </span>
            <button
              type="button"
              className="figma-start__mode figma-start__mode--accent"
              onClick={onMistakes}
            >
              <StartIcon
                src={assets.rotateCcw}
                sizeClass="figma-start__icon--16"
              />
              Błędy
            </button>
          </div>
        </section>

        <section
          className="figma-start__catalog"
          aria-label="Katalog na telefonie"
        >
          <div className="figma-start__catalog-head">
            <p className="figma-start__catalog-title">Katalog na telefonie</p>
            <button
              type="button"
              className="figma-start__link-btn"
              onClick={onImport}
            >
              Importuj →
            </button>
          </div>
          <div className="figma-start__catalog-meta">
            <p>{catalogLineOne}</p>
            <p>{catalogLineTwo}</p>
          </div>
          <button
            type="button"
            className="figma-start__media-link"
            onClick={openMediaImport}
          >
            <StartIcon
              src={assets.imagePlus}
              sizeClass="figma-start__icon--16"
            />
            Uzupełnij materiały multimedialne
          </button>
        </section>

        <section
          className="figma-start__categories"
          aria-labelledby="start-other-categories"
        >
          <p className="figma-start__section-title" id="start-other-categories">
            Pozostałe kategorie
          </p>
          <div className="figma-start__category-grid">
            {START_LOCKED_CATEGORY_CODES.map((code) => (
              <div key={code} className="figma-start__category-tile">
                <div className="figma-start__category-tile-head">
                  <p className="figma-start__category-tile-code">{code}</p>
                  <StartIcon
                    src={assets.lockKeyholeSm}
                    sizeClass="figma-start__icon--12"
                  />
                </div>
                <p className="figma-start__category-tile-reason">
                  {START_LOCKED_CATEGORY_REASON}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="figma-start__privacy">
          <StartIcon
            src={assets.smartphone}
            sizeClass="figma-start__icon--14"
          />
          <p className="figma-start__privacy-text">
            Bez konta. Postępy tylko na tym telefonie.
          </p>
        </div>
      </main>

      <div className="figma-start__home-indicator-row" aria-hidden="true">
        <div className="figma-start__home-indicator" />
      </div>
    </div>
  )
}

export type { StartScreenProps } from './types.ts'
export type { StartTheme } from './themeAssets.ts'
export { getStartThemeAssets } from './themeAssets.ts'
