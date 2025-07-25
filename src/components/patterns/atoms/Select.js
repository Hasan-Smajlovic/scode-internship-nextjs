import PropTypes from 'prop-types'

export default function Select ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  ...rest
}) {
  return (
    <div className='mb-4'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`h-14 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring ${className}`}
        {...rest}
      >
        <option value='' disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

Select.propTypes = {
  label   : PropTypes.string,
  options : PropTypes.arrayOf(
    PropTypes.shape({
      value : PropTypes.string.isRequired,
      label : PropTypes.string.isRequired
    })
  ).isRequired,
  value       : PropTypes.string,
  onChange    : PropTypes.func,
  placeholder : PropTypes.string,
  className   : PropTypes.string
}
