const ITEMS = [
  'Home Services', 'Repairs & Fixes', 'Tutoring', 'Deliveries',
  'Cleaning', 'Tech Help', 'Beauty & Grooming', 'Transport',
  'Creative Work', 'Events', 'Writing', 'Photography',
]
const ALL = [...ITEMS, ...ITEMS]

export default function Marquee() {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {ALL.map((item, i) => (
          <span key={i} style={{ display: 'contents' }}>
            <span className="marquee-item">{item}</span>
            <span className="marquee-sep" />
          </span>
        ))}
      </div>
    </div>
  )
}
