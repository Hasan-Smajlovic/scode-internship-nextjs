import Input from '../atoms/Input'
import PropTypes from 'prop-types'
import Icon from '../atoms/Icon'

export default function InputGroup ({
  iconName,
  placeholder = '',
  type = 'text',
  iconPosition = 'right',
  iconSize = 20,
  iconColor = '#6B7280',
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <div className={`flex items-center justify-center mt-10 ${containerClassName}`}>
      <div className='flex items-center justify-center border rounded px-2 py-1 w-full max-w-md'>
        {iconName && iconPosition === 'left' && (
          <span className='text-gray-400 mr-2'>
            <Icon name={iconName} size={iconSize} color={iconColor} />
          </span>
        )}
        <Input
          type={type}
          className={`flex-1 p-2 outline-none focus:outline-none active:outline-none border-none ${className}`}
          placeholder={placeholder}
          {...props}
        />
        {iconName && iconPosition === 'right' && (
          <span className='text-gray-400 ml-2'>
            <Icon name={iconName} size={iconSize} color={iconColor} />
          </span>
        )}
      </div>
    </div>
  )
}

InputGroup.propTypes = {
  iconName           : PropTypes.oneOf(['user', 'mail', 'phone', 'lock', 'search']),
  type               : PropTypes.string,
  placeholder        : PropTypes.string,
  iconPosition       : PropTypes.oneOf(['left', 'right']),
  iconSize           : PropTypes.number,
  iconColor          : PropTypes.string,
  className          : PropTypes.string,
  containerClassName : PropTypes.string
}
