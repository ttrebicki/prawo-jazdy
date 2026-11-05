/** Placeholder copy aligned with Figma nodes 5:3675, 5:3725, 5:4083, 5:3781. */
export const DEMO_EXPLANATION =
  'Wyjaśnienie zastępcze. Tu pojawi się uzasadnienie odpowiedzi. Ten tekst nie opisuje przepisów i nie jest oficjalnym materiałem egzaminacyjnym.'

export const DEMO_BASIC_PROMPT =
  'Treść zastępcza pytania. Czy przykładowe stwierdzenie jest prawidłowe?'

export const DEMO_ABC_PROMPT =
  'Treść zastępcza pytania. Którą przykładową odpowiedź wybierasz?'

export const DEMO_ABC_ANSWERS = {
  A: 'Przykładowa odpowiedź A',
  B: 'Przykładowa odpowiedź B',
  C: 'Przykładowa odpowiedź C',
} as const

export const demoBasicQuestionStub = {
  number: '142',
  prompt: DEMO_BASIC_PROMPT,
  scope: 'basic' as const,
  points: 1 as const,
  categories: ['B' as const],
  basicKey: 'N' as const,
  mediaFilename: null,
  mediaKind: 'image' as const,
  sourceSheet: 'katalog' as const,
}

export const demoAbcQuestionStub = {
  number: '143',
  prompt: DEMO_ABC_PROMPT,
  scope: 'specialist' as const,
  points: 2 as const,
  categories: ['B' as const],
  specialistKey: 'B' as const,
  answerA: DEMO_ABC_ANSWERS.A,
  answerB: DEMO_ABC_ANSWERS.B,
  answerC: DEMO_ABC_ANSWERS.C,
  mediaFilename: null,
  mediaKind: 'none' as const,
  sourceSheet: 'katalog' as const,
}
