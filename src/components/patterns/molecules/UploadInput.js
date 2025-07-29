'use client'

import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
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
  targetFolder = 'photosUploadsFolder',
  authorName = '', // <-- pass authorName for filename
  description,
  error,
  ...rest
}) {
  const [fileType, setFileType] = useState('')
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const supportedFileTypes = [
      'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'
    ]

    if (!supportedFileTypes.includes(file.type)) {
      alert('Unsupported file type. Please upload a valid image file.')
      return
    }

    setFileType(file.type)
    setFileName(file.name)

    // Format filename: /220px-Author_Name.jpg
    const ext = file.name.split('.').pop()
    const safeName = (authorName || 'Author').replace(/[^a-z0-9]/gi, '_')
    const formattedName = `220px-${safeName}.${ext}`

    const formData = new FormData()
    formData.append('file', file)
    formData.append('targetFolder', targetFolder)
    formData.append('fileName', formattedName)

    try {
      const res = await fetch('/api/upload', {
        method : 'POST',
        body   : formData
      })
      const data = await res.json()
      if (data.success && data.path) {
        if (onChange) onChange(data.path)
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'))
        if (onChange) onChange('')
      }
    } catch (err) {
      alert('Upload failed: ' + err.message)
      if (onChange) onChange('')
    }
  }

  const handleFileReset = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setFileType('')
    setFileName('')
    if (onReset) onReset()
    if (onChange) onChange('')
  }

  return (
    <div className={`upload-input ${className}`}>
      <Label>
        {placeholder && <span className='text-primary mt-10'>{placeholder}</span>}
      </Label>
      <div className='relative mt-2'>
        <div className='mb-2 text-sm text-gray-500'>
          {fileName ? `Selected: ${fileName}` : 'No file chosen'}
        </div>
        <input
          ref={fileInputRef}
          id={`file-upload-${label}`}
          type={type}
          accept={accept}
          className='hidden'
          onChange={handleFileChange}
          {...rest}
        />
        <div className='flex flex-row gap-4 '>
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
        {fileName && (
          <div className='mt-2 text-sm text-gray-500'>
            <p>File type: {fileType}</p>
            <p>Target Folder: {targetFolder}</p>
          </div>
        )}
        {error && (
          <div className='text-red-500 text-xs mt-1'>{error}</div>
        )}
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
  description  : PropTypes.string,
  error        : PropTypes.string
}
