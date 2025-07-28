import React from 'react'
import PropTypes from 'prop-types'
import { MdClose } from 'react-icons/md'
import Icon from '../atoms/Icon'

function Chip ({
  label,
  onClose,
  icon = <MdClose />
}) {
  const handleClose = (event) => {
    event.stopPropagation()
    if (onClose) {
      onClose(event)
    }
  }

  return (
    <div className='w-29 h-10 bg-primary text-white inline-flex items-center justify-between px-2 py-1 border-2 rounded-md text-sm font-medium'>
      <span className='flex-grow'>{label}</span>
      <button
        onClick={handleClose}
        className='ml-2 text-white hover:text-secondary focus:outline-none'
        aria-label='Remove'
      >
        <Icon className='h-4 w-4'>{icon}</Icon>
      </button>
    </div>
  )
}

Chip.propTypes = {
  label   : PropTypes.string.isRequired,
  onClose : PropTypes.func.isRequired,
  icon    : PropTypes.element
}

export default Chip
