'use client'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import Input from '../atoms/Input'
import Label from '../atoms/Label'
import Chip from '../atoms/Chip'
import Alert from '../atoms/Alert'

export default function TextGroup ({
  placeholder = 'Insert new value',
  onChange = () => {},
  className = 'h-18 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm',
  label = 'Text Group',
  icon = null,
  error,
  value = []
}) {
  const [inputField, setInputField] = useState('')
  const [text, setText] = useState([])

  useEffect(() => {
    if (Array.isArray(value)) {
      setText(value)
    } else if (typeof value === 'string') {
      const list = value.split(',').map(v => v.trim()).filter(Boolean)
      setText(list)
    } else {
      setText([])
    }
  }, [value])

  const handleRemoveItem = (index) => {
    const newText = [...text]
    newText.splice(index, 1)
    setText(newText)
    if (typeof onChange === 'function') {
      onChange({ target: { value: newText } })
    }
  }

  const handleMovingDown = (event) => {
    if (event.key === 'Enter' && inputField.trim() !== '') {
      const newInputField = [...text, inputField.trim()]
      setText(newInputField)
      setInputField('')
      if (typeof onChange === 'function') {
        onChange({ target: { value: newInputField } })
      }
    }
  }

  const handleChange = (event) => {
    setInputField(event.target.value)
  }

  return (
    <div className='text-sm text-gray-900'>
      <Label className='block mb-1 text-sm font-medium'>{label}</Label>
      <div className='flex flex-col w-full'>
        <div className={`flex flex-wrap w-full${text.length > 0 ? ' gap-2 mb-2' : ''}`}>
          {text.map((item, index) => (
            <Chip key={index} label={item} onClose={() => handleRemoveItem(index)} />
          ))}
        </div>
        <Input
          type='text'
          icon={icon}
          name='text-group'
          placeholder={placeholder}
          value={inputField}
          onChange={handleChange}
          onKeyDown={handleMovingDown}
          className={className}
        />
        {error && (
          <Alert
            type='error'
            position='inline'
            timeout={0}
            className='mt-1'
          >
            {error || `${label} is required`}
          </Alert>
        )}
      </div>
    </div>
  )
}

TextGroup.propTypes = {
  placeholder : PropTypes.string,
  onChange    : PropTypes.func,
  className   : PropTypes.string,
  label       : PropTypes.string,
  icon        : PropTypes.element,
  error       : PropTypes.string,
  value       : PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ])
}
