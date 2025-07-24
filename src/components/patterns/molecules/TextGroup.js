import PropTypes from 'prop-types'
import { useState } from 'react'

import Input from '../atoms/Input'
import Label from '../atoms/Label'
import Chip from '../atoms/Chip'

export default function TextGroup ({
  placeholder = 'Insert new value ',
  onChange = () => {},
  className = 'w-50%, border border-gray-300 rounded-md p-2',
  label = 'Text Group'
}) {
  const [inputField, setInputField] = useState('')
  const [text, setText] = useState([])

  const handleRemoveItem = (index) => {
    const newText = [...text]
    newText.splice(index, 1)
    setText(newText)
  }

  const handleMovingDown = (event) => {
    if (event.key === 'Enter' && inputField.trim() !== '') {
      const newInputField = [...text, inputField.trim()]
      setText(newInputField)
      setInputField('')
    }
  }
  const handleChange = (event) => {
    setInputField(event.target.value)
    onChange(event.target.value)
  }

  return (
    <div className='justify-between flex flex-col items-start'>
      <Label> {label && <span className='text-gray-500'>{label}</span>} </Label>
      {text.map((text, index) => (
        <Label key={index} className='text-gray-700'>
          <Chip label={text} onClose={() => handleRemoveItem(index)} />
        </Label>
      ))}
      <Input
        type='text'
        placeholder={placeholder}
        value={inputField}
        onChange={handleChange}
        onKeyDown={handleMovingDown}
        className={className}
      />
      <div className='flex flex-wrap' />
    </div>

  )
}

TextGroup.propTypes = {
  placeholder : PropTypes.string,
  onChange    : PropTypes.func,
  className   : PropTypes.string,
  label       : PropTypes.string
}
