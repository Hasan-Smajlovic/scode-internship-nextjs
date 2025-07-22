'use client'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

const typeStyles = {
  error  : 'text-error',
  info   : 'text-info',
  danger : 'text-danger'
}

export default function Alert ({ type = 'info', children, timeout = 5000 }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout])

  if (!isVisible) return null

  return (
    <div
      className={classNames(
        'alert',
        'p-4 bottom-24 left-1/2 fixed',
        'rounded-md shadow-lg',
        typeStyles[type],
        '-translate-x-1/2 transform transition-opacity',
        'duration-500',
        {
          'opacity-100' : isVisible,
          'opacity-0'   : !isVisible
        }
      )}
    >
      <button
        className={`absolute top-2 right-4 font-bold p-1 ${type === 'error' ? 'text-error' : 'text-info'}`}
        onClick={() => setIsVisible(false)}
      >
        &times;
      </button>
      <div className='mr-6'>{children}</div>
    </div>
  )
}

Alert.propTypes = {
  type     : PropTypes.oneOf(['error', 'info', 'danger']),
  children : PropTypes.node.isRequired,
  timeout  : PropTypes.number
}
