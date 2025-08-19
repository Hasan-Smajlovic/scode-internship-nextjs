'use client'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { FaUser, FaBook, FaFileAlt } from 'react-icons/fa'

import { BookSchema } from '@/lib/validation/bookSchema'
import Alert from '@/components/patterns/atoms/Alert'
import UploadInput from '@/components/patterns/molecules/UploadInput'
import Button from '@/components/patterns/atoms/Button'
import InputLabel from '@/components/patterns/molecules/InputLabel'
import Select from '@/components/patterns/atoms/Select'
import AuthorInput from '@/components/patterns/molecules/AuthorInput'
import TextGroup from '@/components/patterns/molecules/TextGroup'
import Textarea from '@/components/patterns/molecules/Textarea'
import MultiselectGroup from '../../patterns/molecules/MultiselectGroup'

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
  const [titleState, setTitleState] = useState(title)
  const [subtitleState, setSubtitleState] = useState(subtitle)
  const [authorsState, setAuthors] = useState(authors)
  const [publisherState, setPublisherState] = useState(publisher)
  const [publishedDateState, setPublishedDateState] = useState(publishedDate)
  const [pageCountState, setPageCountState] = useState(pageCount)
  const [genreState, setGenre] = useState(genre)
  const [coverState, setCover] = useState(cover)
  const [shortDescriptionState, setShortDescriptionState] = useState(shortDescription)
  const [formatState, setFormatState] = useState(format || '')
  const [newReleaseState, setNewReleaseState] = useState(newRelease)
  const [keywordsState, setKeywords] = useState(keywords)

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetAlert, setResetAlert] = useState(null)
  const [submitAlert, setSubmitAlert] = useState(null)

  const showResetAlert = (alertObj) => {
    setResetAlert(alertObj)
    setTimeout(() => setResetAlert(null), alertObj.timeout || 7000)
  }

  const showSubmitAlert = (alertObj) => {
    setSubmitAlert(alertObj)
    setTimeout(() => setSubmitAlert(null), alertObj.timeout || 7000)
  }

  const resetForm = () => {
    setTitleState('')
    setSubtitleState('')
    setPublisherState('')
    setPublishedDateState('')
    setPageCountState('')
    setFormatState('')
    setShortDescriptionState('')
    setNewReleaseState(false)
    setGenre([])
    setCover(null)
    setKeywords('')
    setAuthors([{ name: '', image: null }])
    setErrors({})
  }

  const handleResetForm = () => {
    resetForm()
    showResetAlert({
      type     : 'info',
      children : 'Form has been reset!',
      position : 'top-center',
      timeout  : 7000
    })
  }

  const handleResetGenre = (selected) => {
    const filtered = selected.filter(val => typeof val === 'string' && val.trim() !== '')
    const unique = Array.from(new Set(filtered))
    setGenre(unique)
  }

  const validateForm = (fields) => {
    const processedAuthors = fields.authors.map(author => ({
      ...author,
      image: author.image && typeof author.image === 'object' ? author.image.formattedName : author.image
    }))

    const validationFields = {
      ...fields,
      authors : processedAuthors,
      cover   : fields.cover
        ? (typeof fields.cover === 'string' ? fields.cover : fields.cover.formattedName)
        : ''
    }

    const result = BookSchema.safeParse(validationFields)
    if (!result.success) {
      const newErrors = {}
      const errorMessages = []
      if (result.error && Array.isArray(result.error.issues)) {
        result.error.issues.forEach(error => {
          const key = error.path[0] || 'form'
          if (!newErrors[key]) newErrors[key] = error.message
          errorMessages.push(error.message)
        })
      } else {
        newErrors.form = 'Validation failed but no error details found.'
        errorMessages.push(newErrors.form)
      }
      setErrors(newErrors)
      showSubmitAlert({
        type     : 'danger',
        children : (
          <div>
            <div>Please enter valid data</div>
            <ul style={{ margin: 0, paddingLeft: 18 }} />
          </div>
        ),
        position : 'top-center',
        timeout  : 7000
      })
      return false
    }
    setErrors({})
    return true
  }

  const preventEnterKey = (event) => {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
      event.preventDefault()
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const fields = {
      title            : titleState,
      subtitle         : subtitleState,
      authors          : authorsState,
      publisher        : publisherState,
      publishedDate    : publishedDateState,
      pageCount        : pageCountState,
      genre            : genreState,
      cover            : coverState?.formattedName || '',
      shortDescription : shortDescriptionState,
      format           : formatState,
      newRelease       : newReleaseState,
      keywords         : keywordsState
    }

    if (!validateForm(fields)) { return }
    setIsSubmitting(true)

    let uploadedCoverPath = coverState
    if (coverState && typeof coverState === 'object' && coverState.file) {
      const formData = new FormData()
      formData.append('file', coverState.file)
      formData.append('targetFolder', 'covers')
      formData.append('fileName', coverState.formattedName || coverState.file.name)

      try {
        const res = await fetch('/api/upload', {
          method : 'POST',
          body   : formData
        })
        const data = await res.json()

        if (data.success && data.path) {
          uploadedCoverPath = data.path
        } else {
          console.error('Failed to upload cover:', data.error || 'Unknown error')
          setIsSubmitting(false)
          showSubmitAlert({
            type     : 'error',
            children : `Failed to upload cover: ${data.error || 'Unknown error'}`,
            position : 'top-center',
            timeout  : 3000
          })
          return
        }
      } catch (err) {
        console.error('Error uploading cover:', err)
        setIsSubmitting(false)
        return
      }
    }

    const authorsWithPaths = await Promise.all(authorsState.map(async (author) => {
      if (author.image && typeof author.image === 'object' && author.image.file) {
        const formData = new FormData()
        formData.append('file', author.image.file)
        formData.append('targetFolder', 'authors')
        formData.append('fileName', author.image.formattedName || author.image.file.name)
        try {
          const res = await fetch('/api/upload', { method: 'POST', body: formData })
          const data = await res.json()
          return {
            name  : author.name,
            image : data.success && data.path ? data.path : ''
          }
        } catch {
          return {
            name  : author.name,
            image : ''
          }
        }
      }
      return {
        name  : author.name,
        image : typeof author.image === 'string' ? author.image : ''
      }
    }))

    const processedKeywords = typeof keywordsState === 'string'
      ? keywordsState.split(',').map(k => k.trim()).filter(Boolean)
      : keywordsState

    const bookData = {
      title            : fields.title,
      subtitle         : fields.subtitle,
      authors          : authorsWithPaths,
      publisher        : fields.publisher,
      publishedDate    : fields.publishedDate,
      pageCount        : typeof fields.pageCount === 'string' ? parseInt(fields.pageCount, 10) : fields.pageCount,
      genre            : genreState,
      cover            : typeof uploadedCoverPath === 'string' ? uploadedCoverPath : uploadedCoverPath?.path || '',
      shortDescription : fields.shortDescription,
      format           : fields.format,
      newRelease       : fields.newRelease,
      keywords         : processedKeywords
    }

    try {
      const response = await fetch('/api/add-book', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify(bookData)
      })

      const data = await response.json()
      if (data.success) {
        showSubmitAlert({
          type     : 'success',
          children : 'Book submitted successfully!',
          position : 'top-center',
          timeout  : 7000
        })
        resetForm()
      } else {
        showSubmitAlert({
          type     : 'error',
          children : `Failed to submit book: ${data.error || 'Please try again.'}`,
          position : 'top-center',
          timeout  : 3000
        })
      }
    } catch (error) {
      console.error('Error submitting book:', error)
      showSubmitAlert({
        type     : 'error',
        children : 'Failed to submit book. Please try again.',
        position : 'top-center',
        timeout  : 3000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen p-2 sm:p-4'>
      {resetAlert && (
        <Alert
          type={resetAlert.type}
          position={resetAlert.position}
          timeout={resetAlert.timeout}
        >
          {resetAlert.children}
        </Alert>
      )}
      {submitAlert && (
        <Alert
          type={submitAlert.type}
          position={submitAlert.position}
          timeout={submitAlert.timeout}
        >
          {submitAlert.children}
        </Alert>
      )}
      <form
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
              onChange={e => setTitleState(e.target.value)}
              error={errors.title}
              label='Title'
              icon={<FaBook />}
            />
            <InputLabel
              id='subtitle'
              name='subtitle'
              placeholder='Enter book subtitle'
              value={subtitleState}
              onChange={e => setSubtitleState(e.target.value)}
              error={errors.subtitle}
              label='Subtitle'
              icon={<FaBook />}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6'>
            <div className='w-full'>
              <AuthorInput
                authors={authorsState}
                onChange={setAuthors}
                error={errors.authors}
              />
            </div>
            <InputLabel
              id='publisher'
              name='publisher'
              placeholder='Enter book publisher'
              className='mt-2'
              value={publisherState}
              onChange={e => setPublisherState(e.target.value)}
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
              onChange={e => setPageCountState(e.target.value)}
              error={errors.pageCount}
              label='Page Count'
              description='Total number of pages in the book.'
              icon={<FaFileAlt />}
            />
            <TextGroup
              id='keywords'
              name='keywords'
              placeholder='Enter keywords'
              value={typeof keywordsState === 'string'
                ? keywordsState
                : Array.isArray(keywordsState) ? keywordsState.join(', ') : ''}
              onChange={event => setKeywords(event && event.target ? event.target.value : event)}
              label='Keywords'
              description='Keywords for search optimization.'
              error={errors.keywords}
              className='h-22.5 px-4 border w-133 border-none rounded-md focus:outline-none focus:ring text-sm bg-gray-100 mt-3'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6'>
            <Select
              id='format'
              name='format'
              label='Format'
              className='bg-gray-50 w-full 22.5 outline'
              placeholder='Select format...'
              options={[
                { value: 'hardcover', label: 'Hardcover' },
                { value: 'paperback', label: 'Paperback' },
                { value: 'ebook', label: 'eBook' },
                { value: 'audio', label: 'Audio Book' }
              ]}
              error={errors.format}
              description='Select the format of this book.'
              value={formatState || ''}
              onChange={e => setFormatState(e.target.value)}
            />
            <InputLabel
              id='publishedDate'
              name='publishedDate'
              type='date'
              label='Published Date'
              placeholder='Select published date'
              value={publishedDateState}
              onChange={e => setPublishedDateState(e.target.value)}
              error={errors.publishedDate}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6'>
            <div className='w-full'>
              <MultiselectGroup
                id='genre'
                name='genre'
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
                value={genreState}
              />
            </div>
            <UploadInput
              name='cover'
              placeholder='Upload book cover'
              label='Book Cover'
              accept='image/*'
              targetFolder='covers'
              bookTitle={titleState}
              error={errors.cover}
              file={coverState}
              onChange={fileObj => {
                setCover(fileObj)
                if (errors.cover) setErrors({ ...errors, cover: '' })
              }}
              onReset={() => {
                setCover(null)
                if (errors.cover) setErrors({ ...errors, cover: '' })
              }}
            />
          </div>
          <div className='mb-4 sm:mb-6'>
            <Textarea
              label='Short Description'
              name='shortDescription'
              placeholder='Enter a short description of the book'
              value={shortDescriptionState}
              onChange={e => setShortDescriptionState(e.target.value)}
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
              onChange={e => setNewReleaseState(e.target.checked)}
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
    image : PropTypes.oneOfType([PropTypes.string, PropTypes.object]) // Updated to allow object
  })),
  publisher     : PropTypes.string,
  publishedDate : PropTypes.string,
  pageCount     : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  genre         : PropTypes.arrayOf(PropTypes.string),
  cover         : PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object // Allow both string and object
  ]),
  shortDescription : PropTypes.string,
  format           : PropTypes.string,
  newRelease       : PropTypes.bool,
  keywords         : PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ])
}
