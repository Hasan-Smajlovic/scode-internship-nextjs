import { useState } from 'react'
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
  ...rest
}) {
  const [fileType, setFileType] = useState('')
  const [fileName, setFileName] = useState('')

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    const supportedFileTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']

    if (!supportedFileTypes.includes(file.type)) {
      alert('Unsupported file type. Please upload a valid image file.')
    }
    setFileType(file.type)
    setFileName(file.name)
    if (onChange) {
      onChange(file, targetFolder)
    }
  }

  const handleFileReset = () => {
    setFileType('')
    setFileName('')
    if (onReset) {
      onReset()
    }
  }

  return (
    <div className={`upload-input ${className}`}>
      <Label className='block mb-2 text-sm font-medium'>{label}</Label>

      <div className='relative'>
        <Label className='flex flex-col items-start'>
          <div className='bg-primary text-white px-4 py-2 rounded-l-md cursor-pointer w-29'>
            Choose file
          </div>
          <input
            type={type}
            onChange={handleFileChange}
            accept={accept}
            className='sr-only'
            {...rest}
          />
        </Label>

        <div className='mt-2 text-sm text-gray-500'>
          {fileName ? `Selected: ${fileName}` : 'No file chosen'}
        </div>
      </div>

      {fileName && (
        <div className='mt-2 text-sm text-gray-500'>
          <p>File type: {fileType}</p>
          <p>Target Folder: {targetFolder}</p>
        </div>
      )}
      <Button
        type='button'
        variant='secondary'
        className='w-29 mb-4 '
        onClick={handleFileReset}
      >
        Reset
      </Button>
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
  targetFolder : PropTypes.string
}
