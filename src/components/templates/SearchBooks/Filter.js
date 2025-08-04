import PropTypes from 'prop-types'

import Label from '@/components/patterns/atoms/Label'
import Select from '@/components/patterns/atoms/Select'
import SearchCheckbox from '@/components/patterns/atoms/SearchCheckbox'
import RangeSlider from '@/components/patterns/atoms/RangeSlider'
import Button from '@/components/patterns/atoms/Button'

export default function Filter ({ value, onChange, placeholder = 'Filter...' }) {
  return (
    <div className='flex flex-col gap-6 p-6 bg-white shadow-lg rounded-xl border border-gray-100'>
      <h2 className='text-xl font-bold text-gray-800'>Filter Books</h2>

      <div className='space-y-4'>
        <div>
          <Label className='block mb-1 text-sm font-medium text-gray-700'>Format</Label>
          <Select
            options={[
              { value: 'hardcover', label: 'Hardcover' },
              { value: 'paperback', label: 'Paperback' },
              { value: 'ebook', label: 'eBook' },
              { value: 'audio', label: 'Audio Book' }
            ]}
            value={value}
            placeholder='Select Format'
            onChange={onChange}
          />
        </div>

        <div>
          <Label className='block mb-1 text-sm font-medium text-gray-700'>Genre</Label>
          <Select
            options={[
              { value: 'fiction', label: 'Fiction' },
              { value: 'non-fiction', label: 'Non-Fiction' },
              { value: 'science-fiction', label: 'Science Fiction' },
              { value: 'fantasy', label: 'Fantasy' },
              { value: 'biography', label: 'Biography' }
            ]}
            value={value}
            placeholder='Select Genre'
            onChange={onChange}
          />
        </div>
        <div>
          <Label className='block mb-1 text-sm font-medium text-gray-700'>Page Count</Label>
          <RangeSlider
            min={0}
            max={1000}
            value={value}
            onChange={onChange}
          />
        </div>
        <div className='pt-2'>
          <SearchCheckbox
            value={value}
            checked={value}
            onChange={onChange}
            label='New Releases'
            className='text-sm font-medium text-gray-700'
          />
        </div>
      </div>

      <div className='flex justify-end pt-4'>
        <Button
          type='button'
          variant='primary'
          className='px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200'
          onClick={() => onChange('')}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  )
}

Filter.propTypes = {
  value       : PropTypes.string.isRequired,
  onChange    : PropTypes.func.isRequired,
  placeholder : PropTypes.string
}
