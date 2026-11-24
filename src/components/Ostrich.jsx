import { useId } from 'react'

// The brand mark. Lines and sunglasses are separate groups so the line can draw
// itself and the sunglasses can drop on (see lib/ostrich.js).
export default function Ostrich({ size, className = '', viewBox = '0 0 400 560', strokeWidth = 13, rough = 5.5 }) {
  const id = useId()
  return (
    <svg className={`ostrich ${className}`} viewBox={viewBox} width={size} aria-hidden="true">
      <defs>
        <filter id={id} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.013 0.017" numOctaves="2" seed="6" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={rough} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${id})`} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round">
        <g className="ost-line">
          <path pathLength="1" d="M198 150 C228 118 288 124 306 166 L318 154 L324 184 L338 174 L344 202 C340 244 330 370 322 540" />
          <path pathLength="1" d="M198 150 C175 168 167 190 172 208" />
          <path pathLength="1" d="M172 208 L68 250 L62 260 L150 236" />
          <path pathLength="1" d="M120 248 L92 270 L168 252" />
          <path pathLength="1" d="M116 251 L164 240" />
          <path pathLength="1" d="M168 252 C192 274 200 390 194 540" />
          <path pathLength="1" d="M172 173 q14 -7 26 -1" />
          <path pathLength="1" d="M220 175 q12 -5 22 1" />
          <path pathLength="1" d="M150 218 l11 -2" />
        </g>
        <g className="ost-specs">
          <path d="M150 190 L206 182 L210 208 L160 214 Z" />
          <path d="M218 184 L258 190 L252 212 L214 208 Z" />
          <path d="M206 192 L218 190" />
        </g>
      </g>
    </svg>
  )
}
