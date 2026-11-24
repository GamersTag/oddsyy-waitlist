// Splits text into words (or letters) that can hop in one after another. The
// split copy is hidden from screen readers; the heading keeps its plain text.
export default function Hop({ text, letters = false }) {
  const words = text.split(' ')
  return words.map((w, i) => (
    <span key={i}>
      <span className="hop-word">
        {letters
          ? [...w].map((c, j) => <span key={j} className="hop-i">{c}</span>)
          : <span className="hop-i">{w}</span>}
      </span>
      {i < words.length - 1 && ' '}
    </span>
  ))
}
