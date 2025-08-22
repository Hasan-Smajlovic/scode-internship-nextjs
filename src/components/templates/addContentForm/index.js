'use client'
import { useState, useEffect } from 'react'

import InputLabel from '@/components/patterns/molecules/InputLabel'
import Textarea from '@/components/patterns/molecules/Textarea'
import MultiSelectGroup from '@/components/patterns/molecules/MultiselectGroup'
import Checkbox from '@/components/patterns/atoms/Checkbox'
import Button from '@/components/patterns/atoms/Button'
import YearInput from '@/components/patterns/molecules/YearInput'
import Alert from '@/components/patterns/atoms/Alert'
import Sort from '@/components/templates/SearchBooks/Sort'

export default function AddContentForm () {
  const [formData, setFormData] = useState({
    title       : '',
    description : '',
    format      : [],
    genre       : [],
    year        : [],
    keywords    : [],
    yearFrom    : null,
    yearTo      : null,
    newRelease  : false,
    sort        : 'title ASC'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [facets, setFacets] = useState({
    format   : [],
    genre    : [],
    year     : [],
    keywords : []
  })

  // Format filter options for dropdowns
  const formatFilterOptions = (facets, selectLabel) => {
    const formatedFacets = [{ value: '', label: `Select ${selectLabel}`, disabled: true }]
    facets.forEach(item => {
      const { value, count } = item
      formatedFacets.push({ value, label: count !== undefined ? `${value} (${count})` : '' })
    })
    return formatedFacets
  }

  // title and description
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  // format, genre, year, keywords
  const handleMultiselectChange = (name, selectedOptions) => {
    const updatedFormData = { ...formData, [name]: selectedOptions }
    setFormData(updatedFormData)
    fetchFacets(updatedFormData)
  }
  // year
  const handleYearRangeChange = ({ yearFrom, yearTo }) => {
    setFormData(prev => ({
      ...prev,
      yearFrom : yearFrom !== undefined ? yearFrom : prev.yearFrom,
      yearTo   : yearTo !== undefined ? yearTo : prev.yearTo
    }))
  }
  // checkbox
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  // handle sort change
  const handleSortChange = (value) => {
    setFormData(prev => ({ ...prev, sort: value }))
  }

  // reset
  const handleReset = () => {
    setFormData({
      title       : '',
      description : '',
      format      : [],
      genre       : [],
      year        : [],
      keywords    : [],
      yearFrom    : null,
      yearTo      : null,
      newRelease  : false,
      sort        : 'title ASC'
    })
  }

  // Fetching facets.filters
  const fetchFacets = async () => {
    try {
      const response = await fetch('/api/get-facets', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({ filters: {} })
      })
      const data = await response.json()
      if (data.success && data.facets) setFacets(data.facets)
    } catch (error) {
      console.error('Error fetching facets:', error)
    }
  }
  useEffect(() => {
    fetchFacets()
  }, [])

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/add-content-form', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success) {
        setFormData({
          title       : '',
          description : '',
          format      : [],
          genre       : [],
          year        : [],
          keywords    : [],
          yearFrom    : null,
          yearTo      : null,
          newRelease  : false,
          sort        : 'title ASC'
        })
        await fetchFacets()
      } else {
        Alert.show({
          type      : 'error',
          message   : data.error || 'Failed to add content. Please try again.',
          className : 'mb-6'
        })
      }
    } catch (error) {
      Alert.show({
        type      : 'error',
        message   : 'An unexpected error occurred. Please try again.',
        className : 'mb-6'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10'>
      <form className='w-full max-w-6xl mx-auto' onSubmit={handleSubmit}>
        <div className='w-full mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-lg rounded-lg'>
          <div className='mb-8 text-center'>
            <h2 className='text-3xl font-bold text-slate-800 mb-2'>Add New Content</h2>
            <p className='text-slate-600'>Fill out the form below to add your personalized page</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6'>

            <div>
              <InputLabel
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                placeholder='Enter content title'
                label='Title'
                className='w-full'
              />
            </div>
            <div>
              <Textarea
                label='Description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                placeholder='Enter a description of the content'
                rows={3}
                className='w-full'
              />
            </div>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6'>
            <div>
              <MultiSelectGroup
                id='format'
                name='format'
                value={formData.format}
                onChange={(selected) => handleMultiselectChange('format', selected)}
                placeholder='Select format...'
                options={formatFilterOptions(facets.format || [], 'Format')}
                className='w-full'
              />
            </div>
            <div>
              <MultiSelectGroup
                id='genre'
                name='genre'
                value={formData.genre}
                onChange={(selected) => handleMultiselectChange('genre', selected)}
                placeholder='Select genres...'
                options={formatFilterOptions(facets.genre || [], 'Genre')}
                className='w-full'
              />
            </div>
            <div>
              <MultiSelectGroup
                id='year'
                name='year'
                value={formData.year}
                onChange={(selected) => handleMultiselectChange('year', selected)}
                placeholder='Select years...'
                options={formatFilterOptions(facets.year || [], 'Year')}
                className='w-full'
              />
            </div>
            <div>
              <MultiSelectGroup
                id='keywords'
                name='keywords'
                value={formData.keywords}
                onChange={(selected) => handleMultiselectChange('keywords', selected)}
                placeholder='Select keywords...'
                options={formatFilterOptions(facets.keywords || [], 'Keywords')}
                className='w-full'
              />
            </div>
          </div>
          <div className='mb-6 w-50'>
            <YearInput
              minYear={1600}
              maxYear={2025}
              yearFrom={formData.yearFrom ?? ''}
              yearTo={formData.yearTo ?? ''}
              onChange={handleYearRangeChange}
              className='w-100'
            />
          </div>
          <div className='mb-6 flex justify-between items-center'>
            <Checkbox
              id='newRelease'
              name='newRelease'
              checked={formData.newRelease}
              onChange={handleCheckboxChange}
              label='Mark as New Release'
              className='h-5 w-5'
            />
            <div className='w-48'>
              <Sort
                value={formData.sort}
                onChange={handleSortChange}
                options={[
                  { value: 'Sort by...', label: 'Sort by...', disabled: true },
                  { value: 'title ASC', label: 'Title (A-Z)' },
                  { value: 'title DESC', label: 'Title (Z-A)' },
                  { value: 'pageCount ASC', label: 'Page Count' }
                ]}
              />
            </div>
          </div>
          <div className='flex flex-col sm:flex-row justify-center gap-4 mt-8'>
            <Button
              variant='primary'
              type='submit'
              className='w-full sm:w-auto px-6 py-2'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Book Details'}
            </Button>
            <Button
              variant='secondary'
              type='button'
              onClick={handleReset}
              className='w-full sm:w-auto px-6 py-2'
              disabled={isSubmitting}
            >
              Reset Form
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
