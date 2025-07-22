import PropTypes from 'prop-types'

export default function Input ({ type = 'text', placeholder, value, onChange, className = '', ...rest }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border rounded p-2 ${className}`}
      {...rest}
    />
  )
}
Input.propTypes = {
  type        : PropTypes.string,
  placeholder : PropTypes.string,
  value       : PropTypes.string,
  onChange    : PropTypes.func,
  className   : PropTypes.string
}
