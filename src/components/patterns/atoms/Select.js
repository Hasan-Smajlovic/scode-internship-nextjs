import PropTypes from 'prop-types'
import Label from '@/components/patterns/atoms/Label'

export default function Select ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  error,
  ...rest
}) {
  return (
    <div className='flex flex-col gap-2'>
      {label && (
        <Label className='text-sm text-primary mt-1'>
          {label}
        </Label>
      )}
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={`h-18.5 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className='text-red-500 text-xs mt-1'>{error}</span>
      )}
    </div>
  )
}

Select.propTypes = {
  label       : PropTypes.string,
  placeholder : PropTypes.string,
  options     : PropTypes.arrayOf(
    PropTypes.shape({
      value    : PropTypes.string.isRequired,
      label    : PropTypes.string.isRequired,
      disabled : PropTypes.bool
    })
  ).isRequired,
  value     : PropTypes.string,
  onChange  : PropTypes.func,
  className : PropTypes.string,
  error     : PropTypes.string
}
