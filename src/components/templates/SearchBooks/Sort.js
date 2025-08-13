import PropTypes from 'prop-types'

export default function Sort ({ value, onChange, options = [] }) {
  return (
    <div className='flex flex-col gap-2'>
      <div className='transition-all bg-primary bg-gray-200 mt-5'>
        <select
          value={value}
          onChange={onChange}
          className='px-4 justify-center py-2 rounded-medium bg-primary max-w-31 text-white duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white cursor-pointer transition-all'
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

Sort.propTypes = {
  value    : PropTypes.string.isRequired,
  onChange : PropTypes.func.isRequired,
  options  : PropTypes.arrayOf(
    PropTypes.shape({
      value : PropTypes.string.isRequired,
      label : PropTypes.string.isRequired
    })
  ).isRequired
}
