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
  className = 'w-50%, border border-gray-300 rounded-md p-2',
  label = 'Text Group',
  icon = null,
  error,
  value = [] // Controlled value from parent
}) {
  const [inputField, setInputField] = useState('')
  const [text, setText] = useState([])

  // Sync internal state when value prop changes
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
    onChange(newText)
  }

  const handleMovingDown = (event) => {
    if (event.key === 'Enter' && inputField.trim() !== '') {
      const newInputField = [...text, inputField.trim()]
      setText(newInputField)
      setInputField('')
      onChange(newInputField)
    }
  }

  const handleChange = (event) => {
    setInputField(event.target.value)
  }

  return (
    <div className='justify-between flex flex-col items-start w-full'>
      <div className={`flex flex-wrap w-full${text.length > 0 ? ' gap-2 mb-2' : ''}`}>
        {text.map((item, index) => (
          <Chip key={index} label={item} onClose={() => handleRemoveItem(index)} />
        ))}
      </div>
      <Label>{label && <span className='text-primary'>{label}</span>}</Label>
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
        >
          {error || `${label} is required`}
        </Alert>
      )}
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
