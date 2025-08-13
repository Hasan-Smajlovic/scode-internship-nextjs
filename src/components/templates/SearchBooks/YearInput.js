import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react'

import Label from '@/components/patterns/atoms/Label'

export default function YearInput ({ minYear, maxYear, value, onChange }) {
  const [localValue, setLocalValue] = useState(['', ''])
  const lastPropValue = useRef(value)

  useEffect(() => {
    if (
      Array.isArray(value) &&
      value.length === 2 &&
      (value[0] !== lastPropValue.current[0] || value[1] !== lastPropValue.current[1])
    ) {
      setLocalValue([
        value[0] !== undefined && value[0] !== null ? String(value[0]) : '',
        value[1] !== undefined && value[1] !== null ? String(value[1]) : ''
      ])
      lastPropValue.current = value
    }
  }, [value])

  const handleChange = (index, newVal) => {
    if (newVal === '' || /^\d{0,4}$/.test(newVal)) {
      const newLocalValue = [...localValue]
      newLocalValue[index] = newVal
      setLocalValue(newLocalValue)
      if (newVal.length === 4 || newVal === '') {
        const outputValue = newLocalValue.map(val =>
          val === '' ? '' : Number(val)
        )
        onChange(outputValue)
        lastPropValue.current = outputValue
      }
    }
  }

  return (
    <div className='mt-5 text-sm text-gray-900'>
      <Label className='block mb-1 text-sm font-medium'>Year Range</Label>
      <div className='flex items-center gap-2 w-full'>
        <input
          type='text'
          inputMode='numeric'
          maxLength={4}
          placeholder={minYear}
          value={localValue[0]}
          className='h-12 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
          onChange={e => handleChange(0, e.target.value)}
        />
        <span className='text-gray-500'>to</span>
        <input
          type='text'
          inputMode='numeric'
          maxLength={4}
          placeholder={maxYear}
          value={localValue[1]}
          className='h-12 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
          onChange={e => handleChange(1, e.target.value)}
        />
      </div>
    </div>
  )
}

YearInput.propTypes = {
  minYear  : PropTypes.number.isRequired,
  maxYear  : PropTypes.number.isRequired,
  value    : PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  onChange : PropTypes.func.isRequired
}

YearInput.defaultProps = {
  value: ['', '']
}
