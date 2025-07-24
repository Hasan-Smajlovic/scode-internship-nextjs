import React from 'react'
import PropTypes from 'prop-types'

import Button from '../../patterns/atoms/Button'
import Alert from '../../patterns/atoms/Alert'
import InputLabel from '../../patterns/molecules/InputLabel'

export default function BooksGroup ({
  name,
  value,
  onChange,
  onRemove,
  className = ''
}) {
  return (
    <>
      <Button onClick={onRemove} className={`mb-2 ${className}`}>
        Remove {name}
      </Button>
      <InputLabel
        label={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='mb-2'
      />
      {value && (
        <Alert type='success' className='mb-2'>
          {name} has been added successfully!
        </Alert>
      )}
      <Button
        variant='secondary'
        onClick={() => Alert.show({
          type     : 'info',
          children : `You clicked on ${name}`,
          position : 'top-right'
        })}
        className='mt-2'
      >
        Click Me
      </Button>
    </>
  )
}
BooksGroup.propTypes = {
  name      : PropTypes.string.isRequired,
  value     : PropTypes.string.isRequired,
  onChange  : PropTypes.func.isRequired,
  onRemove  : PropTypes.func,
  className : PropTypes.string
}
