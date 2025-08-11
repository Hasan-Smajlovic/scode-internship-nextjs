import PropTypes from 'prop-types'

import Label from '@/components/patterns/atoms/Label'
import Select from '@/components/patterns/atoms/Select'
import Button from '@/components/patterns/atoms/Button'
import Checkbox from '@/components/patterns/atoms/Checkbox'

export default function Filter ({
  facets = {},
  format = '', onFormatChange = () => {},
  genre = '', onGenreChange = () => {},
  year = '', onYearChange = () => {},
  newRelease = false, onNewReleaseChange = () => {},
  pageCount = [0, 100], onPageCountChange = () => {}
}) {
  const handleFilterReset = () => {
    onFormatChange('Testing if it will reach here') // it didnt react here, have to fix it tomorrow
    onGenreChange('')
    onPageCountChange([0, 100])
    console.log('Filter reset:', format, genre, pageCount) // filters do not reset, they still hold old values
  }

  const formatCounts = (facets.formats || []).reduce((acc, cur) => {
    acc[cur.value] = cur.count
    return acc
  }, {})

  const formatOptions = [
    { value: 'all', label: 'All' },
    { value: 'hardcover', label: `Hardcover (${formatCounts.hardcover || 0})` },
    { value: 'paperback', label: `Paperback (${formatCounts.paperback || 0})` },
    { value: 'ebook', label: `eBook (${formatCounts.ebook || 0})` },
    { value: 'audio', label: `Audio Book (${formatCounts.audio || 0})` }
  ]

  return (
    <>
      <div className='flex flex-col gap-6 p-6 bg-white shadow-lg rounded-xl border border-gray-100'>
        <h2 className='text-xl font-bold text-gray-800'>Filter Books</h2>
        <div className='space-y-4'>
          <div>
            <div className='text-sm text-gray-500' />
            <Label className='block text-sm font-medium '>Format</Label>
            <Select
              options={formatOptions}
              value={format}
              onChange={e => onFormatChange(e.target ? e.target.value : e)}
            />
          </div>
        </div>
        <div>
          <div className='text-sm text-gray-500'>
            <Label className='block mb-1 text-sm font-medium '>Genre</Label>
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
          <div className='mt-7 text-sm text-gray-500'>
            <Label className='block mb-1 text-sm font-medium'>Year</Label>
            <Select
              options={[
                { value: '', label: 'Select Year', disabled: true },
                ...Array.from({ length: 2025 - 1993 + 1 }, (_, i) => {
                  const yearOption = (1993 + i).toString()
                  return { value: yearOption, label: yearOption }
                })
              ]}
              value={year}
              placeholder='Select Year'
              onChange={e => onYearChange(e.target ? e.target.value : e)}
            />
          </div>
          <div className='mt-5'>
            <Checkbox
              label={<span>Show only new releases</span>}
              checked={newRelease}
              onChange={e => onNewReleaseChange(e.target.checked)}
            />
          </div>
        </div>
        <div className='flex justify-between pt-2'>
          <Button
            type='button'
            variant='primary'
            className='px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200'
            onClick={handleFilterReset}
          >
            Clear Filters
          </Button>
        </div>
      </div>

    </>
  )
}

Filter.propTypes = {
  facets             : PropTypes.object,
  format             : PropTypes.string,
  onFormatChange     : PropTypes.func,
  genre              : PropTypes.string,
  onGenreChange      : PropTypes.func,
  pageCount          : PropTypes.array,
  onPageCountChange  : PropTypes.func,
  year               : PropTypes.string,
  onYearChange       : PropTypes.func,
  newRelease         : PropTypes.bool,
  onNewReleaseChange : PropTypes.func
}
