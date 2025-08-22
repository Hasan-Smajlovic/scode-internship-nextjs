import PropTypes from 'prop-types'

import Input from './Input'

export default function Checkbox ({ label, checked, onChange, className = '', ...rest }) {
  return (
    <div className='flex items-center space-x-2'>
      <Input
        type='checkbox'
        value={checked}
        onChange={onChange}
        className={`w-4 h-4 ${className}`}
        {...rest}
      />
      {label && (
        <label className='ml-2 text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}
    </div>
  )
}

Checkbox.propTypes = {
  label     : PropTypes.string,
  checked   : PropTypes.bool,
  onChange  : PropTypes.func,
  className : PropTypes.string
}
