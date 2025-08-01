import PropTypes from 'prop-types'
import Label from '../atoms/Label'
import Alert from '../atoms/Alert'

export default function Textarea ({
  label,
  value,
  onChange,
  placeholder = 'Enter text here',
  className = '',
  error,
  rows = 4,
  ...rest
}) {
  return (
    <div className={`relative ${className}`}>
      {label && <Label>{label}</Label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='mt-3 w-full h-15 px-4 border p-4 bg-gray-50 border-gray-300 rounded-md outline:none focus:outline-none focus:ring-2 focus:ring-blue-500'
        rows={rows}
        {...rest}
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

Textarea.propTypes = {
  label       : PropTypes.string,
  value       : PropTypes.string.isRequired,
  onChange    : PropTypes.func.isRequired,
  placeholder : PropTypes.string,
  className   : PropTypes.string,
  error       : PropTypes.string,
  rows        : PropTypes.number
}
