import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import Multiselect from '../../patterns/molecules/Multiselect'
import Chip from '../../patterns/atoms/Chip'
import Alert from '../../patterns/atoms/Alert'

export default function MultiselectGroup ({
  id,
  name,
  label,
  placeholder,
  onChange,
  options,
  error,
  description,
  value = []
}) {
  const [text, setText] = useState([])

  useEffect(() => {
    console.log('MultiselectGroup syncing value:', value)
    if (Array.isArray(value)) {
      setText(value)
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

  const handleChange = (newText) => {
    setText(newText)
    onChange(newText)
  }

  return (
    <div className='flex flex-col w-full'>
      {label && <Chip key={id} label={label} className='mb-2' />}
      {text.length > 0 && (
        <div className='flex flex-wrap gap-2 mb-2'>
          {text.map((item, index) => (
            <Chip key={index} label={item} onClose={() => handleRemoveItem(index)} />
          ))}
        </div>
      )}
      <Multiselect
        key={text.join(',')}
        id={id}
        name={name}
        placeholder={placeholder}
        options={options}
        value={text}
        onChange={handleChange}
        error={error && <Alert type='error'>{error}</Alert>}
      />
      {error && <div className='text-red-500 text-xs mt-1'>{error}</div>}
      {description && <p className='text-sm text-gray-500 mt-1'>{description}</p>}
    </div>
  )
}

MultiselectGroup.propTypes = {
  id          : PropTypes.string.isRequired,
  name        : PropTypes.string.isRequired,
  label       : PropTypes.string,
  placeholder : PropTypes.string,
  onChange    : PropTypes.func.isRequired,
  options     : PropTypes.arrayOf(PropTypes.object).isRequired,
  error       : PropTypes.string,
  description : PropTypes.string,
  value       : PropTypes.arrayOf(PropTypes.string)
}
