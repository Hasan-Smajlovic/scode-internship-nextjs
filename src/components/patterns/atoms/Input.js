import PropTypes from 'prop-types'

export default function Input ({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  icon = null,
  label,
  className = '',
  ...rest
}) {
  const hasIcon = !!icon
  const inputProps = {
    type,
    placeholder,
    onChange,
    className: className || `w-full h-14 ${hasIcon ? 'pl-12' : 'pl-4'} pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`,
    ...rest
  }

  if (value !== undefined) {
    inputProps.value = value
  } else if (defaultValue !== undefined) {
    inputProps.defaultValue = defaultValue
  }

  return (
    <div className='max-w-full'>
      {type === 'date' && label && (
        <label className='block mb-1 text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}
      {hasIcon && (
        <span className='absolute left-4 top-1/2 -translate-y-1/2 flex items-center h-5 w-5'>
          {icon}
        </span>
      )}

      <input {...inputProps} />
    </div>
  )
}

Input.propTypes = {
  type         : PropTypes.string,
  placeholder  : PropTypes.string,
  value        : PropTypes.string,
  defaultValue : PropTypes.string,
  onChange     : PropTypes.func,
  icon         : PropTypes.node,
  label        : PropTypes.string,
  className    : PropTypes.string
}
