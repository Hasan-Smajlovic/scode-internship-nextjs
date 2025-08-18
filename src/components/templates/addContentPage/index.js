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
    newRelease  : false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  // Handler for inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  // Handler for multiselect
  const handleMultiselectChange = (name, selectedOptions) => {
    setFormData({
      ...formData,
      [name]: selectedOptions
    })
    // Clear error for this field when user makes a selection
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  // Handler for changing year
  const handleYearRangeChange = ({ yearFrom, yearTo }) => {
    setFormData(prev => ({
      ...prev,
      yearFrom : yearFrom !== undefined ? yearFrom : prev.yearFrom,
      yearTo   : yearTo !== undefined ? yearTo : prev.yearTo
    }))
    // Clear year range error when user changes either value
    if (errors.yearRange) {
      setErrors(prev => ({ ...prev, yearRange: null }))
    }
  }

  // Handler for checkbox
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      [name]: checked
    })
  }

  // Handler for resetting to default values
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
      newRelease  : false
    })
    setErrors({})
    setShowSuccess(false)
  }

  // Handler for submitting
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate the form
    const validation = addContentPageValidation(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    setShowSuccess(false)

    try {
      const response = await fetch('/api/add-content-page', {
        method  : 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        console.log('Content added successfully:', data)
        setShowSuccess(true)
        handleReset()
      } else {
        console.error('Error adding content:', data.error || response.statusText)
        setErrors({ submit: data.error || 'Failed to add content. Please try again.' })
      }
    } catch (error) {
      console.error('Error submitting content:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  return (
    <div className='w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10'>
      <form
        className='w-full max-w-6xl mx-auto'
        onSubmit={handleSubmit}
      >
        <div className='w-full mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-lg rounded-lg'>
          {showSuccess && (
            <Alert
              type='success'
              message='Content added successfully!'
              className='mb-6'
            />
          )}

          {errors.submit && (
            <Alert
              type='error'
              message={errors.submit}
              className='mb-6'
            />
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
              {errors.title && (
                <p className='text-red-500 text-sm mt-1'>{errors.title}</p>
              )}
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
                options={[
                  { value: 'book', label: 'Book' },
                  { value: 'ebook', label: 'E-Book' },
                  { value: 'audiobook', label: 'Audiobook' },
                  { value: 'pdf', label: 'PDF' },
                  { value: 'podcast', label: 'Podcast' }
                ]}
                className={`w-full ${errors.format ? 'border-red-500' : ''}`}
              />
              {errors.format && (
                <p className='text-red-500 text-sm mt-1'>{errors.format}</p>
              )}
            </div>

            <div>
              <MultiSelectGroup
                id='genre'
                name='genre'
                value={formData.genre}
                onChange={(selected) => handleMultiselectChange('genre', selected)}
                placeholder='Select genres...'
                options={[
                  { value: 'fiction', label: 'Fiction' },
                  { value: 'non-fiction', label: 'Non-Fiction' },
                  { value: 'science-fiction', label: 'Science Fiction' },
                  { value: 'fantasy', label: 'Fantasy' },
                  { value: 'biography', label: 'Biography' }
                ]}
                className={`w-full ${errors.genre ? 'border-red-500' : ''}`}
              />
              {errors.genre && (
              <p className='text-red-500 text-sm mt-1'>{errors.genre}</p>
              )}
            </div>

            <div>
              <MultiSelectGroup
                id='year'
                name='year'
                value={formData.year}
                onChange={(selected) => handleMultiselectChange('year', selected)}
                placeholder='Select years...'
                options={[
                  { value: '2023', label: '2023' },
                  { value: '2022', label: '2022' },
                  { value: '2021', label: '2021' },
                  { value: '2020', label: '2020' },
                  { value: '2019', label: '2019' }
                ]}
                className={`w-full ${errors.year ? 'border-red-500' : ''}`}
              />
              {errors.year && (
              <p className='text-red-500 text-sm mt-1'>{errors.year}</p>
              )}
            </div>

            <div>
              <MultiSelectGroup
                id='keywords'
                name='keywords'
                value={formData.keywords}
                onChange={(selected) => handleMultiselectChange('keywords', selected)}
                placeholder='Select keywords...'
                options={[
                  { value: 'bestseller', label: 'Bestseller' },
                  { value: 'classic', label: 'Classic' },
                  { value: 'new-release', label: 'New Release' },
                  { value: 'award-winning', label: 'Award-Winning' },
                  { value: 'recommended', label: 'Recommended' }
                ]}
                className={`w-full ${errors.keywords ? 'border-red-500' : ''}`}
              />
              {errors.keywords && (
              <p className='text-red-500 text-sm mt-1'>{errors.keywords}</p>
              )}
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
            {errors.yearRange && (
              <p className='text-red-500 text-sm mt-1'>{errors.yearRange}</p>
            )}
          </div>

          <div className='mb-6'>
            <Checkbox
              id='newRelease'
              name='newRelease'
              checked={formData.newRelease}
              onChange={handleCheckboxChange}
              label='Mark as New Release'
              className='h-5 w-5'
            />
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
