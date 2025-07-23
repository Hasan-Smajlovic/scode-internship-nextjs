'use client'

import PropTypes from 'prop-types'

export default function Button ({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 rounded text-white duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white cursor-pointer transition-all transform hover:scale-105 active:scale-95 '
  const variants = {
    primary   : 'bg-primary',
    secondary : 'bg-secondary'
  }

  return (
    <button
      className={`${base}${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children  : PropTypes.node.isRequired,
  variant   : PropTypes.oneOf(['primary', 'secondary']),
  onClick   : PropTypes.func,
  className : PropTypes.string
}
