import { useState } from 'react'

import UploadInput from '../../patterns/molecules/UploadInput'
import Alert from '../../patterns/atoms/Alert'
import Button from '../../patterns/atoms/Button'

export default function UploadFileForm () {
  const [fileData, setFileData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (file, targetFolder) => {
    setFileData({
      file,
      targetFolder
    })
  }

  const onReset = () => {
    setFileData(null)
    setIsSubmitting(false)
    setError(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', fileData.file)
      formData.append('targetFolder', fileData.targetFolder)

      const response = await fetch('/api/upload', {
        method : 'POST',
        body   : formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to upload file')
      }
      Alert.show({
        type     : 'success',
        children : `File "${fileData.file.name}" uploaded successfully to "${fileData.targetFolder}" folder`,
        position : 'top-center'
      })
    } catch (error) {
      setError(error.message)
      Alert.show({
        type     : 'error',
        children : `Error uploading file: ${error.message}`,
        position : 'top-center'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-6'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <h3 className='text-lg font-medium'>Upload Image</h3>
        {error && (
          <div className='p-3 bg-red-100 text-red-700 rounded-md'>
            {error}
          </div>
        )}
        <div className='border p-2 rounded-md bg-gray-50 '>
          <UploadInput
            type='file'
            label='Select an image to upload'
            onChange={handleFileChange}
            onReset={onReset}
            accept='image/*'
            targetFolder='inputImages'
            className='w-50 mb-4'
          />
          <Button
            type='submit'
            variant='primary'
            className='w-29 mb-4'
            disabled={isSubmitting || !fileData}
          >
            {isSubmitting ? <span className='animate-spin'>Uploading...</span> : <span>Upload</span>}
          </Button>
        </div>
      </form>
    </div>
  )
}
