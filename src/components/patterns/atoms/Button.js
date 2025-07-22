import PropTypes from 'prop-types'

export default function Button ({ children, variant = 'primary', ...props }) {
  const base = 'px-4 py-2 rounded text-white duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ml-4 cursor-pointer transition-all transform hover:scale-105 active:scale-95 '
  const variants = {
    primary   : 'bg-primary',
    secondary : 'bg-secondary'
  }
  return (
    <button className={`${base}${variants[variant]}`} {...props}>
      {children}
    </button>
  )
}

Button.propTypes = {
  children : PropTypes.node.isRequired,
  variant  : PropTypes.oneOf(['primary', 'secondary']),
  props    : PropTypes.object
}
