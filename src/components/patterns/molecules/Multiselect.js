'use client'
import { useState } from 'react'
import PropTypes from 'prop-types'

import Button from '../atoms/Button'
import Label from '../atoms/Label'
import Alert from '../atoms/Alert'

export default function Multiselect ({
  options = [
    { value: 'Hasan', label: 'Hasan' },
    { value: 'Mensa', label: 'Mensa' },
    { value: 'Mirza', label: 'Mirza' },
    { value: 'Pura', label: 'Pura' },
    { value: 'Scode', label: 'Scode' },
    { value: 'Internship', label: 'Internship' }
  ],
  onChange = () => {},
  value = [],
  className = '',
  disabled = false,
  placeholder = 'Select options...'
}) {
  const [selectedOptions, setSelectedOptions] = useState(value)
  const [open, setOpen] = useState(false)

  const toggleDropdown = (event) => {
    if (disabled) return
    if (!open) {
      document.addEventListener('click', handleGlobalClick)
      document.addEventListener('keydown', handleEscape)
    } else {
      document.removeEventListener('click', handleGlobalClick)
      document.removeEventListener('keydown', handleEscape)
    }
    setOpen(prev => !prev)
  }

  const handleGlobalClick = (event) => {
    if (!event.target.closest('.dropdown-container')) {
      setOpen(false)
    }
  }

  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const handleOptions = (event) => {
    const selectedValue = event.target.value
    let updated = []

    if (selectedOptions.includes(selectedValue)) {
      updated = selectedOptions.filter(option => option !== selectedValue)
      console.log('My selected options are:', updated)
    } else {
      updated = [...selectedOptions, selectedValue]
      console.log('My selected options are:', updated)
    }

    setSelectedOptions(updated)
    onChange(updated)
  }

  const handleReset = (event) => {
    event.preventDefault()
    setSelectedOptions([])
    setOpen(false)

    Alert.show({
      type     : 'info',
      children : 'Multiselect reset',
      position : 'top-center',
      timeout  : 3000
    })
  }

  return (
    <div className=' relative dropdown-container justify-between flex flex-col items-start gap-1'>
      <Label>
        {placeholder && <span className='text-gray-500 mt-10'>{placeholder}</span>}
      </Label>

      <div className={`flex flex-wrap gap-2 ${className}`}>
        <Button
          type='dropdown'
          onClick={toggleDropdown}
          className={`w-26 rounded-md transition ${
            open ? 'bg-secondary text-white border-secondary' : 'bg-gray-200 text-gray-700 border-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Dropdown
        </Button>

        <Button
          type='button'
          onClick={handleReset}
          className='ml-2 w-26 bg-secondary text-white rounded-md hover:bg-red-600 transition'
        >
          Reset
        </Button>
      </div>

      {open && (
        <div className='absolute top-20 left-0 transform w-72 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto'>
          <div className='p-2'>
            {options.map((option) => {
              const isSelected = selectedOptions.includes(option.value)
              return (
                <div key={option.value} className='py-1'>
                  <Button
                    type='button'
                    onClick={handleOptions}
                    value={option.value}
                    disabled={disabled}
                    className={`w-full text-left px-4 py-2 rounded-md border transition ${
                      isSelected
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

Multiselect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value : PropTypes.string.isRequired,
      label : PropTypes.string.isRequired
    })
  ),
  onChange    : PropTypes.func,
  value       : PropTypes.arrayOf(PropTypes.string),
  className   : PropTypes.string,
  disabled    : PropTypes.bool,
  placeholder : PropTypes.string
}
