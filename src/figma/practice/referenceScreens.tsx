import { figmaPracticeAssets } from './assets.ts'
import type { FigmaPracticeTheme } from './theme.ts'
import {
  DEMO_ABC_PROMPT,
  DEMO_BASIC_PROMPT,
  DEMO_EXPLANATION,
  demoAbcQuestionStub,
  demoBasicQuestionStub,
} from './demoCopy.ts'
import { PracticeAnswerList } from './components/PracticeAnswerList.tsx'
import { PracticeFrame } from './components/PracticeFrame.tsx'
import {
  PracticeMediaCard,
  PracticeTextOnlyHint,
} from './components/PracticeMediaArea.tsx'
import { PracticeMetaProgress } from './components/PracticeMetaProgress.tsx'
import { PracticeQuestionCopy } from './components/PracticeQuestionCopy.tsx'
import { PracticeResultBlock } from './components/PracticeResultBlock.tsx'
import { PracticeWhyPanel } from './components/PracticeWhyPanel.tsx'

/** Figma node 5:3675 — before answer, Dlaczego expanded. */
export function PracticeBeforeAnswerReference() {
  const theme: FigmaPracticeTheme = 'light'
  const assets = figmaPracticeAssets(theme)
  const stubQuestion = demoBasicQuestionStub

  return (
    <PracticeFrame theme={theme}>
      <PracticeMetaProgress
        questionLabel="DEMO B-0142"
        progressLabel="7 z 20"
        progressRatio={7 / 20}
      />
      <PracticeMediaCard assets={assets} />
      <PracticeQuestionCopy prompt={DEMO_BASIC_PROMPT} />
      <PracticeAnswerList
        question={stubQuestion}
        assets={assets}
        mode="pick"
        selected="T"
        picked={null}
        correctKey="N"
      />
      <PracticeWhyPanel
        assets={assets}
        text={DEMO_EXPLANATION}
        expanded
        onToggle={() => undefined}
      />
      <button type="button" className="fp-primary-action">
        Sprawdź odpowiedź
      </button>
      <p className="fp-footnote">
        To ćwiczenie demonstracyjne, nie pytanie egzaminacyjne.
      </p>
    </PracticeFrame>
  )
}

/** Figma node 5:3725 — wrong answer, light theme. */
export function PracticeWrongAnswerReference() {
  const theme: FigmaPracticeTheme = 'light'
  const assets = figmaPracticeAssets(theme)
  const stubQuestion = demoBasicQuestionStub

  return (
    <PracticeFrame theme={theme}>
      <PracticeMetaProgress
        questionLabel="DEMO B-0142"
        progressLabel="7 z 20"
        progressRatio={7 / 20}
      />
      <PracticeMediaCard assets={assets} />
      <PracticeQuestionCopy prompt={DEMO_BASIC_PROMPT} />
      <PracticeAnswerList
        question={stubQuestion}
        assets={assets}
        mode="review"
        selected={null}
        picked="T"
        correctKey="N"
      />
      <PracticeResultBlock isCorrect={false} correctKey="N" />
      <PracticeWhyPanel
        assets={assets}
        text={DEMO_EXPLANATION}
        expanded
        onToggle={() => undefined}
      />
      <button type="button" className="fp-primary-action">
        Następne pytanie
        <img className="fp-icon fp-icon--18" src={assets.arrowRight} alt="" />
      </button>
      <p className="fp-footnote">Wynik dotyczy wyłącznie treści pokazowej.</p>
    </PracticeFrame>
  )
}

/** Figma node 5:4083 — wrong answer, dark theme. */
export function PracticeWrongAnswerDarkReference() {
  const theme: FigmaPracticeTheme = 'dark'
  const assets = figmaPracticeAssets(theme)
  const stubQuestion = demoBasicQuestionStub

  return (
    <PracticeFrame theme={theme}>
      <PracticeMetaProgress
        questionLabel="DEMO B-0142"
        progressLabel="7 z 20"
        progressRatio={7 / 20}
      />
      <PracticeMediaCard assets={assets} />
      <PracticeQuestionCopy prompt={DEMO_BASIC_PROMPT} />
      <PracticeAnswerList
        question={stubQuestion}
        assets={assets}
        mode="review"
        selected={null}
        picked="T"
        correctKey="N"
      />
      <PracticeResultBlock isCorrect={false} correctKey="N" />
      <PracticeWhyPanel
        assets={assets}
        text={DEMO_EXPLANATION}
        expanded
        onToggle={() => undefined}
      />
      <button type="button" className="fp-primary-action">
        Następne pytanie
        <img className="fp-icon fp-icon--18" src={assets.arrowRight} alt="" />
      </button>
      <p className="fp-footnote">Wynik dotyczy wyłącznie treści pokazowej.</p>
    </PracticeFrame>
  )
}

/** Figma node 5:3781 — ABC answers, no media, Dlaczego collapsed. */
export function PracticeAbcNoMediaReference() {
  const theme: FigmaPracticeTheme = 'light'
  const assets = figmaPracticeAssets(theme)
  const stubQuestion = demoAbcQuestionStub

  return (
    <PracticeFrame theme={theme}>
      <PracticeMetaProgress
        questionLabel="DEMO B-0143"
        progressLabel="8 z 20"
        progressRatio={8 / 20}
      />
      <PracticeTextOnlyHint assets={assets} />
      <PracticeQuestionCopy prompt={DEMO_ABC_PROMPT} />
      <PracticeAnswerList
        question={stubQuestion}
        assets={assets}
        mode="pick"
        selected="B"
        picked={null}
        correctKey="B"
      />
      <PracticeWhyPanel
        assets={assets}
        text={DEMO_EXPLANATION}
        expanded={false}
        onToggle={() => undefined}
      />
      <button type="button" className="fp-primary-action">
        Sprawdź odpowiedź
      </button>
      <p className="fp-footnote">
        To ćwiczenie demonstracyjne, nie pytanie egzaminacyjne.
      </p>
    </PracticeFrame>
  )
}
