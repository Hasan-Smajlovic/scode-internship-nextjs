import PropTypes from 'prop-types'
import Label from '@/components/patterns/atoms/Label'

export default function YearInput ({ minYear, maxYear, yearFrom, yearTo, onChange }) {
  return (
    <div className='text-sm text-gray-900 w-full'>
      <Label className='block mb-1 text-sm font-medium'>Year Range</Label>
      <div className='flex flex-col xs:flex-row items-center gap-2 w-full'>
        <div className='w-full'>
          <input
            type='date'
            min={`${minYear}-01-01`}
            max={`${maxYear}-12-31`}
            placeholder={`${minYear}-01-01`}
            value={yearFrom}
            className='h-10 sm:h-12 w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md mt-4 bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
            onChange={e => {
              onChange({ yearFrom: e.target.value, page: 1 })
            }}
          />
        </div>
        <span className='text-gray-500 hidden xs:inline my-1'>to</span>
        <span className='text-gray-500 xs:hidden my-1'>to</span>
        <div className='w-full'>
          <input
            type='date'
            min={`${minYear}-01-01`}
            max={`${maxYear}-12-31`}
            placeholder={`${maxYear}-12-31`}
            value={yearTo}
            className='h-10 sm:h-12 w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
            onChange={e => {
              onChange({ yearTo: e.target.value, page: 1 })
            }}
          />
        </div>
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
