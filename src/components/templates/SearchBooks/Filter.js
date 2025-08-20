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
  yearTo = ''
}) {
  const formatFilterOptions = (facets, selectLabel) => {
    const formatedFacets = [{ value: '', label: `Select ${selectLabel}`, disabled: true }]
    facets.forEach(item => {
      const { value, count } = item
      formatedFacets.push({ value, label: count !== undefined ? `${value} (${count})` : '' })
    })
    return formatedFacets
  }

  // Ensure scalar values for <select> value props
  const getScalar = val => Array.isArray(val) ? (val[0] ?? '') : (val ?? '')

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

  return (
    <div className='flex flex-col gap-6 p-6 bg-white shadow-lg rounded-xl border border-gray-100'>
      <h2 className='text-xl font-bold text-gray-800'>Filter Books</h2>
      <div>
        <Label className='block text-sm font-medium'>Format</Label>
        <Select
          options={formatFilterOptions(facets.formats, 'Format')}
          value={getScalar(format)}
          onChange={e => updateFilters({ format: e.target?.value ?? e, page: 1 })}
        />
      </div>
      <div>
        <Label className='block mb-1 text-sm font-medium'>Genre</Label>
        <Select
          options={formatFilterOptions(facets.genres, 'Genre')}
          value={getScalar(genre)}
          onChange={e => updateFilters({ genre: e.target?.value ?? e, page: 1 })}
        />
      </div>
      <div>
        <Label className='block text-sm font-medium'>Year</Label>
        <Select
          options={formatFilterOptions(facets.years, 'Year')}
          value={getScalar(publishedYear)}
          onChange={e => updateFilters({ publishedYear: e.target?.value ?? e, page: 1 })}
        />
      </div>
      <div>
        <Label className='block text-sm font-medium'>Keyword</Label>
        <Select
          options={formatFilterOptions(facets.keywords, 'Keyword')}
          value={getScalar(keywords)}
          onChange={e => updateFilters({ keywords: e.target?.value ?? e, page: 1 })}
        />
      </div>
      <YearInput minYear={1600} maxYear={2025} yearFrom={yearFrom} yearTo={yearTo} onChange={updateFilters} />
      <Checkbox
        label={<span>Show only new releases</span>}
        checked={!!newRelease}
        onChange={e => updateFilters({ newRelease: e.target.checked ? true : '', page: 1 })}
      />
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
  )
}

Filter.propTypes = {
  facets        : PropTypes.object,
  format        : PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  genre         : PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  publishedYear : PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  newRelease    : PropTypes.bool,
  updateFilters : PropTypes.func,
  keywords      : PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  yearFrom      : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  yearTo        : PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}
