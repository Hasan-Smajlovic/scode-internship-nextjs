import PropTypes from 'prop-types'
import Input from '../atoms/Input'
import Label from '../atoms/Label'

export default function InputLabel ({ id, label, ...inputProps }) {
  return (
    <div className='mb-4 flex items-center'>
      <Label htmlFor={id} inputName={label} />
      <Input id={id} {...inputProps} className='ml-2 mt-3' />
    </div>
  )
}

InputLabel.propTypes = {
  id    : PropTypes.string.isRequired,
  label : PropTypes.string.isRequired
}
