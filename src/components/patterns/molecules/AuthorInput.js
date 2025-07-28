'use client'
import { FaUser, FaTimes } from 'react-icons/fa'
import PropTypes from 'prop-types'

import InputLabel from '@/components/patterns/molecules/InputLabel'
import UploadInput from '@/components/patterns/molecules/UploadInput'
import Alert from '../atoms/Alert'
import Label from '../atoms/Label'

export default function AuthorInput ({ authors, onChange, error }) {
  const updateAuthor = (index, field, value) => {
    const updatedAuthors = [...authors]
    updatedAuthors[index] = {
      ...updatedAuthors[index],
      [field]: value
    }
    onChange(updatedAuthors)
  }

  const removeAuthor = (index) => {
    if (authors.length <= 1) return
    const updatedAuthors = [...authors]
    updatedAuthors.splice(index, 1)
    onChange(updatedAuthors)
  }

  return (
    <div className='space-y-1'>
      <div className='flex justify-between items-center'>
        <Label className='block text-sm font-medium text-gray-700'>Authors</Label>
      </div>

      {authors.map((author, index) => (
        <div key={index} className='relative'>
          <div className='absolute top-2 right-2'>
            {authors.length > 1 && (
              <button
                type='button'
                onClick={() => removeAuthor(index)}
                className='text-red-500 hover:text-red-700'
                aria-label='Remove author'
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className='mb-4'>
            <InputLabel
              id={`author-name-${index}`}
              name={`author-name-${index}`}
              placeholder='Enter author name'
              value={author.name || ''}
              onChange={(e) => updateAuthor(index, 'name', e.target.value)}
              icon={<FaUser />}
              error={error && (!author.name || !author.image) ? error : ''}
            />
          </div>

          <div>
            <UploadInput
              name={`author-image-${index}`}
              label={`Author ${index + 1} Image`}
              placeholder='Upload author image'
              accept='image/*'
              targetFolder='authors'
              onChange={(file) => {
                const imagePath = file ? (typeof file === 'string' ? file : file.name || '') : ''
                updateAuthor(index, 'image', imagePath)
              }}
            />
            {author.image && (
              <p className='mt-1 text-sm text-gray-500'>
                Selected image: {author.image}
              </p>
            )}
          </div>
        </div>
      ))}
      {authors.length === 0 && (
      <Alert type='warning'>At least one author is required</Alert>
      )}
    </div>
  )
}

AuthorInput.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      name  : PropTypes.string,
      image : PropTypes.string
    })
  ),
  onChange : PropTypes.func.isRequired,
  error    : PropTypes.string
}

AuthorInput.defaultProps = {
  authors: [{ name: '', image: '' }]
}
