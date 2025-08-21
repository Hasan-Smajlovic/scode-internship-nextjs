import PropTypes from 'prop-types'

import Label from '@/components/patterns/atoms/Label'
import Select from '@/components/patterns/atoms/Select'
import Button from '@/components/patterns/atoms/Button'
import Checkbox from '@/components/patterns/atoms/Checkbox'
import YearInput from '@/components/patterns/molecules/YearInput'

export default function Filter ({
  facets = {},
  updateFilters,
  format = '',
  genre = '',
  publishedYear = '',
  newRelease = false,
  keywords = '',
  yearFrom = '',
  yearTo = '',
  initialFilters = {},
  isContentPage = false
}) {
  const formatFilterOptions = (facets, selectLabel) => {
    const formatedFacets = [{ value: '', label: `Select ${selectLabel}`, disabled: true }]
    facets.forEach(item => {
      const { value, count } = item
      formatedFacets.push({ value, label: count !== undefined ? `${value} (${count})` : '' })
    })
    return formatedFacets
  }

  const handleFilterReset = () => {
    updateFilters({
      format        : '',
      genre         : '',
      publishedYear : '',
      newRelease    : '',
      keywords      : '',
      yearFrom      : '',
      yearTo        : ''
    })
  }
  const getScalar = (val) => {
    if (val === null || val === undefined) return ''
    if (typeof val === 'string' || typeof val === 'number') return val
    if (Array.isArray(val)) return val.length > 0 ? String(val[0]) : ''
    return String(val)
  }

  // Helper function to check if a value is effectively set
  const isValueSet = (value) => {
    if (value === undefined || value === null) return false
    if (value === '') return false
    if (Array.isArray(value) && value.length === 0) return false
    // handle MongoDB query objects like
    if (typeof value === 'object' && !Array.isArray(value)) {
      if (Object.keys(value).length === 0) return false
      if (value.$gte !== undefined || value.$lte !== undefined) return true
    }
    return true
  }

  // check initialfilters to check what to show
  const showFormat = !isValueSet(initialFilters.format)
  const showGenre = !isValueSet(initialFilters.genre)
  const showYear = !isValueSet(initialFilters.publishedYear) && !isValueSet(initialFilters.year)
  const showKeywords = !isValueSet(initialFilters.keywords)
  const showYearRange = !(isValueSet(initialFilters.yearFrom) || isValueSet(initialFilters.yearTo))
  const showNewRelease = initialFilters.newRelease !== true && initialFilters.newRelease !== false
  const showClearFilters = !isContentPage && (showFormat || showGenre || showYear ||
  showKeywords || showYearRange || showNewRelease)

  return (
    <div className='flex flex-col gap-6 p-6 bg-white rounded-xl'>
      <div className='border-b border-gray-200 pb-4'>
        <h2 className='text-xl font-bold text-gray-800 flex items-center'>
          Filter Books
        </h2>
      </div>

      <div className='space-y-6'>
        {showFormat && (
          <div className='space-y-2'>
            <Label className='block text-sm font-medium text-gray-700'>Format</Label>
            <Select
              options={formatFilterOptions(facets.formats, 'Format')}
              value={getScalar(format)}
              onChange={e => updateFilters({ format: e.target?.value ?? e, page: 1 })}
              className='w-full rounded-lg border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
        )}

        {showGenre && (
          <div className='space-y-2'>
            <Label className='block mb-1 text-sm font-medium text-gray-700'>Genre</Label>
            <Select
              options={formatFilterOptions(facets.genres, 'Genre')}
              value={getScalar(genre)}
              onChange={e => updateFilters({ genre: e.target?.value ?? e, page: 1 })}
              className='w-full rounded-lg border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
        )}

        {showYear && (
          <div className='space-y-2'>
            <Label className='block text-sm font-medium text-gray-700'>Year</Label>
            <Select
              options={formatFilterOptions(facets.years, 'Year')}
              value={(publishedYear)}
              onChange={e => updateFilters({ publishedYear: e.target?.value ?? e, page: 1 })}
              className='w-full rounded-lg border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
        )}

        {showKeywords && (
          <div className='space-y-2'>
            <Label className='block text-sm font-medium text-gray-700'>Keyword</Label>
            <Select
              options={formatFilterOptions(facets.keywords, 'Keyword')}
              value={getScalar(keywords)}
              onChange={e => updateFilters({ keywords: e.target?.value ?? e, page: 1 })}
              className='w-full rounded-lg border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:ring-blue-500'
            />
          </div>
        )}

        {showYearRange && (
          <div className='space-y-2'>
            <YearInput
              minYear={1600}
              maxYear={2025}
              yearFrom={getScalar(yearFrom)}
              yearTo={getScalar(yearTo)}
              onChange={updateFilters}
            />
          </div>
        )}

        {showNewRelease && (
          <div className='flex items-center pt-2'>
            <Checkbox
              label={<span className='text-sm font-medium text-gray-700'>Show only new releases</span>}
              checked={!!newRelease}
              onChange={e => updateFilters({ newRelease: e.target.checked ? true : '', page: 1 })}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
          </div>
        )}

        {showClearFilters && (
          <div className='flex justify-between pt-4 border-t border-gray-200'>
            <Button
              type='button'
              variant='primary'
              className='px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              onClick={handleFilterReset}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

Filter.propTypes = {
  facets         : PropTypes.object,
  format         : PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  genre          : PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  publishedYear  : PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  newRelease     : PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  updateFilters  : PropTypes.func,
  keywords       : PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  yearFrom       : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  yearTo         : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  initialFilters : PropTypes.object,
  isContentPage  : PropTypes.bool
}
