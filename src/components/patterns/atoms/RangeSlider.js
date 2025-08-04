import PropTypes from 'prop-types'

export default function RangeSlider ({ min, max, value, onChange }) {
  return (
    <div className='flex flex-col gap-4 p-4 bg-white shadow-md rounded-lg pt-10'>
      <input
        type='range'
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className='w-full'
      />
      <div className='flex justify-between'>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
RangeSlider.propTypes = {
  min      : PropTypes.number.isRequired,
  max      : PropTypes.number.isRequired,
  value    : PropTypes.number.isRequired,
  onChange : PropTypes.func.isRequired
}
