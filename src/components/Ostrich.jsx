export default function Ostrich({ size = 120, className = '', style = {} }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 560"
      width={size}
      style={{ display: 'block', ...style }}
      aria-hidden="true"
    >
      <defs>
        <filter id="ost-rough" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.013 0.017" numOctaves="2" seed="6" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g
        filter="url(#ost-rough)"
        fill="none"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M198 150 C228 118 288 124 306 166 L318 154 L324 184 L338 174 L344 202 C340 244 330 370 322 540" />
        <path d="M198 150 C175 168 167 190 172 208" />
        <path d="M172 208 L68 250 L62 260 L150 236" />
        <path d="M120 248 L92 270 L168 252" />
        <path d="M116 251 L164 240" />
        <path d="M168 252 C192 274 200 390 194 540" />
        <path d="M150 190 L206 182 L210 208 L160 214 Z" />
        <path d="M218 184 L258 190 L252 212 L214 208 Z" />
        <path d="M206 192 L218 190" />
        <path d="M172 173 q14 -7 26 -1" />
        <path d="M220 175 q12 -5 22 1" />
        <path d="M150 218 l11 -2" />
      </g>
    </svg>
  )
}
