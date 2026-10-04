const CATS = [
  { emoji: '🏠', name: 'Home Services' }, { emoji: '🔧', name: 'Repair & Fix' },
  { emoji: '📚', name: 'Tutoring' },      { emoji: '📦', name: 'Delivery' },
  { emoji: '🧹', name: 'Cleaning' },      { emoji: '💻', name: 'Tech Help' },
  { emoji: '💅', name: 'Beauty' },        { emoji: '🚗', name: 'Transport' },
  { emoji: '🎨', name: 'Creative' },      { emoji: '🎉', name: 'Events' },
  { emoji: '✍️', name: 'Writing' },       { emoji: '✨', name: 'Weird & Fun' },
]

export default function Categories() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="section-inner">
        <p className="s-label">What you can post</p>
        <h2 className="s-title">Any request.<br /><em>No judgment.</em></h2>
        <div className="cat-grid">
          {CATS.map(c => (
            <div key={c.name} className="cat-card">
              <span className="cat-emoji">{c.emoji}</span>
              <span className="cat-name">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
