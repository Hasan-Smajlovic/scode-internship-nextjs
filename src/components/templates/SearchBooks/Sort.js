import PropTypes from 'prop-types'

import Select from '@/components/patterns/atoms/Select'
import Label from '@/components/patterns/atoms/Label'

export default function Sort ({ value, onChange, options = [], placeholder = 'Sort by...' }) {
  return (
    <div className='flex flex-col gap-4 p-4 bg-white shadow-lg rounded-xl border border-gray-100'>
      <Label className='text-lg font-semibold'>Sort</Label>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

Sort.propTypes = {
  value    : PropTypes.string.isRequired,
  onChange : PropTypes.func.isRequired,
  options  : PropTypes.arrayOf(
    PropTypes.shape({
      value : PropTypes.string.isRequired,
      label : PropTypes.string.isRequired
    })
  ).isRequired,
  placeholder: PropTypes.string
}
