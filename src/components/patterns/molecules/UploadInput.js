import PropTypes from 'prop-types'
import { useRef, useState, useEffect } from 'react'

import Label from '../atoms/Label'
import Button from '../atoms/Button'

export default function UploadInput ({
  type = 'file',
  placeholder = 'Upload file',
  label,
  onChange,
  onReset,
  className = '',
  accept = 'image/*',
  targetFolder = 'uploads',
  authorName = '',
  bookTitle = '',
  description,
  error,
  file = null,
  ...rest
}) {
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  // Sync file prop with local UI
  useEffect(() => {
    if (!file) {
      setFileName('')
      if (fileInputRef.current) {
        fileInputRef.current.value = '' // Clear actual input value
      }
    } else if (file.formattedName) {
      setFileName(file.formattedName)
    } else if (file.name) {
      setFileName(file.name)
    }
  }, [file])

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileReset = () => {
    if (fileInputRef.current) {
      // Reset input by cloning and replacing it to clear the file input value completely
      const oldInput = fileInputRef.current
      if (oldInput.parentNode) {
        const newInput = oldInput.cloneNode(true)
        oldInput.parentNode.replaceChild(newInput, oldInput)
        fileInputRef.current = newInput
        newInput.addEventListener('change', handleFileChange)
      } else {
        oldInput.value = ''
      }
    }
    setFileName('')
    onReset?.()
    onChange?.(null)
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (!selectedFile) return

    // Validation for author image: only jpg/jpeg allowed
    if (authorName && !selectedFile.type.match(/^image\/(jpeg|jpg)$/)) {
      alert('Only JPG images are allowed for author photos.')
      handleFileReset()
      return
    }

    // Validation for book cover: only images allowed
    if (label === 'Book Cover' && !selectedFile.type.startsWith('image/')) {
      alert('Only image files are allowed for book covers.')
      handleFileReset()
      return
    }

    const ext = selectedFile.name.split('.').pop()
    let formattedName = selectedFile.name

    if (authorName) {
      const safeName = authorName.replace(/[^a-z0-9]/gi, '_')
      formattedName = `${safeName}.${ext}`
    } else if (label === 'Book Cover') {
      const safeTitle = (bookTitle || 'cover').replace(/[^a-z0-9]/gi, '_')
      formattedName = `${safeTitle}_cover.${ext}`
    }

    setFileName(formattedName)
    onChange?.({ file: selectedFile, formattedName })
  }

  return (
    <div className={`upload-input mt-3 ${className}`}>
      <Label>
        {label}
        {description && <small className='block text-gray-500'>{description}</small>}
      </Label>
      <div className='relative mt-2'>
        <div className='mb-2 text-sm text-gray-500'>
          {fileName ? `Selected: ${fileName}` : 'No file chosen'}
        </div>
        <input
          ref={fileInputRef}
          id={`file-upload-${label}`}
          type={type}
          accept={authorName ? '.jpg,.jpeg,image/jpeg' : accept}
          className='hidden'
          onChange={handleFileChange}
          {...rest}
        />
        <div className='flex flex-row gap-4'>
          <Button
            type='button'
            variant='primary'
            className='h-10'
            onClick={handleButtonClick}
          >
            Choose file
          </Button>
          <Button
            type='button'
            variant='secondary'
            onClick={handleFileReset}
            className='w-27 h-10'
            disabled={!fileName}
          >
            Reset
          </Button>
        </div>
        {error && <div className='text-red-500 text-xs mt-1'>{error}</div>}
      </div>
    </div>
  )
}

UploadInput.propTypes = {
  type         : PropTypes.string,
  placeholder  : PropTypes.string,
  onChange     : PropTypes.func,
  onReset      : PropTypes.func,
  className    : PropTypes.string,
  accept       : PropTypes.string,
  label        : PropTypes.string,
  targetFolder : PropTypes.string,
  authorName   : PropTypes.string,
  bookTitle    : PropTypes.string,
  description  : PropTypes.string,
  error        : PropTypes.string,
  file         : PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null])
  ])
}
