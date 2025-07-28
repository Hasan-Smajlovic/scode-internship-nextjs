import PropTypes from 'prop-types'

export default function Label ({ children, htmlFor, error, inputName }) {
  return (
    <div className=''>
      <label htmlFor={htmlFor} className='text-sm text-primary'>
        {children}
      </label>
      {inputName && (
        <p className='text-sm text-primary'>
          {inputName}
        </p>
      )}
      {error && (
        <p className='text-sm text-danger'>
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
