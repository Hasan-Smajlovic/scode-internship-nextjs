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
    className: `absolute bottom-10 z-50 left-60 max-w-150 w-full h-14 ${hasIcon ? 'pl-12' : 'pl-4'} pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`,
    value,
    ...rest
  }

  // moram nagoditi responsive za search input i isto tako da kad skrolam da mi ostane na vrhu
  // ispraviti selects za placeholdere
  return (
    <div className='relative w-full'>
      {hasIcon && (
        <span className='absolute bottom-12 z-50 left-63 -translate-y-1/2 flex items-center h-5 w-5'>
          {icon}
        </span>
      )}
      <input {...inputProps} />
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
