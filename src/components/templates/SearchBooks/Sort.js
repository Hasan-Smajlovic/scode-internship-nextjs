import PropTypes from 'prop-types'

import Select from '@/components/patterns/atoms/Select'
import Label from '@/components/patterns/atoms/Label'

export default function Sort ({ value, onChange, options = [] }) {
  return (
    <div className='mt-5 relative left-0 md:left-0 w-full md:w-30 md: mb-5 flex flex-col p-2 gap-2 bg-white shadow-lg rounded-xl border border-gray-100'>
      <Label className='text-lg font-semibold'>Sort</Label>
      <Select
        options={options}
        value={value}
        onChange={onChange}
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
  ).isRequired
}
