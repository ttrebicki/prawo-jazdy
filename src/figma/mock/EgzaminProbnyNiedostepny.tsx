import imgIosSignal from './assets/9be9a.svg'
import imgIosWifiSignal from './assets/6dc5d.svg'
import imgIosBatteryFull from './assets/f5265.svg'
import imgArrowLeft from './assets/561ac.svg'
import imgMoreHorizontal from './assets/56f39.svg'
import imgLockKeyhole from './assets/2b15b.svg'
import imgListChecks from './assets/f176b.svg'
import imgClock3 from './assets/94c0b.svg'
import imgChartNoAxesColumn from './assets/1b345.svg'
import imgArrowRight from './assets/c5635.svg'
import imgInfo from './assets/6d281.svg'
import imgArrowRightPrimary from './assets/55de6.svg'

const EXAM_RULES = [
  {
    icon: imgListChecks,
    title: '32 pytania',
    detail: 'Pełny zestaw dla kategorii B',
  },
  {
    icon: imgClock3,
    title: '25 minut',
    detail: 'Wspólny limit czasu na egzamin',
  },
  {
    icon: imgChartNoAxesColumn,
    title: 'Próg 68 z 74 punktów',
    detail: 'Planowany warunek zaliczenia',
  },
  {
    icon: imgArrowRight,
    title: 'Bez powrotu',
    detail: 'Nie wrócisz do poprzednich pytań',
  },
] as const

export interface EgzaminProbnyNiedostepnyProps {
  onBack: () => void
  onPractice: () => void
  onHome: () => void
}

export function EgzaminProbnyNiedostepny({
  onBack,
  onPractice,
  onHome,
}: EgzaminProbnyNiedostepnyProps) {
  return (
    <div
      className="figma-mock-exam-unavailable"
      data-name="Egzamin próbny · niedostępny"
      data-node-id="5:3899"
    >
      <div
        className="figma-mock-exam-unavailable__status-bar"
        data-name="Pasek stanu"
        data-node-id="5:3900"
      >
        <p className="figma-mock-exam-unavailable__status-time" data-node-id="5:3901">
          9:41
        </p>
        <div
          className="figma-mock-exam-unavailable__status-icons"
          data-name="Status urządzenia"
          data-node-id="5:3902"
        >
          <div
            className="figma-mock-exam-unavailable__icon-slot figma-mock-exam-unavailable__icon-slot--18"
            data-name="ios-signal"
            data-node-id="5:4454"
          >
            <img alt="" src={imgIosSignal} />
          </div>
          <div
            className="figma-mock-exam-unavailable__icon-slot figma-mock-exam-unavailable__icon-slot--18"
            data-name="ios-wifi-signal"
            data-node-id="5:4457"
          >
            <img alt="" src={imgIosWifiSignal} />
          </div>
          <div
            className="figma-mock-exam-unavailable__icon-slot figma-mock-exam-unavailable__icon-slot--battery"
            data-name="ios-battery-full"
            data-node-id="5:4460"
          >
            <img alt="" src={imgIosBatteryFull} />
          </div>
        </div>
      </div>

      <div
        className="figma-mock-exam-unavailable__header"
        data-name="Nagłówek"
        data-node-id="5:3906"
      >
        <button
          type="button"
          className="figma-mock-exam-unavailable__back"
          data-name="Powrót"
          data-node-id="5:3907"
          onClick={onBack}
          aria-label="Powrót"
        >
          <div
            className="figma-mock-exam-unavailable__icon-slot figma-mock-exam-unavailable__icon-slot--18"
            data-name="arrow-left"
            data-node-id="5:4463"
          >
            <img alt="" src={imgArrowLeft} />
          </div>
        </button>
        <p className="figma-mock-exam-unavailable__header-title" data-node-id="5:3909">
          Egzamin próbny
        </p>
        <div
          className="figma-mock-exam-unavailable__icon-slot figma-mock-exam-unavailable__icon-slot--20"
          data-name="more-horizontal"
          data-node-id="5:4466"
        >
          <img alt="" src={imgMoreHorizontal} />
        </div>
      </div>

      <div
        className="figma-mock-exam-unavailable__content"
        data-name="Treść"
        data-node-id="5:3911"
      >
        <div
          className="figma-mock-exam-unavailable__lock-badge"
          data-name="Blokada egzaminu"
          data-node-id="5:3912"
        >
          <div
            className="figma-mock-exam-unavailable__icon-slot figma-mock-exam-unavailable__icon-slot--28"
            data-name="lock-keyhole"
            data-node-id="5:4469"
          >
            <img alt="" src={imgLockKeyhole} />
          </div>
        </div>

        <div
          className="figma-mock-exam-unavailable__intro"
          data-name="Wprowadzenie"
          data-node-id="5:3914"
        >
          <p className="figma-mock-exam-unavailable__eyebrow" data-node-id="5:3915">
            Kategoria B · w przygotowaniu
          </p>
          <h1 className="figma-mock-exam-unavailable__headline" data-node-id="5:3916">
            Na egzamin
            <br />
            przyjdzie czas.
          </h1>
          <p className="figma-mock-exam-unavailable__lede" data-node-id="5:3917">
            Egzamin próbny nie jest jeszcze dostępny. Na razie buduj pewność w ćwiczeniach,
            bez presji czasu.
          </p>
        </div>

        <div
          className="figma-mock-exam-unavailable__rules-card"
          data-name="Przyszłe zasady egzaminu"
          data-node-id="5:3918"
        >
          <p className="figma-mock-exam-unavailable__rules-title" data-node-id="5:3919">
            Tak będzie wyglądał egzamin
          </p>
          {EXAM_RULES.map((rule) => (
            <div
              key={rule.title}
              className="figma-mock-exam-unavailable__rule-row"
              data-name="Zasada egzaminu"
            >
              <div className="figma-mock-exam-unavailable__icon-slot figma-mock-exam-unavailable__icon-slot--21">
                <img alt="" src={rule.icon} />
              </div>
              <div className="figma-mock-exam-unavailable__rule-copy" data-name="Opis zasady">
                <p className="figma-mock-exam-unavailable__rule-title">{rule.title}</p>
                <p className="figma-mock-exam-unavailable__rule-detail">{rule.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="figma-mock-exam-unavailable__info-banner"
          data-name="Informacja"
          data-node-id="5:3940"
        >
          <div className="figma-mock-exam-unavailable__icon-slot figma-mock-exam-unavailable__icon-slot--18">
            <img alt="" src={imgInfo} />
          </div>
          <div className="figma-mock-exam-unavailable__info-copy" data-name="Komunikat">
            <p className="figma-mock-exam-unavailable__info-title" data-node-id="5:3943">
              Jeszcze niedostępny
            </p>
            <p className="figma-mock-exam-unavailable__info-text" data-node-id="5:3944">
              Nie można rozpocząć egzaminu w tej wersji. Powyższe zasady opisują przyszły tryb.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="figma-mock-exam-unavailable__primary-action"
          data-name="Działanie"
          data-node-id="5:3945"
          onClick={onPractice}
        >
          <span className="figma-mock-exam-unavailable__primary-label" data-node-id="5:3946">
            Wróć do ćwiczeń
          </span>
          <div className="figma-mock-exam-unavailable__icon-slot figma-mock-exam-unavailable__icon-slot--18">
            <img alt="" src={imgArrowRightPrimary} />
          </div>
        </button>

        <button
          type="button"
          className="figma-mock-exam-unavailable__secondary-link"
          data-node-id="5:3948"
          onClick={onHome}
        >
          Wróć na start
        </button>
      </div>

      <div
        className="figma-mock-exam-unavailable__home-indicator"
        data-name="Wskaźnik systemowy"
        data-node-id="5:3949"
      >
        <div
          className="figma-mock-exam-unavailable__home-indicator-pill"
          data-name="Uchwyt"
          data-node-id="5:3950"
        />
      </div>
    </div>
  )
}
