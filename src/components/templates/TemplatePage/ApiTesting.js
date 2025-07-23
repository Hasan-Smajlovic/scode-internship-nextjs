import Button from '../../patterns/atoms/Button'
import Alert from '../../patterns/atoms/Alert'
import InputLabel from '../../patterns/molecules/InputLabel'
import { useState } from 'react'
import { FaUser, FaEnvelope } from 'react-icons/fa'

export default function ApiTesting () {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [response, setResponse] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    // setDebugInfo('Starting API call...')

    try {
      // setDebugInfo(prev => `${prev}\nSending data: ${JSON.stringify({ name, email })}`)

      // Try test-api first, then fallback to db-api if that fails
      const endpoint = '/api/test-api'
      // setDebugInfo(prev => `${prev}\nUsing endpoint: ${endpoint}`)

      const response = await fetch(endpoint, {
        method  : 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
      })

      // setDebugInfo(prev => `${prev}\nResponse status: ${response.status}`)

      const data = await response.json()
      // setDebugInfo(prev => `${prev}\nReceived data: ${JSON.stringify(data)}`)

      if (response.ok) {
        setResponse(data)
        Alert.show({
          type     : 'success',
          children : 'Data submitted successfully!',
          position : 'top-right'
        })
        setName('')
        setEmail('')
      } else {
        throw new Error(data.error || 'Failed to submit data')
      }
    } catch (error) {
      console.error('API call failed:', error)
      // setDebugInfo(prev => `${prev}\nError: ${error.message}`)

      Alert.show({
        type     : 'error',
        children : error.message,
        position : 'top-middle'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='mt-10 border-t pt-6'>
      <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm'>
        <h2 className='text-xl font-bold mb-6'>MongoDB API Test</h2>

        <div className='space-y-4 mb-6'>
          <InputLabel
            id='name'
            name='name'
            label='Name'
            placeholder='Enter your name'
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors({ ...errors, name: '' })
            }}
            error={errors.name}
            icon={<FaUser />}
            required
          />

          <InputLabel
            id='email'
            name='email'
            label='Email'
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors({ ...errors, email: '' })
            }}
            error={errors.email}
            icon={<FaEnvelope />}
            required
          />
        </div>

        <Button
          variant='primary'
          onClick={handleSubmit}
          className='w-full'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Data'}
        </Button>

        {response && (
          <div className='mt-6'>
            <h3 className='font-medium mb-2'>Response:</h3>
            <pre className='bg-gray-100 p-4 rounded overflow-auto max-h-60 text-sm'>
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        {/* {debugInfo && (
          <div className='mt-4'>
            <h4 className='font-medium text-sm text-gray-600 mb-1'>Debug Info:</h4>
            <pre className='bg-gray-50 p-3 rounded text-xs text-gray-700 overflow-auto max-h-40'>
              {debugInfo}
            </pre>
          </div>
        )} */}
      </div>
    </div>
  )
}
