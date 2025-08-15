import PropTypes from 'prop-types'

import Label from '@/components/patterns/atoms/Label'
import Select from '@/components/patterns/atoms/Select'
import Button from '@/components/patterns/atoms/Button'
import Checkbox from '@/components/patterns/atoms/Checkbox'
import TextGroup from '@/components/patterns/molecules/TextGroup'
import YearInput from '@/components/templates/SearchBooks/YearInput'

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
  const keepOtherLabels = (facetArr, value) =>
    Array.isArray(facetArr)
      ? facetArr.find(item => typeof item === 'object' && item.value === value)?.label || value
      : value

  const prepareFilterOptions = (facets) => {
    const formatOptions = [{ value: '', label: 'Select Format', disabled: true }]
    const genreOptions = [{ value: '', label: 'Select Genre', disabled: true }]
    const yearOptions = [{ value: '', label: 'Select Year', disabled: true }]

    // Process format options
    if (Array.isArray(facets.formats)) {
      facets.formats.forEach(item => {
        const value = typeof item === 'object' ? item.value : item
        const label =
          typeof item === 'object'
            ? `${item.label ?? item.value}${item.count !== undefined ? ` (${item.count})` : ''}`
            : item
        formatOptions.push({ value, label })
      })
    }

    // Process genre options
    if (Array.isArray(facets.genres)) {
      facets.genres.forEach(item => {
        const value = typeof item === 'object' ? item.value : item
        const label =
          typeof item === 'object'
            ? `${item.label ?? item.value}${item.count !== undefined ? ` (${item.count})` : ''}`
            : keepOtherLabels(facets.genres, item)
        genreOptions.push({ value, label })
      })
    }

    // Process year options
    if (Array.isArray(facets.years)) {
      facets.years.forEach(item => {
        const value = typeof item === 'object' ? item.value : item
        const label =
          typeof item === 'object'
            ? `${item.label ?? item.value}${item.count !== undefined ? ` (${item.count})` : ''}`
            : keepOtherLabels(facets.years, item)
        yearOptions.push({ value, label })
      })
    }

    return { formatOptions, genreOptions, yearOptions }
  }

  const prepareKeywordsOptions = (facets) => {
    const keywordsList = []

    // Generate keywords list
    if (Array.isArray(facets.keywords)) {
      facets.keywords.forEach(item => {
        const value = typeof item === 'object' ? item.value : item
        const label = typeof item === 'object'
          ? item.label ?? item.value
          : keepOtherLabels(facets.keywords, item)
        keywordsList.push({ value, label })
      })
    }

    return { keywordsList }
  }

  const { formatOptions, genreOptions, yearOptions } = prepareFilterOptions(facets)
  const { keywordsList } = prepareKeywordsOptions(facets)

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
          options={formatOptions}
          value={format}
          onChange={e => updateFilters({ format: e.target?.value ?? e, page: 1 })}
        />
      </div>
      <div>
        <Label className='block mb-1 text-sm font-medium'>Genre</Label>
        <Select
          options={genreOptions}
          value={genre}
          onChange={e => updateFilters({ genre: e.target?.value ?? e, page: 1 })}
        />
      </div>
      <div>
        <Label className='block text-sm font-medium'>Year</Label>
        <Select
          options={yearOptions}
          value={publishedYear}
          onChange={e => updateFilters({ publishedYear: e.target?.value ?? e, page: 1 })}
        />
      </div>
      <TextGroup
        label='Keywords'
        value={keywords}
        onChange={e => updateFilters({ keywords: e.target?.value ?? e, page: 1 })}
        list={keywordsList.length > 0 ? 'keywordsList' : undefined}
      />
      {keywordsList.length > 0 && (
        <datalist id='keywordsList'>
          {keywordsList.map((keyword, index) => (
            <option key={`keyword-${index}`} value={keyword.value || keyword.label} />
          ))}
        </datalist>
      )}
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
  format        : PropTypes.string,
  genre         : PropTypes.string,
  publishedYear : PropTypes.string,
  newRelease    : PropTypes.bool,
  updateFilters : PropTypes.func,
  keywords      : PropTypes.string,
  yearFrom      : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  yearTo        : PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}
