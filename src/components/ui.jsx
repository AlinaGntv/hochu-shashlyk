import { site } from '../data/site.js'
import logo from '../assets/logo.png'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const FLAME =
  'M12 2c1 3-1 4.5-2.5 6.5C8 10.5 7 12.3 7 14.5a5 5 0 0 0 10 0c0-1.6-.6-2.8-1.4-3.9-.4 1-1 1.6-1.9 1.9.6-2.9-.2-6.8-1.7-10.5z'

const icons = {
  flame: <path d={FLAME} {...stroke} />,
  flameFill: <path d={FLAME} fill="currentColor" />,
  leaf: (
    <g {...stroke}>
      <path d="M5 19c0-9 5-14 15-15 0 10-5 15-13 15z" />
      <path d="M4 21c2-6 6-10 11-12" />
    </g>
  ),
  people: (
    <g {...stroke}>
      <circle cx="12" cy="8" r="3" />
      <path d="M6.5 19c0-3 2.5-5 5.5-5s5.500 2 5.500 5" />
      <circle cx="5" cy="10" r="2" />
      <path d="M1.500 17.500c0-2 1.500-3.500 3.500-3.500" />
      <circle cx="19" cy="10" r="2" />
      <path d="M22.500 17.500c0-2-1.500-3.500-3.500-3.500" />
    </g>
  ),
  bag: (
    <g {...stroke}>
      <path d="M5 8h14l1 13H4z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </g>
  ),
  basket: (
    <g {...stroke}>
      <path d="M4 9h16l-1.3 11H5.3z" />
      <path d="m8 9 4-6 4 6M9 13v3m6-3v3" />
    </g>
  ),
  pin: (
    <g {...stroke}>
      <path d="M12 21s7-6.200 7-11.500a7 7 0 0 0-14 0C5 14.800 12 21 12 21z" />
      <circle cx="12" cy="9.500" r="2.500" />
    </g>
  ),
  clock: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </g>
  ),
  phone: (
    <path
      {...stroke}
      d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
    />
  ),
  plus: <path {...stroke} strokeWidth="2" d="M12 5v14M5 12h14" />,
  arrowRight: <path {...stroke} d="M5 12h14M13 6l6 6-6 6" />,
  chevronLeft: <path {...stroke} strokeWidth="2" d="M15 5l-7 7 7 7" />,
  chevronRight: <path {...stroke} strokeWidth="2" d="M9 5l7 7-7 7" />,
  crown: <path {...stroke} d="M3 8l4 4 5-7 5 7 4-4-2 11H5z" />,
  vk: (
    <text
      x="12"
      y="16.500"
      textAnchor="middle"
      fontSize="11.500"
      fontWeight="800"
      fontFamily="'Onest Variable', sans-serif"
      fill="currentColor"
    >
      vk
    </text>
  ),
  telegram: (
    <path
      fill="currentColor"
      d="M20.700 4.200 3.300 10.900c-.9.400-.9 1.100 0 1.400l4.300 1.400 1.700 5.200c.200.600.8.700 1.200.300l2.500-2.400 4.500 3.300c.6.400 1.200.100 1.400-.600l3-14.200c.2-.900-.5-1.400-1.200-1.100zM9.500 13.500l7.900-5.600-6.300 6.700-.3 3z"
    />
  ),
  instagram: (
    <g {...stroke}>
      <rect x="4" y="4" width="16" height="16" rx="4.500" />
      <circle cx="12" cy="12" r="3.500" />
      <circle cx="16.700" cy="7.300" r=".6" fill="currentColor" />
    </g>
  ),
}

export function Icon({ name, size = 24, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

export function Logo({ className = '' }) {
  return (
    <a href="/#top" className={`logo ${className}`} aria-label={site.name}>
      <img src={logo} alt={site.name} width="640" height="640" />
    </a>
  )
}

export function Socials({ variant = 'round' }) {
  return (
    <ul className={`socials socials--${variant}`}>
      {site.socials.map((s) => (
        <li key={s.id}>
          <a href={s.url} aria-label={s.label} target="_blank" rel="noreferrer">
            <Icon name={s.id} size={20} />
          </a>
        </li>
      ))}
    </ul>
  )
}

// Фото блюда. Пока файла нет — показывает аккуратную заглушку с подписью.
export function Photo({ src, alt, className = '' }) {
  if (src) return <img className={`photo ${className}`} src={src} alt={alt} loading="lazy" />
  return (
    <div className={`photo photo--empty ${className}`} role="img" aria-label={alt}>
      <span>
        <Icon name="flame" size={22} />
        фото: {alt}
      </span>
    </div>
  )
}
