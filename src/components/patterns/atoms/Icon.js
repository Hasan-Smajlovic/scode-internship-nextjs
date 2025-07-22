import PropTypes from 'prop-types'

export default function Icon ({ name, size = 20, color = 'currentColor', className = '' }) {
  const iconMap = {
    user: (
      <svg width={size} height={size} fill='none' stroke={color} strokeWidth='2' viewBox='0 0 24 24' className={className}>
        <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
        <circle cx='12' cy='7' r='4' />
      </svg>
    ),
    mail: (
      <svg width={size} height={size} fill='none' stroke={color} strokeWidth='2' viewBox='0 0 24 24' className={className}>
        <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
        <polyline points='22,6 12,13 2,6' />
      </svg>
    ),
    phone: (
      <svg width={size} height={size} fill='none' stroke={color} strokeWidth='2' viewBox='0 0 24 24' className={className}>
        <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
      </svg>
    ),
    lock: (
      <svg width={size} height={size} fill='none' stroke={color} strokeWidth='2' viewBox='0 0 24 24' className={className}>
        <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
        <circle cx='12' cy='16' r='1' />
        <path d='M7 11V7a5 5 0 0 1 10 0v4' />
      </svg>
    ),
    search: (
      <svg width={size} height={size} fill='none' stroke={color} strokeWidth='2' viewBox='0 0 24 24' className={className}>
        <circle cx='11' cy='11' r='8' />
        <path d='M21 21l-4.35-4.35' />
      </svg>
    )
  }

  return iconMap[name] || null
}

Icon.propTypes = {
  name      : PropTypes.oneOf(['user', 'mail', 'phone', 'lock', 'search']).isRequired,
  size      : PropTypes.number,
  color     : PropTypes.string,
  className : PropTypes.string
}
