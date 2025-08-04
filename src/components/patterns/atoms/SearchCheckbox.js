import PropTypes from 'prop-types'

export default function SearchCheckbox ({ label, checked, onChange, className = '', ...rest }) {
  return (
    <div className='flex gap-0.5 items-center'>
      <input
        type='checkbox'
        value={checked}
        onChange={onChange}
        className={`w-4 h-4 mr-3 ${className}`}
        {...rest}
      />
      {label && (
        <label className='text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}
    </div>
  )
}

SearchCheckbox.propTypes = {
  label     : PropTypes.string,
  checked   : PropTypes.bool,
  onChange  : PropTypes.func,
  className : PropTypes.string
}
