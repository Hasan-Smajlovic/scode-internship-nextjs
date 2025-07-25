'use client'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { FaUser, FaBook, FaKeyboard, FaFileAlt } from 'react-icons/fa'

import Alert from '@/components/patterns/atoms/Alert'
import Multiselect from '@/components/patterns/molecules/Multiselect'
import UploadInput from '@/components/patterns/molecules/UploadInput'
import Button from '@/components/patterns/atoms/Button'
import InputLabel from '@/components/patterns/molecules/InputLabel'
import Input from '@/components/patterns/atoms/Input'
import TextGroup from '@/components/patterns/molecules/TextGroup'
import Select from '@/components/patterns/atoms/Select'
import Chip from '@/components/patterns/atoms/Chip'

export default function BookFormApi ({
  title = '',
  subtitle = '',
  authors = [],
  publisher = '',
  publishedDate = '',
  pageCount = '',
  genres = [],
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
  const [genresState, setGenres] = useState(genres)
  const [coverState, setCover] = useState(cover)
  const [shortDescriptionState, setShortDescription] = useState(shortDescription)
  const [formatState, setFormat] = useState(format)
  const [newReleaseState, setNewRelease] = useState(newRelease)
  const [keywordsState, setKeywords] = useState(keywords)

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!titleState?.trim()) newErrors.title = 'Title is required'
    if (!subtitleState?.trim()) newErrors.subtitle = 'Subtitle is required'
    if (!Array.isArray(authorsState) || authorsState.length === 0) newErrors.authors = 'At least one author is required'
    if (!publisherState?.trim()) newErrors.publisher = 'Publisher is required'
    if (!publishedDateState?.trim()) newErrors.publishedDate = 'Published date is required'
    if (!pageCountState || (typeof pageCountState === 'string' && (!pageCountState.trim() || isNaN(pageCountState)))) {
      newErrors.pageCount = 'Page count must be a number'
    }
    if (!Array.isArray(genresState) || genresState.length === 0) newErrors.genres = 'At least one genre is required'
    if (!coverState) newErrors.cover = 'Cover image is required'
    if (!shortDescriptionState?.trim()) newErrors.shortDescription = 'Short description is required'
    if (!formatState?.trim()) newErrors.format = 'Format is required'
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

  const handleResetGenres = (selected) => {
    const unique = Array.from(new Set(selected))
    setGenres(unique)
    if (errors.genres) setErrors({ ...errors, genres: '' })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      const bookData = {
        title            : titleState,
        subtitle         : subtitleState,
        authors          : authorsState,
        publisher        : publisherState,
        publishedDate    : publishedDateState,
        pageCount        : typeof pageCountState === 'string' ? parseInt(pageCountState, 10) : pageCountState,
        genres           : genresState,
        cover            : coverState,
        shortDescription : shortDescriptionState,
        format           : formatState,
        newRelease       : newReleaseState,
        keywords         : keywordsState
      }

      setTimeout(() => {
        try {
          console.log('Book data submitted:', bookData)
          Alert.show({
            type     : 'success',
            children : 'Book submitted successfully!',
            position : 'top-center',
            timeout  : 3000
          })
        } catch (error) {
          console.error('Error submitting book:', error)
          Alert.show({
            type     : 'error',
            children : 'Failed to submit book. Please try again.',
            position : 'top-center',
            timeout  : 3000
          })
        } finally {
          setIsSubmitting(false)
        }
      }, 1500)
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

  return (
    <div className='flex justify-center items-center min-h-screen p-4'>
      <form
        onSubmit={handleSubmit}
        onKeyDown={preventEnterKey}
        className='w-full max-w-6xl'
      >
        <h2 className='text-3xl font-bold mb-6 text-center'>Book Details</h2>
        <div className='w-full mx-auto p-6 sm:p-8 bg-white shadow-lg rounded-lg'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6'>
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
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6'>
            <InputLabel
              id='authors'
              name='authors'
              placeholder='Enter book authors (comma separated)'
              value={Array.isArray(authorsState) ? authorsState.join(', ') : ''}
              onChange={(e) => {
                const inputValue = handleValue(e)
                const authorList = typeof inputValue === 'string'
                  ? inputValue.split(',').map(a => a.trim()).filter(Boolean)
                  : []
                setAuthors(authorList)
                if (errors.authors) setErrors({ ...errors, authors: '' })
              }}
              error={errors.authors}
              label='Authors'
              icon={<FaUser />}
            />
            <InputLabel
              id='publisher'
              name='publisher'
              placeholder='Enter book publisher'
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
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6'>
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
            <InputLabel
              id='pageCount'
              name='pageCount'
              type='number'
              placeholder='Enter page count'
              value={pageCountState}
              onChange={(e) => {
                setPageCount(handleValue(e))
                if (errors.pageCount) setErrors({ ...errors, pageCount: '' })
              }}
              error={errors.pageCount}
              label='Page Count'
              description='Total number of pages in the book.'
              icon={<FaFileAlt />}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6'>
            <div>
              {genresState.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-2'>
                  {genresState.map((genre, index) => (
                    <Chip
                      key={index}
                      label={genre}
                      onClose={() => {
                        const updated = genresState.filter((_, i) => i !== index)
                        setGenres(updated)
                        if (errors.genres) setErrors({ ...errors, genres: '' })
                      }}
                    />
                  ))}
                </div>
              )}
              <Multiselect
                id='genres'
                name='genres'
                label='Genres'
                placeholder='Select genres...'
                onChange={handleResetGenres}
                options={[
                  { value: 'fiction', label: 'Fiction' },
                  { value: 'non-fiction', label: 'Non-Fiction' },
                  { value: 'science-fiction', label: 'Science Fiction' },
                  { value: 'fantasy', label: 'Fantasy' },
                  { value: 'biography', label: 'Biography' }
                ]}
                error={errors.genres}
                description='Select one or more genres for this book.'
                value={genresState}
              />
            </div>

            <Select
              id='format'
              name='format'
              label='Format'
              className='bg-gray-50 w-133'
              placeholder='Select format...'
              options={[
                { value: 'hardcover', label: 'Hardcover' },
                { value: 'paperback', label: 'Paperback' },
                { value: 'ebook', label: 'eBook' }
              ]}
              error={errors.format}
              description='Select the format of this book.'
              value={formatState}
              onChange={(e) => {
                setFormat(handleValue(e))
                if (errors.format) setErrors({ ...errors, format: '' })
              }}
              icon={<FaFileAlt />}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6'>
            <UploadInput
              name='cover'
              placeholder='Upload book cover'
              label='Book Cover'
              accept='image/*'
              error={errors.cover}
              onChange={(file) => {
                const coverValue = file
                  ? (typeof file === 'string' ? file : file.name || 'uploaded-file')
                  : ''
                setCover(coverValue)
                if (errors.cover) setErrors({ ...errors, cover: '' })
              }}
            />
            <Input
              id='publishedDate'
              name='publishedDate'
              type='date'
              label='Published Date'
              className='h-14 bg-gray-50'
              value={publishedDateState}
              onChange={(e) => {
                setPublishedDate(handleValue(e))
                if (errors.publishedDate) setErrors({ ...errors, publishedDate: '' })
              }}
              error={errors.publishedDate}
            />
            <TextGroup
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

          <div className='flex items-center mb-6'>
            <input
              type='checkbox'
              id='newRelease'
              name='newRelease'
              checked={newReleaseState}
              onChange={(e) => setNewRelease(e.target.checked)}
              className='mr-2 h-5 w-5'
            />
            <label htmlFor='newRelease' className='text-gray-700'>
              Mark as New Release
            </label>
          </div>

          <div className='flex justify-center space-x-4 mt-6'>
            <Button variant='primary' type='submit' disabled={isSubmitting}>
              {isSubmitting ? <span>Submitting...</span> : <span>Submit Book Details</span>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

BookFormApi.propTypes = {
  title            : PropTypes.string,
  subtitle         : PropTypes.string,
  authors          : PropTypes.arrayOf(PropTypes.string),
  publisher        : PropTypes.string,
  publishedDate    : PropTypes.string,
  pageCount        : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  genres           : PropTypes.arrayOf(PropTypes.string),
  cover            : PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  shortDescription : PropTypes.string,
  format           : PropTypes.string,
  newRelease       : PropTypes.bool,
  keywords         : PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
}
