'use client'

import PropTypes from 'prop-types'
import { useState } from 'react'

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
  ...inputProps
}) {
  const [inputValue, setInputValue] = useState(inputProps.value || '')
  const [showError, setShowError] = useState(false)

  const handleChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)

    if (newValue) {
      setShowError(false)
    }

    if (inputProps.onChange) {
      inputProps.onChange(e)
    }
  }

  const handleBlur = (e) => {
    if (required && !inputValue.trim()) {
      setShowError(true)
    }

    if (inputProps.onBlur) {
      inputProps.onBlur(e)
    }
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Label htmlFor={id} inputName={label} className='text-sm font-medium text-gray-700'>
        {required && <span className='text-red-500 ml-1'>*</span>}
      </Label>

      <div className={`flex mt-1 items-center gap-3 bg-gray-100 p-2 rounded-md shadow-sm ${showError ? 'border border-warning' : ''}`}>
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
          {...inputProps}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className='flex-1 border-none bg-transparent focus:outline-none text-gray-900'
        />
      </div>

      {(error || (required && showError)) && (
        <Alert
          type='error'
          position='inline'
          timeout={0}
          onClose={() => setShowError(false)}
        >
          {error || `${label} is required`}
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
  options   : PropTypes.arrayOf(
    PropTypes.shape({
      value : PropTypes.string.isRequired,
      label : PropTypes.string.isRequired
    })
  )
}
