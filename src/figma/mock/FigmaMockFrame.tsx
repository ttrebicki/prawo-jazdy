import type { ReactNode } from 'react'

interface FigmaMockFrameProps {
  children: ReactNode
}

/** Non-interactive 402px-wide viewport for locked Figma mocks. */
export function FigmaMockFrame({ children }: FigmaMockFrameProps) {
  return (
    <div className="figma-mock-frame" aria-hidden="true">
      {children}
    </div>
  )
}
