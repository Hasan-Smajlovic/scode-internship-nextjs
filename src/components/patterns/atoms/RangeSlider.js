import PropTypes from 'prop-types'
export default function RangeSlider ({ min, max, onChange, value = ' ', step }) {
  return (
    <div className='flex flex-col gap-4 p-4 bg-white shadow-md rounded-lg pt-10'>
      <input
        type='range'
        min={min}
        max={max}
        value={value}
        step={step}
        className='max-w-md'
        onChange={e => onChange(Number(e.target.value))}
      />
      <div>Page: {value}</div>
    </div>
  )
}

RangeSlider.propTypes = {
  min      : PropTypes.number.isRequired,
  max      : PropTypes.number.isRequired,
  onChange : PropTypes.func.isRequired,
  value    : PropTypes.number.isRequired,
  step     : PropTypes.number
}
