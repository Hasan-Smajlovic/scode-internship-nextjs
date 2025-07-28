import PropTypes from 'prop-types'

import Label from '@/components/patterns/atoms/Label'

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
    <div className='flex flex-col gap-2'>
      {Label && (
        <Label className='text-sm text-primary mt-1'>
          {label}
        </Label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`h-17 px-4 border mt-2 border-gray-300 rounded-md focus:outline-none focus:ring ${className}`}
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
