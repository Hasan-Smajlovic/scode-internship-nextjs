import PropTypes from 'prop-types'

export default function Label ({ children, htmlFor, error, inputName }) {
  return (
    <div className='mb-4'>
      <label htmlFor={htmlFor} className='block text-sm font-medium text-gray-700 text-center'>
        {children}
      </label>
      {inputName && (
        <p className='text-sm text-gray-500 mt-1'>
          {inputName}
        </p>
      )}
      {error && (
        <p className='text-sm text-red-500 mt-1'>
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
