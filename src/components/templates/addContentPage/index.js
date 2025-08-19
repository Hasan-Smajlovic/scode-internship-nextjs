'use client'
import { useState, useEffect } from 'react'

import InputLabel from '@/components/patterns/molecules/InputLabel'
import Textarea from '@/components/patterns/molecules/Textarea'
import MultiSelectGroup from '@/components/patterns/molecules/MultiselectGroup'
import Checkbox from '@/components/patterns/atoms/Checkbox'
import Button from '@/components/patterns/atoms/Button'
import YearInput from '@/components/patterns/molecules/YearInput'
import addContentPageValidation from '@/lib/validation/addContentPageValidation'
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
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [facets, setFacets] = useState({
    format   : [],
    genre    : [],
    year     : [],
    keywords : []
  })

  // title and description
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }
  // format, genre, year, keywords
  const handleMultiselectChange = (name, selectedOptions) => {
    setFormData(prev => ({ ...prev, [name]: selectedOptions }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }
  // year
  const handleYearRangeChange = ({ yearFrom, yearTo }) => {
    setFormData(prev => ({
      ...prev,
      yearFrom : yearFrom !== undefined ? yearFrom : prev.yearFrom,
      yearTo   : yearTo !== undefined ? yearTo : prev.yearTo
    }))
    if (errors.yearRange) setErrors(prev => ({ ...prev, yearRange: null }))
  }
  // checkbox
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
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
    setErrors({})
    setShowSuccess(false)
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
      console.log('Facets fetched successfully:', data.facets)
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
    const validation = addContentPageValidation(formData)
    console.log('Validation result:', validation)
    if (!validation.isValid) {
      setErrors({ ...validation.errors, submit: null })
      setShowSuccess(false)
      return
    }

    setIsSubmitting(true)
    setShowSuccess(false)
    setErrors(prev => ({ ...prev, submit: null }))

    // submit to mongo
    try {
      const response = await fetch('/api/add-content-page', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify(formData)
      })
      const data = await response.json()

      if (data.success) {
        setShowSuccess(true)
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
          {showSuccess && (
            <p className='text-green-500 text-sm mt-1'>Content added successfully!</p>
          )}
          {errors.submit && (
            <p className='text-red-500 text-sm mt-1'>{errors.submit}</p>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6'>
            <div>
              <InputLabel
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                placeholder='Enter content title'
                label='Title'
                className={`w-full ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title}</p>}
            </div>
            <div>
              <Textarea
                label='Description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                placeholder='Enter a description of the content'
                rows={3}
                className={`w-full ${errors.description ? 'border-red-500' : ''}`}
              />
              {errors.description && (
                <p className='text-red-500 text-sm mt-1'>{errors.description}</p>
              )}
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
                options={(facets.format ?? []).map((item) => ({
                  value : item.value,
                  label : item.value
                }))}
                className={`w-full ${errors.format ? 'border-red-500' : ''}`}
              />
              {errors.format && <p className='text-red-500 text-sm mt-1'>{errors.format}</p>}
            </div>
            <div>
              <MultiSelectGroup
                id='genre'
                name='genre'
                value={formData.genre}
                onChange={(selected) => handleMultiselectChange('genre', selected)}
                placeholder='Select genres...'
                options={(facets.genre ?? []).map((item) => ({
                  value : item.value,
                  label : item.value
                }))}
                className={`w-full ${errors.genre ? 'border-red-500' : ''}`}
              />
              {errors.genre && <p className='text-red-500 text-sm mt-1'>{errors.genre}</p>}
            </div>
            <div>
              <MultiSelectGroup
                id='year'
                name='year'
                value={formData.year}
                onChange={(selected) => handleMultiselectChange('year', selected)}
                placeholder='Select years...'
                options={(facets.year ?? []).map((item) => ({
                  value : item.value,
                  label : item.value
                }))}
                className={`w-full ${errors.year ? 'border-red-500' : ''}`}
              />
              {errors.year && <p className='text-red-500 text-sm mt-1'>{errors.year}</p>}
            </div>
            <div>
              <MultiSelectGroup
                id='keywords'
                name='keywords'
                value={formData.keywords}
                onChange={(selected) => handleMultiselectChange('keywords', selected)}
                placeholder='Select keywords...'
                options={(facets.keywords ?? []).map((item) => ({
                  value : item.value,
                  label : item.value
                }))}
                className={`w-full ${errors.keywords ? 'border-red-500' : ''}`}
              />
              {errors.keywords && <p className='text-red-500 text-sm mt-1'>{errors.keywords}</p>}
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
