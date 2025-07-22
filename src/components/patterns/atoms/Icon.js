import PropTypes from 'prop-types'
import { cloneElement, isValidElement } from 'react'

export default function Icon ({ children, size = 20, color = 'currentColor', className = '' }) {
  if (isValidElement(children)) {
    return cloneElement(children, {
      size,
      color,
      className: `${children.props.className || ''} ${className}`.trim()
    })
  }

  return null
}

Icon.propTypes = {
  children  : PropTypes.element.isRequired,
  size      : PropTypes.number,
  color     : PropTypes.string,
  className : PropTypes.string
}
