const PATHS = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  tick: 'M5 12.5l4.5 4.5L19 7.5',
  close: 'M6 6l12 12M18 6L6 18',
  back: 'M19 12H5M11 6l-6 6 6 6',
  clock: 'M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z',
  pin: 'M12 21s7-6.2 7-11.5A7 7 0 005 9.500C5 14.800 12 21 12 21zM12 12a2.500 2.500 0 100-5 2.500 2.500 0 000 5z',
  tag: 'M3 12V4a1 1 0 011-1h8l9 9-9 9-9-9zM8 8h.01',
}
export function Icon({ name, size = 20, width = 2.2 }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}

// Drawn, because Windows has no flag emoji and shows the letters "PK" instead.
export function Flag() {
  return (
    <svg className="flag" viewBox="0 0 30 20" width="21" height="14" aria-hidden="true">
      <rect width="30" height="20" rx="3" fill="#01411C" />
      <path d="M3 0h4.500v20H3a3 3 0 01-3-3V3a3 3 0 013-3z" fill="#fff" />
      <circle cx="18.600" cy="10" r="5.400" fill="#fff" /><circle cx="20.300" cy="8.700" r="4.700" fill="#01411C" />
      <path d="M22.300 5.200l.7 1.500 1.600.1-1.200 1.100.4 1.600-1.400-.9-1.400.9.4-1.600-1.200-1.100 1.600-.1z" fill="#fff" />
    </svg>
  )
}
