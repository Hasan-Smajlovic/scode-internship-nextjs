import PropTypes from 'prop-types'
import { FaUser, FaTimes, FaPlus } from 'react-icons/fa'

import InputLabel from '@/components/patterns/molecules/InputLabel'
import UploadInput from '@/components/patterns/molecules/UploadInput'
import Alert from '../atoms/Alert'
import Label from '../atoms/Label'
import Button from '../atoms/Button'

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
    <>
      <div className='space-y-1'>
        <div className='flex justify-between items-center'>
          <Label className='block text-sm font-medium text-gray-700'>Authors</Label>
        </div>
        {authors.map((author, index) => (
          <div key={index} className='relative mb-6'>
            {index > 0 && (
              <button
                type='button'
                onClick={() => removeAuthor(index)}
                className='absolute top-9 right-2 z-10 rounded-full p-1 text-error hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
                aria-label='Remove author'
                tabIndex={0}
              >
                <FaTimes />
              </button>
            )}
            <InputLabel
              id={`author-name-${index}`}
              name={`author-name-${index}`}
              placeholder='Enter author name'
              value={author.name || ''}
              onChange={(e) => updateAuthor(index, 'name', e.target.value)}
              icon={<FaUser />}
              error={error && (!author.name || !author.image) ? error : ''}
            />
            <UploadInput
              file={author.image && typeof author.image === 'object' ? author.image : null}
              name={`author-image-${index}`}
              label='Author Image'
              placeholder='Upload author image'
              accept='image/*'
              targetFolder='authors'
              authorName={author.name || `Author${index + 1}`}
              onChange={(imageObj) => updateAuthor(index, 'image', imageObj)}
              onReset={() => updateAuthor(index, 'image', null)}
              error={error && (!author.name || !author.image) ? error : ''}
            />
          </div>
        ))}
        {authors.length === 0 && (
          <Alert type='warning'>At least one author is required</Alert>
        )}
      </div>
      <div className='mt-4'>
        <Button
          type='button'
          onClick={() => onChange([...authors, { name: '', image: null }])}
          className='w-35 h-10 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          <FaPlus className='mr-2' />
          Add Author
        </Button>
      </div>
    </>
  )
}

AuthorInput.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      name  : PropTypes.string,
      image : PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    })
  ),
  onChange : PropTypes.func.isRequired,
  error    : PropTypes.string
}

AuthorInput.defaultProps = {
  authors: [{ name: '', image: null }]
}
