'use client'

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import Icon from './Icon'
import { MdClose } from 'react-icons/md'

export default function Alert ({ type = 'info', children, timeout = 5000, position = 'bottom-center', onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, timeout)

      return () => clearTimeout(timer)
    }
  }, [timeout])

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible) return null

  const baseStyles = 'p-4 rounded-md shadow-lg transform transition-all duration-500 flex items-center'

  const typeStyles = {
    primary   : 'bg-primary text-white',
    secondary : 'bg-secondary text-white',
    info      : 'bg-blue-100 border border-blue-200 text-info',
    error     : 'bg-orange-100 border border-red-200 text-error',
    danger    : 'bg-red-100 border border-red-200 text-danger',
    warning   : 'bg-yellow-100 border border-yellow-200 text-warning',
    success   : 'bg-green-100 border border-green-200 text-success'
  }

  const positionStyles = {
    'bottom-center' : 'fixed bottom-8 left-1/2 -translate-x-1/2',
    'top-center'    : 'fixed top-8 left-1/2 -translate-x-1/2',
    'top-right'     : 'fixed top-8 right-8',
    'top-left'      : 'fixed top-8 left-8',
    'bottom-right'  : 'fixed bottom-8 right-8',
    'bottom-left'   : 'fixed bottom-8 left-8',
    inline          : 'relative'
  }

  return (
    <div
      className={`
        ${baseStyles} 
        ${typeStyles[type] || typeStyles.info} 
        ${positionStyles[position]}
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      role='alert'
    >
      <div className='mr-8 flex-grow'>{children}</div>
      <button
        className='ml-auto -mr-1 flex-shrink-0 p-1 rounded-full hover:bg-opacity-20 hover:bg-white transition-colors duration-200 focus:outline-none'
        onClick={handleClose}
        aria-label='Close'
      >
        <Icon name={<MdClose />} className='h-4 w-4' />
      </button>
    </div>
  )
}

Alert.show = function ({ type = 'info', children, timeout = 5000, position = 'bottom-center' }) {
  if (typeof window === 'undefined') return

  let container = document.getElementById('alert-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'alert-container'
    document.body.appendChild(container)
  }

  const alertElement = document.createElement('div')
  container.appendChild(alertElement)

  const root = createRoot(alertElement)

  const closeAlert = () => {
    root.unmount()
    if (container.contains(alertElement)) {
      container.removeChild(alertElement)
    }
  }

  root.render(
    <Alert
      type={type}
      timeout={timeout}
      position={position}
      onClose={closeAlert}
    >
      {children}
    </Alert>
  )

  return closeAlert
}

Alert.propTypes = {
  type     : PropTypes.oneOf(['primary', 'secondary', 'info', 'error', 'danger', 'warning', 'success']),
  children : PropTypes.node.isRequired,
  timeout  : PropTypes.number,
  position : PropTypes.oneOf(['bottom-center', 'top-center', 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'inline']),
  onClose  : PropTypes.func
}
