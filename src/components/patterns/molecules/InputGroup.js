import Input from '../atoms/Input'
import Checkbox from '../atoms/Checkbox'
import Select from '../atoms/Select'
import PropTypes from 'prop-types'
import Icon from '../atoms/Icon'

export default function InputGroup ({
  icon,
  placeholder = '',
  type = 'text',
  iconPosition = 'right',
  iconSize = 20,
  iconColor = '#6B7280',
  className = '',
  containerClassName = '',
  options = [],
  label = '',
  ...props
}) {
  if (type === 'checkbox') {
    return (
      <div className={`flex items-center justify-center mt-10 ${containerClassName}`}>
        <Checkbox
          label={label}
          className={` ${className}`}
          {...props}
        />
      </div>
    )
  }

  if (type === 'select') {
    return (
      <div className={`flex items-center justify-center mt-10 ${containerClassName}`}>
        <Select
          options={options}
          label={label}
          placeholder={placeholder}
          className={`w-full max-w-md ${className}`}
          {...props}
        />
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center mt-10 ${containerClassName}`}>
      <div className='flex items-center justify-center border rounded px-2 py-1 w-full max-w-md'>
        {icon && iconPosition === 'left' && (
          <span className='text-gray-400 mr-2'>
            <Icon size={iconSize} color={iconColor}>
              {icon}
            </Icon>
          </span>
        )}
        <Input
          type={type}
          placeholder={placeholder}
          className={`flex-1 p-2 outline-none focus:outline-none border-none ${className}`}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className='text-gray-400 ml-2'>
            <Icon size={iconSize} color={iconColor}>
              {icon}
            </Icon>
          </span>
        )}
      </div>
    </div>
  )
}

InputGroup.propTypes = {
  icon               : PropTypes.element,
  type               : PropTypes.string,
  placeholder        : PropTypes.string,
  iconPosition       : PropTypes.oneOf(['left', 'right']),
  iconSize           : PropTypes.number,
  iconColor          : PropTypes.string,
  className          : PropTypes.string,
  containerClassName : PropTypes.string,
  options            : PropTypes.array,
  label              : PropTypes.string
}

InputGroup.defaultProps = {
  iconPosition       : 'right',
  iconSize           : 20,
  iconColor          : '#6B7280',
  className          : '',
  containerClassName : ''
}
