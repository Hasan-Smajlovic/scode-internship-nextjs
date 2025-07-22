import PropTypes from 'prop-types'
import Input from './Input'

export default function Select ({ label, options = [], value, onChange, placeholder, className = '', ...rest }) {
  return (
    <div className='mb-4'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          {label}
        </label>
      )}
      <Input
        type='select'
        options={options}
        value={value}
        onChange={onChange}
        className={` ${className}`}
        {...rest}
      />
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
