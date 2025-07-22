import PropTypes from 'prop-types'

export default function Input ({ type = 'text', options = [], placeholder, value, onChange, className, ...rest }) {
  // Handle different input types
  if (type === 'select') {
    return (
      <select
        value={value}
        onChange={onChange}
        className={`border rounded p-2 ${className}`}
        {...rest}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  if (type === 'checkbox') {
    return (
      <input
        type='checkbox'
        checked={value}
        onChange={onChange}
        className={`border rounded p-2 ${className}`}
        {...rest}
      />
    )
  }

  // Default to text input
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
  type    : PropTypes.string,
  options : PropTypes.arrayOf(
    PropTypes.shape({
      value : PropTypes.string.isRequired,
      label : PropTypes.string.isRequired
    })
  ),
  placeholder : PropTypes.string,
  value       : PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onChange    : PropTypes.func,
  className   : PropTypes.string
}
