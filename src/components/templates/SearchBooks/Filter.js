import PropTypes from 'prop-types'

import Label from '@/components/patterns/atoms/Label'
import Select from '@/components/patterns/atoms/Select'
import RangeSlider from '@/components/patterns/atoms/RangeSlider'
import Button from '@/components/patterns/atoms/Button'

export default function Filter ({
  format = '', onFormatChange = () => {
  },
  genre = '', onGenreChange = () => {
  },
  pageCount = [0, 100], onPageCountChange = () => {
  }
}) {
  const handleFilterReset = () => {
    onFormatChange('')
    onGenreChange('')
    onPageCountChange([0, 100])
  }

  return (
    <div className='flex flex-col gap-6 p-6 bg-white shadow-lg rounded-xl border border-gray-100'>
      <h2 className='text-xl font-bold text-gray-800'>Filter Books</h2>
      <div className='space-y-4'>
        <div>
          <Label className='block mb-1 text-sm font-medium text-gray-700'>Format</Label>
          <Select
            options={[
              { value: '', label: 'Select Format', disabled: true },
              { value: 'hardcover', label: 'Hardcover' },
              { value: 'paperback', label: 'Paperback' },
              { value: 'ebook', label: 'eBook' },
              { value: 'audio', label: 'Audio Book' }
            ]}
            value={format}
            onChange={e => onFormatChange(e.target ? e.target.value : e)}
          />
        </div>
        <div>
          <Label className='block mb-1 text-sm font-medium text-gray-700'>Genre</Label>
          <Select
            options={[
              { value: '', label: 'Select Genre', disabled: true },
              { value: 'fiction', label: 'Fiction' },
              { value: 'non-fiction', label: 'Non-Fiction' },
              { value: 'science-fiction', label: 'Science Fiction' },
              { value: 'fantasy', label: 'Fantasy' },
              { value: 'biography', label: 'Biography' }
            ]}
            value={genre}
            placeholder='Select Genre'
            onChange={e => onGenreChange(e.target ? e.target.value : e)}
          />
        </div>

        <div>
          <label className='block mb-1 text-sm font-medium text-gray-700'>Page Count</label>
          <RangeSlider
            min={0}
            max={100}
            step={1}
            value={pageCount}
            onChange={onPageCountChange}
          />
        </div>
      </div>

      <div className='flex justify-between pt-2'>
        <Button
          type='button'
          variant='primary'
          className='px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200'
          onClick={() => {
            handleFilterReset()
          }}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  )
}

Filter.propTypes = {
  format            : PropTypes.string,
  onFormatChange    : PropTypes.func,
  genre             : PropTypes.string,
  onGenreChange     : PropTypes.func,
  pageCount         : PropTypes.array,
  onPageCountChange : PropTypes.func
}
