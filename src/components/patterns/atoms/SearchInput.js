'use'
import PropTypes from 'prop-types'

export default function SearchInput ({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon = null,
  className = '',
  ...rest
}) {
  const hasIcon = !!icon
  const inputProps = {
    type,
    placeholder,
    onChange,
    className: 'fixed top-7 z-50 left-1/2 transform  pl-17 -translate-x-1/2 max-w-150 w-full h-14 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ' + className,
    value,
    ...rest
  }
  return (
    <div className='relative w-full'>
      <input {...inputProps} />
      {hasIcon && (
        <span className='fixed top-14 z-50 left-170 transform -translate-y-1/2 flex items-center h-5 w-5 text-gray-500'>
          {icon}
        </span>
      )}
    </div>
  )
}

SearchInput.propTypes = {
  type        : PropTypes.string,
  placeholder : PropTypes.string,
  value       : PropTypes.string.isRequired,
  onChange    : PropTypes.func.isRequired,
  icon        : PropTypes.node,
  className   : PropTypes.string
}
