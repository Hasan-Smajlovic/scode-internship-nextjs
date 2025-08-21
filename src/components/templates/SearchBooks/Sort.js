import PropTypes from 'prop-types'

export default function Sort ({ value, onChange, options = [] }) {
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='transition-all bg-primary mt-5 rounded-medium '>
        <select
          value={value}
          onChange={handleChange}
          className='w-full px-4 py-2 mr-5 rounded bg-primary text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white cursor-pointer transition-all'
        >
          {options.map(option => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
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
      value    : PropTypes.string.isRequired,
      label    : PropTypes.string.isRequired,
      disabled : PropTypes.bool
    })
  ).isRequired
}
