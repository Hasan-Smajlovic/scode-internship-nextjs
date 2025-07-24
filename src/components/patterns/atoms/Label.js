import PropTypes from 'prop-types'

export default function Label ({ children, htmlFor, error, inputName }) {
  return (
    <div className=' mt-2'>
      <label htmlFor={htmlFor} className='block text-sm font-medium text-gray-700 text-center'>
        {children}
      </label>
      {inputName && (
        <p className='text-sm text-primary mt-1'>
          {inputName}
        </p>
      )}
      {error && (
        <p className='text-sm text-danger mt-1'>
          {error}
        </p>
      )}
    </div>
  )
}

Label.propTypes = {
  children  : PropTypes.node.isRequired,
  htmlFor   : PropTypes.string,
  error     : PropTypes.string,
  inputName : PropTypes.string
}
