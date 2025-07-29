'use client'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { FaUser, FaBook, FaKeyboard, FaFileAlt } from 'react-icons/fa'

import Alert from '@/components/patterns/atoms/Alert'
import Multiselect from '@/components/patterns/molecules/Multiselect'
import UploadInput from '@/components/patterns/molecules/UploadInput'
import Button from '@/components/patterns/atoms/Button'
import InputLabel from '@/components/patterns/molecules/InputLabel'
import Select from '@/components/patterns/atoms/Select'
import Chip from '@/components/patterns/atoms/Chip'
import AuthorInput from '@/components/patterns/molecules/AuthorInput'

export default function BookFormApi ({
  title = '',
  subtitle = '',
  authors = [{ name: '', image: '' }],
  publisher = '',
  publishedDate = '',
  pageCount = '',
  genre = [],
  cover = '',
  shortDescription = '',
  format = '',
  newRelease = false,
  keywords = ''
}) {
  const [titleState, setTitle] = useState(title)
  const [subtitleState, setSubtitle] = useState(subtitle)
  const [authorsState, setAuthors] = useState(authors)
  const [publisherState, setPublisher] = useState(publisher)
  const [publishedDateState, setPublishedDate] = useState(publishedDate)
  const [pageCountState, setPageCount] = useState(pageCount)
  const [genreState, setGenre] = useState(genre)
  const [coverState, setCover] = useState(cover)
  const [shortDescriptionState, setShortDescription] = useState(shortDescription)
  const [formatState, setFormat] = useState(format)
  const [newReleaseState, setNewRelease] = useState(newRelease)
  const [keywordsState, setKeywords] = useState(keywords)
  const [formKey, setFormKey] = useState(0)

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleResetForm = () => {
    setTitle('')
    setSubtitle('')
    setAuthors([{ name: '', image: '' }])
    setPublisher('')
    setPublishedDate('')
    setPageCount('')
    setGenre([])
    setCover('')
    setShortDescription('')
    setFormat('')
    setNewRelease(false)
    setKeywords('')
    setErrors({})
    setFormKey(prev => prev + 1)
    Alert.show({
      type     : 'success',
      children : 'Form has been reset successfully!',
      position : 'top-center',
      timeout  : 3000
    })
  }

  const handleResetGenre = (selected) => {
    const unique = Array.from(new Set(selected))
    setGenre(unique)
    if (errors.genre) setErrors({ ...errors, genre: '' })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!titleState?.trim()) newErrors.title = 'Title is required'
    if (!subtitleState?.trim()) newErrors.subtitle = 'Subtitle is required'
    if (!Array.isArray(authorsState) || authorsState.length === 0) {
      newErrors.authors = 'At least one author is required'
    } else {
      for (let i = 0; i < authorsState.length; i++) {
        const author = authorsState[i]
        if (!author.name || !author.image) {
          newErrors.authors = 'Each author must have a name and an image'
          break
        }
      }
    }
    if (!publisherState?.trim()) newErrors.publisher = 'Publisher is required'
    if (!publishedDateState?.trim()) newErrors.publishedDate = 'Published date is required'
    if (!pageCountState || (typeof pageCountState === 'string' && (!pageCountState.trim() || isNaN(pageCountState)))) {
      newErrors.pageCount = 'Page count must be a number'
    }
    if (!Array.isArray(genreState) || genreState.length === 0) newErrors.genre = 'At least one genre is required'
    if (!coverState || !coverState.trim()) newErrors.cover = 'Cover image is required'
    if (!shortDescriptionState?.trim()) newErrors.shortDescription = 'Short description is required'
    if (!formatState?.trim()) newErrors.format = 'Format is required'
    if (publishedDateState && isNaN(Date.parse(publishedDateState))) {
      newErrors.publishedDate = 'Published date must be a valid date'
    }
    if (!genreState || (typeof genreState === 'string' && !genreState.trim()) || (Array.isArray(genreState) && genreState.length === 0)) {
      newErrors.genre = 'Genre is required'
    }
    if (!keywordsState || (typeof keywordsState === 'string' && !keywordsState.trim()) || (Array.isArray(keywordsState) && keywordsState.length === 0)) {
      newErrors.keywords = 'Keywords are required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const preventEnterKey = (event) => {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
      event.preventDefault()
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      const processedKeywords = typeof keywordsState === 'string'
        ? keywordsState.split(',').map(k => k.trim()).filter(Boolean)
        : keywordsState

      const bookData = {
        title            : titleState,
        subtitle         : subtitleState,
        authors          : authorsState,
        publisher        : publisherState,
        publishedDate    : publishedDateState,
        pageCount        : typeof pageCountState === 'string' ? parseInt(pageCountState, 10) : pageCountState,
        genre            : genreState,
        cover            : coverState,
        shortDescription : shortDescriptionState,
        format           : formatState,
        newRelease       : newReleaseState,
        keywords         : processedKeywords
      }

      fetch('/api/add-book', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify(bookData)
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            Alert.show({
              type     : 'success',
              children : 'Book submitted successfully!',
              position : 'top-center',
              timeout  : 3000
            })
            handleResetForm()
          } else {
            throw new Error(data.error || 'Failed to submit book')
          }
        })
        .catch(error => {
          console.error('Error submitting book:', error)
          Alert.show({
            type     : 'error',
            children : 'Failed to submit book. Please try again.',
            position : 'top-center',
            timeout  : 3000
          })
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    } else {
      Alert.show({
        type     : 'error',
        children : 'Please correct the errors in the form.',
        position : 'top-center',
        timeout  : 3000
      })
    }
  }

  const handleValue = (event) => {
    return event && event.target ? event.target.value : event
  }

  const handleDeleteGenre = (index) => {
    const updated = genreState.filter((_, i) => i !== index)
    setGenre(updated)
    if (errors.genre) setErrors({ ...errors, genre: '' })
  }

  return (
    <div className='flex justify-center items-center min-h-screen p-2 sm:p-4'>
      <form
        key={formKey}
        onSubmit={handleSubmit}
        onKeyDown={preventEnterKey}
        className='w-full max-w-6xl'
      >
        <h2 className='text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center'>Book Details</h2>
        <div className='w-full mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-lg rounded-lg'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6'>
            <InputLabel
              id='title'
              name='title'
              placeholder='Enter book title'
              value={titleState}
              onChange={(e) => {
                setTitle(handleValue(e))
                if (errors.title) setErrors({ ...errors, title: '' })
              }}
              error={errors.title}
              label='Title'
              icon={<FaBook />}
            />
            <InputLabel
              id='subtitle'
              name='subtitle'
              placeholder='Enter book subtitle'
              value={subtitleState}
              onChange={(e) => {
                setSubtitle(handleValue(e))
                if (errors.subtitle) setErrors({ ...errors, subtitle: '' })
              }}
              error={errors.subtitle}
              label='Subtitle'
              icon={<FaBook />}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6'>
            <div className='w-full'>
              <AuthorInput
                authors={authorsState}
                onChange={(newAuthors) => {
                  setAuthors(newAuthors)
                  if (errors.authors) setErrors({ ...errors, authors: '' })
                }}
                error={errors.authors}
              />
            </div>
            <InputLabel
              id='publisher'
              name='publisher'
              placeholder='Enter book publisher'
              className='mt-2'
              value={publisherState}
              onChange={(e) => {
                setPublisher(handleValue(e))
                if (errors.publisher) setErrors({ ...errors, publisher: '' })
              }}
              error={errors.publisher}
              label='Publisher'
              icon={<FaUser />}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6'>
            <InputLabel
              id='pageCount'
              name='pageCount'
              type='number'
              placeholder='Enter page count'
              value={pageCountState}
              onChange={(e) => {
                setPageCount(handleValue(e))
                setErrors({ ...errors, pageCount: '' })
              }}
              error={errors.pageCount}
              label='Page Count'
              description='Total number of pages in the book.'
              icon={<FaFileAlt />}
            />
            <InputLabel
              id='keywords'
              name='keywords'
              icon={<FaKeyboard />}
              placeholder='Enter keywords (comma separated)'
              value={typeof keywordsState === 'string'
                ? keywordsState
                : Array.isArray(keywordsState) ? keywordsState.join(', ') : ''}
              onChange={(e) => {
                setKeywords(handleValue(e))
                if (errors.keywords) setErrors({ ...errors, keywords: '' })
              }}
              label='Keywords'
              description='Keywords for search optimization.'
              error={errors.keywords}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6'>
            <Select
              id='format'
              name='format'
              label='Format'
              className='bg-gray-50 w-full'
              placeholder='Select format...'
              options={[
                { value: 'hardcover', label: 'Hardcover' },
                { value: 'paperback', label: 'Paperback' },
                { value: 'ebook', label: 'eBook' },
                { value: 'audio', label: 'Audio Book' }
              ]}
              error={errors.format}
              description='Select the format of this book.'
              value={formatState}
              onChange={(event) => {
                setFormat(handleValue(event))
                if (errors.format) setErrors({ ...errors, format: '' })
              }}
              icon={<FaFileAlt />}
            />
            <InputLabel
              id='publishedDate'
              name='publishedDate'
              type='date'
              label='Published Date'
              placeholder='Select published date'
              value={publishedDateState}
              onChange={(e) => {
                setPublishedDate(handleValue(e))
                if (errors.publishedDate) setErrors({ ...errors, publishedDate: '' })
              }}
              error={errors.publishedDate}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6'>
            <div>
              <Multiselect
                id='genre'
                name='genre'
                label='Genres'
                placeholder='Select genres...'
                onChange={handleResetGenre}
                options={[
                  { value: 'fiction', label: 'Fiction' },
                  { value: 'non-fiction', label: 'Non-Fiction' },
                  { value: 'science-fiction', label: 'Science Fiction' },
                  { value: 'fantasy', label: 'Fantasy' },
                  { value: 'biography', label: 'Biography' }
                ]}
                error={errors.genre}
                description='Select one or more genres for this book.'
                value={genreState}
              />
            </div>
            <UploadInput
              name='cover'
              placeholder='Upload book cover'
              label='Book Cover'
              accept='image/*'
              targetFolder='covers'
              error={errors.cover}
              onChange={(file) => {
                const coverValue = file
                  ? (typeof file === 'string' ? file : file.name || 'uploaded-file')
                  : ''
                setCover(coverValue)
                if (errors.cover) setErrors({ ...errors, cover: '' })
              }}
            />
          </div>
          <div className='mb-4 sm:mb-6'>
            <InputLabel
              id='shortDescription'
              label='Short Description'
              name='shortDescription'
              placeholder='Enter a short description of the book'
              value={shortDescriptionState}
              onChange={(val) => {
                setShortDescription(handleValue(val))
                if (errors.shortDescription) setErrors({ ...errors, shortDescription: '' })
              }}
              error={errors.shortDescription}
              rows={3}
            />
          </div>

          <div className='flex items-center mb-4 sm:mb-6'>
            <input
              type='checkbox'
              id='newRelease'
              name='newRelease'
              checked={newReleaseState}
              onChange={(e) => setNewRelease(e.target.checked)}
              className='mr-2 h-4 w-4 sm:h-5 sm:w-5'
            />
            <label htmlFor='newRelease' className='text-sm sm:text-base text-gray-700'>
              Mark as New Release
            </label>
          </div>

          <div className='flex flex-col sm:flex-row justify-center gap-3 mt-4 sm:mt-6'>
            <Button variant='primary' type='submit' disabled={isSubmitting} className='w-full sm:w-auto'>
              {isSubmitting ? <span>Submitting...</span> : <span>Submit Book Details</span>}
            </Button>
            <Button
              variant='secondary'
              type='button'
              onClick={handleResetForm}
              className='w-full sm:w-auto'
            >
              Reset Form
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

BookFormApi.propTypes = {
  title    : PropTypes.string,
  subtitle : PropTypes.string,
  authors  : PropTypes.arrayOf(PropTypes.shape({
    name  : PropTypes.string.isRequired,
    image : PropTypes.string
  })),
  publisher        : PropTypes.string,
  publishedDate    : PropTypes.string,
  pageCount        : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  genre            : PropTypes.arrayOf(PropTypes.string),
  cover            : PropTypes.string,
  shortDescription : PropTypes.string,
  format           : PropTypes.string,
  newRelease       : PropTypes.bool,
  keywords         : PropTypes.oneOfType([PropTypes.string, PropTypes.array])
}
