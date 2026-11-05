import {
  EgzaminProbnyNiedostepny,
  type EgzaminProbnyNiedostepnyProps,
} from './EgzaminProbnyNiedostepny.tsx'
import { FigmaMockFrame } from './FigmaMockFrame.tsx'

export type EgzaminProbnyNiedostepnyMockProps = EgzaminProbnyNiedostepnyProps

/** Figma mock: Egzamin próbny · niedostępny at 402px width. */
export function EgzaminProbnyNiedostepnyMock(props: EgzaminProbnyNiedostepnyMockProps) {
  return (
    <FigmaMockFrame>
      <EgzaminProbnyNiedostepny {...props} />
    </FigmaMockFrame>
  )
}
