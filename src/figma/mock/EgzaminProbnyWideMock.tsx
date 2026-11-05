import { useFigmaLayout } from '../layout/FigmaLayoutContext.tsx'
import type { EgzaminProbnyNiedostepnyProps } from './EgzaminProbnyNiedostepny.tsx'
import imgLockKeyhole from './assets/2b15b.svg'
import imgListChecks from './assets/f176b.svg'
import imgClock3 from './assets/94c0b.svg'
import imgChartNoAxesColumn from './assets/1b345.svg'
import imgArrowRight from './assets/c5635.svg'
import imgInfo from './assets/6d281.svg'
import imgArrowRightPrimary from './assets/55de6.svg'

const WIDE_EXAM_RULES = [
  { icon: imgListChecks, title: '32 pytania', detail: 'Pełny zestaw dla kategorii B' },
  { icon: imgClock3, title: '25 minut', detail: 'Wspólny limit czasu na egzamin' },
  {
    icon: imgChartNoAxesColumn,
    title: 'Próg 68 z 74 punktów',
    detail: 'Planowany warunek zaliczenia',
  },
  { icon: imgArrowRight, title: 'Bez powrotu', detail: 'Nie wrócisz do poprzednich pytań' },
] as const

/** Desktop · Egzamin próbny · niedostępny (15:12852) / Tablet · Egzamin próbny · niedostępny (15:13824) */
export function EgzaminProbnyWideMock({ onPractice, onHome }: EgzaminProbnyNiedostepnyProps) {
  const { isDesktop } = useFigmaLayout()

  return (
    <div
      className="figma-wide__content figma-wide__content--narrow"
      data-node-id={isDesktop ? '15:12852' : '15:13824'}
      data-name={
        isDesktop
          ? 'Desktop · Egzamin próbny · niedostępny'
          : 'Tablet · Egzamin próbny · niedostępny'
      }
    >
      <img className="figma-wide__mock-lock" src={imgLockKeyhole} alt="" />

      <div className="figma-wide__intro-block">
        <p className="figma-wide__intro-eyebrow">KATEGORIA B · W PRZYGOTOWANIU</p>
        <h1 className="figma-wide__intro-title">Na egzamin przyjdzie czas.</h1>
        <p className="figma-wide__intro-lead">
          Egzamin próbny nie jest jeszcze dostępny. Na razie buduj pewność w ćwiczeniach,
          bez presji czasu.
        </p>
      </div>

      <section className="figma-wide__mock-rules" aria-labelledby="mock-rules-title">
        <p className="figma-wide__section-title" id="mock-rules-title">
          Tak będzie wyglądał egzamin
        </p>
        {WIDE_EXAM_RULES.map((rule) => (
          <div key={rule.title} className="figma-wide__mock-rule">
            <img className="figma-wide__mock-rule-icon" src={rule.icon} alt="" />
            <div>
              <p className="figma-wide__mock-rule-title">{rule.title}</p>
              <p className="figma-wide__mock-rule-detail">{rule.detail}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="figma-wide__callout">
        <img src={imgInfo} alt="" width={20} height={20} />
        <div>
          <p className="figma-wide__callout-title">Jeszcze niedostępny</p>
          <p className="figma-wide__callout-text">
            Nie można rozpocząć egzaminu w tej wersji. Powyższe zasady opisują przyszły
            tryb.
          </p>
        </div>
      </div>

      <div className="figma-wide__action-row">
        <button type="button" className="figma-wide__btn-primary" onClick={onPractice}>
          Wróć do ćwiczeń
          <img src={imgArrowRightPrimary} alt="" width={20} height={20} />
        </button>
        <button type="button" className="figma-wide__btn-outline" onClick={onHome}>
          Wróć na start
        </button>
      </div>
    </div>
  )
}
