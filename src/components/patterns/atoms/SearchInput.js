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
    className: `relative bg-gradient-to-r from-slate-800 to-slate-900 mb-6 mt-3 text-white fixed top-4 z-50 transform -translate-x-1/2 max-w-2xl min-w-sm h-14 border border-slate-600 rounded-xl px-10 py-2 text-base ${hasIcon ? 'pl-12' : ''} ${className}`,
    value,
    ...rest
  }
  return (
    <div className='relative w-full'>
      <input {...inputProps} />
      {hasIcon && (
        <span className='absolute right-135 top-14.5 z-50 transform -translate-y-1/2 flex items-center h-5 w-5 text-gray-500 pointer-events-none'>
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
