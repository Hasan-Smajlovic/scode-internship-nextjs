'use client'

import PropTypes from 'prop-types'
import Input from '../atoms/Input'
import Label from '../atoms/Label'
import Icon from '../atoms/Icon'
import Alert from '../atoms/Alert'

export default function InputLabel ({
  id,
  label,
  icon,
  type = 'text',
  className = '',
  error,
  required = false,
  value,
  onChange,
  onBlur,
  ...inputProps
}) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Label htmlFor={id} inputName={label} className='text-sm font-medium text-gray-700'>
        {required && <span className='text-red-500 ml-1'>*</span>}
      </Label>

      <div className='flex items-center gap-3 rounded-md text-sm'>
        {icon && (
          <div className='flex-shrink-0'>
            <Icon className='text-gray-500 h-5 w-5'>
              {icon}
            </Icon>
          </div>
        )}

        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          {...inputProps}
          className='h-22.5 px-4 border w-120 shadow-sm rounded-md focus:outline-none focus:ring text-sm bg-gray-50 show-sm border-gray-300 outline:none focus:ring-blue-500'
        />
      </div>

      {error && (
        <Alert
          type='error'
          position='inline'
          timeout={0}
        >
          {error}
        </Alert>
      )}
    </div>
  )
}

InputLabel.propTypes = {
  id        : PropTypes.string.isRequired,
  label     : PropTypes.string.isRequired,
  icon      : PropTypes.element,
  type      : PropTypes.string,
  className : PropTypes.string,
  error     : PropTypes.string,
  required  : PropTypes.bool,
  value     : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange  : PropTypes.func,
  onBlur    : PropTypes.func,
  options   : PropTypes.arrayOf(
    PropTypes.shape({
      value : PropTypes.string.isRequired,
      label : PropTypes.string.isRequired
    })
  )
}
