import PropTypes from 'prop-types'

export default function Input ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  className = '',
  ...rest
}) {
  return (
    <div className='w-full'>
      {type === 'date' && label && (
        <label className='block mb-1 text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full h-14 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...rest}
      />
    </div>
  )
}

Input.propTypes = {
  type        : PropTypes.string,
  placeholder : PropTypes.string,
  value       : PropTypes.string,
  onChange    : PropTypes.func,
  className   : PropTypes.string,
  label       : PropTypes.string
}
