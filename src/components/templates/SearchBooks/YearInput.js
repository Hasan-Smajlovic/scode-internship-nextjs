import PropTypes from 'prop-types'
import Label from '@/components/patterns/atoms/Label'

export default function YearInput ({ minYear, maxYear, yearFrom, yearTo, onChange }) {
  return (
    <div className='text-sm text-gray-900 w-full'>
      <Label className='block mb-1 text-sm font-medium'>Year Range</Label>
      <div className='flex flex-col sm:flex-row items-center gap-2 w-full'>
        <input
          type='date'
          min={`${minYear}-01-01`}
          max={`${maxYear}-12-31`}
          placeholder={`${minYear}-01-01`}
          value={yearFrom}
          className='h-12 w-full px-3 py-2 border border-gray-300 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
          onChange={e => {
            setTimeout(() => {
              onChange({ yearFrom: e.target.value })
            }, 5000)
          }}
        />
        <span className='text-gray-500 hidden sm:inline'>to</span>
        <span className='text-gray-500 sm:hidden'>↓</span>
        <input
          type='date'
          min={`${minYear}-01-01`}
          max={`${maxYear}-12-31`}
          placeholder={`${maxYear}-12-31`}
          value={yearTo}
          className='h-12 w-full px-3 py-2 border border-gray-300 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
          onChange={e => {
            setTimeout(() => {
              onChange({ yearTo: e.target.value })
            }, 5000)
          }}
        />
      </div>
    </div>
  )
}

YearInput.propTypes = {
  minYear  : PropTypes.number.isRequired,
  maxYear  : PropTypes.number.isRequired,
  onChange : PropTypes.func.isRequired,
  yearFrom : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  yearTo   : PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}
