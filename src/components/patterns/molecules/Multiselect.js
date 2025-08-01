'use client'
import { useState } from 'react'
import PropTypes from 'prop-types'

import Button from '../atoms/Button'
import Label from '../atoms/Label'

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
  value = [], // controlled prop
  className = '',
  disabled = false,
  placeholder = '',
  label = 'Select options'
}) {
  const [open, setOpen] = useState(false)

  const toggleDropdown = (event) => {
    if (disabled) return
    if (!open) {
      document.addEventListener('click', handleGlobalClick, true) // <-- useCapture = true
      document.addEventListener('keydown', handleEscape)
    } else {
      document.removeEventListener('click', handleGlobalClick, true) // <-- must match the above
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

  // Use the passed `value` prop directly, no internal state
  const selectedOptions = value

  const handleOptions = (event) => {
    const selectedValue = event.target.value
    let updated = []

    if (selectedOptions.includes(selectedValue)) {
      updated = selectedOptions.filter(option => option !== selectedValue)
    } else {
      updated = [...selectedOptions, selectedValue]
    }

    onChange(updated)
  }

  const handleReset = (event) => {
    event.preventDefault()
    onChange([])
    setOpen(false)
  }

  return (
    <div className='relative dropdown-container justify-between flex flex-col items-start gap-1 mt-4'>
      {label && <label className='text-primary'>{label}</label>}
      <Label>{placeholder && <span className='text-gray-500'>{placeholder}</span>}</Label>

      <div className={`flex flex-wrap gap-2 ${className}`}>
        <Button
          type='button'
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
                    onClick={e => {
                      e.stopPropagation()
                      handleOptions(e)
                    }}
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
  placeholder : PropTypes.string,
  label       : PropTypes.string
}
