import { useFigmaLayoutOptional } from '../layout/FigmaLayoutContext.tsx'
import {
  EgzaminProbnyNiedostepny,
  type EgzaminProbnyNiedostepnyProps,
} from './EgzaminProbnyNiedostepny.tsx'
import { EgzaminProbnyWideMock } from './EgzaminProbnyWideMock.tsx'
import { FigmaMockFrame } from './FigmaMockFrame.tsx'

export type EgzaminProbnyNiedostepnyMockProps = EgzaminProbnyNiedostepnyProps

/** Figma mock: Egzamin próbny · niedostępny at 402px width; wide frames 15:12852 / 15:13824. */
export function EgzaminProbnyNiedostepnyMock(props: EgzaminProbnyNiedostepnyMockProps) {
  const layout = useFigmaLayoutOptional()

  if (layout?.isWide) {
    return <EgzaminProbnyWideMock {...props} />
  }

  return (
    <FigmaMockFrame>
      <EgzaminProbnyNiedostepny {...props} />
    </FigmaMockFrame>
  )
}
