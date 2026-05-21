const ITEMS = [
  { icon: '🏠', label: 'Home Services' }, { icon: '🔧', label: 'Repairs & Fixes' },
  { icon: '📚', label: 'Tutoring' },      { icon: '📦', label: 'Deliveries' },
  { icon: '🧹', label: 'Cleaning' },      { icon: '✨', label: 'Weird & Fun' },
  { icon: '💻', label: 'Tech Help' },     { icon: '💅', label: 'Beauty' },
  { icon: '🚗', label: 'Transport' },     { icon: '🎨', label: 'Creative' },
  { icon: '🎉', label: 'Events' },        { icon: '✍️', label: 'Writing' },
]
const ALL = [...ITEMS, ...ITEMS]

export default function Marquee() {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {ALL.map((item, i) => (
          <div key={i} style={{ display: 'contents' }}>
            <div className="marquee-item"><span>{item.icon}</span> {item.label}</div>
            <div className="marquee-dot" />
          </div>
        ))}
      </div>
    </div>
  )
}
