import type { ReactNode } from 'react'

interface FigmaMockFrameProps {
  children: ReactNode
}

/** 402px-wide viewport wrapper for Figma mocks. */
export function FigmaMockFrame({ children }: FigmaMockFrameProps) {
  return <div className="figma-mock-frame">{children}</div>
}
