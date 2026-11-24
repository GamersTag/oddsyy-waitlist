// Lahore in one pen: rooftops, Minar-e-Pakistan, the Badshahi Mosque, the Fort's
// Alamgiri Gate. Each stroke draws itself (see Closing). Ground is y = 300.
const arch = (x, w, top) => `M${x} 300 V${top + w * 0.55} C${x} ${top + w * 0.2} ${x + w / 2} ${top} ${x + w / 2} ${top} C${x + w / 2} ${top} ${x + w} ${top + w * 0.2} ${x + w} ${top + w * 0.55} V300`
const dome = (cx, y, w, h) => `M${cx - w / 2} ${y} C${cx - w * 0.72} ${y - h * 0.5} ${cx - w * 0.22} ${y - h * 0.74} ${cx} ${y - h} C${cx + w * 0.22} ${y - h * 0.74} ${cx + w * 0.72} ${y - h * 0.5} ${cx + w / 2} ${y} M${cx} ${y - h} V${y - h - 16}`
const minaret = x => `M${x - 14} 300 L${x - 9} 118 H${x + 9} L${x + 14} 300 M${x - 16} 118 H${x + 16} M${x - 9} 118 V102 H${x + 9} V118 M${x - 10} 102 C${x - 13} 88 ${x} 82 ${x} 74 C${x} 82 ${x + 13} 88 ${x + 10} 102 M${x} 74 V64 M${x - 12} 190 H${x + 12}`
const tree = (x, y, s) => `M${x} 300 V${y + 24 * s} C${x - 34 * s} ${y + 28 * s} ${x - 40 * s} ${y - 8 * s} ${x - 16 * s} ${y - 12 * s} C${x - 14 * s} ${y - 40 * s} ${x + 22 * s} ${y - 38 * s} ${x + 20 * s} ${y - 12 * s} C${x + 44 * s} ${y - 6 * s} ${x + 36 * s} ${y + 30 * s} ${x} ${y + 24 * s}`

const LINES = [
  // rooftops, water tanks
  'M0 206 H74 V300 M74 238 H132 V300 M132 178 H206 V300', 'M146 178 v-12 h38 v12 M150 166 v-24 h30 v24', 'M20 232 h20 v26 h-20 z M152 208 h16 v22 h-16 z M180 208 h14 v22 h-14 z M92 262 h20 v38', 'M28 206 v-34 M18 178 h20 M22 186 h12',
  tree(238, 232, 0.8),
  // Minar-e-Pakistan
  'M300 300 C306 268 330 258 340 284 M404 300 C398 268 374 258 364 284', 'M322 300 C326 284 338 278 352 278 C366 278 378 284 382 300', 'M340 280 L347 96 H357 L364 280', 'M341 96 H363 M345 96 v-12 h14 v12 M345 84 C345 70 359 70 359 84 M352 72 V50', 'M344 160 h16 M342 216 h20',
  tree(444, 222, 1), tree(484, 246, 0.7),
  // Badshahi Mosque
  minaret(540), 'M556 300 V222 H944 V300', arch(574, 34, 244), arch(622, 34, 244), arch(670, 34, 244),
  'M706 222 V176 H794 V222', arch(724, 52, 198), arch(796, 34, 244), arch(844, 34, 244), arch(892, 34, 244),
  dome(640, 222, 64, 66), dome(750, 176, 86, 88), dome(860, 222, 64, 66), minaret(960),
  tree(1010, 244, 0.75),
  // Alamgiri Gate
  'M1048 300 C1042 246 1050 206 1056 178 H1110 C1116 206 1124 246 1118 300', 'M1064 178 v-18 h38 v18 M1060 160 C1060 142 1074 134 1083 126 C1092 134 1106 142 1106 160 Z M1083 126 v-12', 'M1052 214 H1114 M1049 250 H1117',
  'M1118 212 h10 v-9 h10 v9 h10 v-9 h10 v9 h10 v-9 h10 v9 h10', arch(1132, 42, 232),
  'M1188 300 C1182 246 1190 206 1196 178 H1250 C1256 206 1264 246 1258 300', 'M1204 178 v-18 h38 v18 M1200 160 C1200 142 1214 134 1223 126 C1232 134 1246 142 1246 160 Z M1223 126 v-12', 'M1192 214 H1254 M1189 250 H1257',
  tree(1292, 234, 0.85),
  'M1326 300 V196 H1390 V300 M1390 232 H1440', 'M1342 196 v-12 h32 v12 M1346 184 v-22 h24 v22', 'M1340 220 h14 v22 h-14 z M1364 220 h14 v22 h-14 z M1406 256 h20 v44',
]

export default function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 1440 302" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {LINES.map((d, i) => <path key={i} className="sky-l" d={d} pathLength="1" />)}
    </svg>
  )
}

export function Rickshaw() {
  return (
    <svg className="rickshaw" viewBox="0 0 128 96" aria-hidden="true">
      <g className="rk-body">
        <circle className="rk-head" cx="70" cy="38" r="7.500" />
        <path className="rk-fill" d="M12 78 V50 H58 V64 H84 L92 48 H106 C112 58 116 66 116 78 Z" />
        <path className="rk-top" d="M12 50 V28 C12 12 22 6 40 6 H78 C88 6 93 12 96 22 L106 48 H92 L82 20 H58 V50 Z" />
        <path d="M12 62 H58 M64 64 L70 46 M104 58 h7" />
      </g>
      <g className="rk-wheel"><circle cx="34" cy="80" r="13" /><path d="M34 69 V91 M23 80 H45" /></g>
      <g className="rk-wheel"><circle cx="106" cy="82" r="11" /><path d="M106 73 V91 M97 82 H115" /></g>
    </svg>
  )
}

export function Birds() {
  return (
    <svg className="birds" viewBox="0 0 220 110" aria-hidden="true">
      {[[20, 60], [62, 30], [104, 64], [142, 22], [176, 52]].map(([x, y], i) => (
        <path key={i} style={{ '--d': `${i * -0.13}s` }} d={`M${x} ${y} q9 -12 18 0 q9 -12 18 0`} />
      ))}
    </svg>
  )
}
