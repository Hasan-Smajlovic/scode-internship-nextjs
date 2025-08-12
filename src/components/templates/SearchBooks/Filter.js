import PropTypes from 'prop-types'

import Label from '@/components/patterns/atoms/Label'
import Select from '@/components/patterns/atoms/Select'
import Button from '@/components/patterns/atoms/Button'
import Checkbox from '@/components/patterns/atoms/Checkbox'
import TextGroup from '@/components/patterns/molecules/TextGroup'
import RangeSlider from '@/components/patterns/atoms/RangeSlider'

export default function Filter ({
  facets = {},
  format = '',
  genre = '',
  publishedYear = '',
  newRelease = false,
  keywords = '',
  updateFilters
}) {
  // add more facets => Date range
  const handleFilterReset = () => {
    updateFilters({
      format        : '',
      genre         : '',
      publishedYear : '',
      newRelease    : false,
      keywords      : ''
    })
  }

  const formatCounts = (facets.formats || []).reduce((acc, cur) => { // if missing value or count is 0, set to 0 (validating facets)
    acc[cur.value] = cur.count || 0
    return acc
  }, {})

  const genreCounts = (facets.genres || []).reduce((acc, cur) => {
    acc[cur.value] = cur.count || 0
    return acc
  }, {})

  const formatOptions = [
    { value: '', label: 'Select Format', disabled: true },
    {
      value : 'hardcover',
      label : `Hardcover${formatCounts.hardcover > 0 ? ` (${formatCounts.hardcover})` : ''}`
    },
    {
      value : 'paperback',
      label : `Paperback${formatCounts.paperback > 0 ? ` (${formatCounts.paperback})` : ''}`
    },
    {
      value : 'ebook',
      label : `eBook${formatCounts.ebook > 0 ? ` (${formatCounts.ebook})` : ''}`
    },
    {
      value : 'audio',
      label : `Audio Book${formatCounts.audio > 0 ? ` (${formatCounts.audio})` : ''}`
    }
  ]

  const genreOptions = [
    { value: '', label: 'Select Genre', disabled: true },
    {
      value : 'fiction',
      label : `Fiction${genreCounts.fiction > 0 ? ` (${genreCounts.fiction})` : ''}`
    },
    {
      value : 'non-fiction',
      label : `Non-Fiction${genreCounts['non-fiction'] > 0 ? ` (${genreCounts['non-fiction']})` : ''}`
    },
    {
      value : 'science-fiction',
      label : `Science Fiction${genreCounts['science-fiction'] > 0 ? ` (${genreCounts['science-fiction']})` : ''}`
    },
    {
      value : 'fantasy',
      label : `Fantasy${genreCounts.fantasy > 0 ? ` (${genreCounts.fantasy})` : ''}`
    },
    {
      value : 'biography',
      label : `Biography${genreCounts.biography > 0 ? ` (${genreCounts.biography})` : ''}`
    }
  ]

  return (
    <>
      <div className='flex flex-col gap-6 p-6 bg-white shadow-lg rounded-xl border border-gray-100'>
        <h2 className='text-xl font-bold text-gray-800'>Filter Books</h2>
        <div className='space-y-4'>
          <div>
            <div className='text-sm text-gray-900' />
            <Label className='block text-sm font-medium '>Format</Label>
            <Select
              options={formatOptions}
              value={format}
              onChange={e => {
                updateFilters({ format: e.target ? e.target.value : e })
              }}
            />
          </div>
        </div>
        <div>
          <div className='text-sm text-gray-900'>
            <Label className='block mb-1 text-sm font-medium '>Genre</Label>
            <Select
              options={genreOptions}
              value={genre}
              placeholder='Select Genre'
              onChange={e => {
                updateFilters({ genre: e.target ? e.target.value : e })
              }}
            />
          </div>
          <div className='mt-7 text-sm text-gray-900'>
            <Label className='block mb-1 text-sm font-medium'>Year</Label>
            <Select
              options={[
                { value: '', label: 'Select Year', disabled: true },
                ...Array.from({ length: 2025 - 1993 + 1 }, (_, i) => {
                  const yearOption = (1993 + i).toString()
                  return { value: yearOption, label: yearOption }
                })
              ]}
              value={publishedYear}
              placeholder='Select Year'
              onChange={e => {
                updateFilters({ publishedYear: e.target ? e.target.value : e })
              }}
            />
            <div className='mt-7'>
              <TextGroup
                label='Keywords'
                value={keywords}
                className='h-18 w-full px-4 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring md:w-94.5'
                onChange={e => updateFilters({ keywords: e.target.value })}
              />
            </div>
            <div className='mt-7'>
              <RangeSlider
                min={0}
                max={100}
                step={1}
                onChange={value => updateFilters({ rating: value })}
              />
            </div>
          </div>
          <div className='mt-5'>
            <Checkbox
              label={<span>Show only new releases</span>}
              checked={!!newRelease}
              onChange={e => updateFilters({ newRelease: e.target.checked })}
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
  facets        : PropTypes.object,
  format        : PropTypes.string,
  genre         : PropTypes.string,
  publishedYear : PropTypes.string,
  newRelease    : PropTypes.bool,
  updateFilters : PropTypes.func,
  keywords      : PropTypes.string
}
