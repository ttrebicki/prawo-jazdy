interface ExplanationBlockProps {
  text: string
}

export function ExplanationBlock({ text }: ExplanationBlockProps) {
  return (
    <section className="practice-why" aria-labelledby="practice-why-title">
      <h2 id="practice-why-title" className="practice-why-title">
        Dlaczego
      </h2>
      <p className="practice-why-text">{text}</p>
    </section>
  )
}
