'use client'

import { useState } from 'react'
import InputLabel from '../../components/patterns/molecules/InputLabel'
import Button from '../../components/patterns/atoms/Button'
import Link from '../../components/patterns/atoms/Link'
import Image from '../../components/patterns/atoms/Image'
import InputGroup from '../../components/patterns/molecules/InputGroup'
import Alert from '../../components/patterns/atoms/Alert'

import { FaUser, FaCalendar } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

export default function CustomPage () {
  const [count, setCount] = useState(0)

  const handlePrimaryClick = () => {
    Alert.show({
      type     : 'primary',
      children : 'Primary button clicked!',
      position : 'bottom-center'
    })
  }

  const handleSecondaryClick = () => {
    Alert.show({
      type     : 'secondary',
      children : 'Secondary button clicked!',
      position : 'bottom-center'
    })
  }

  const handleAlertClick = () => {
    Alert.show({
      type     : 'info',
      children : `Counter reset! Previous value was: ${count}`,
      position : 'top-left',
      timeout  : 4000
    })
    setCount(0)
  }

  return (
    <div className='p-6'>
      <div className='flex flex-wrap gap-4 mb-6'>
        <Button variant='primary' onClick={handlePrimaryClick}>Primary Button</Button>
        <Button variant='secondary' onClick={handleSecondaryClick}>Secondary Button</Button>
      </div>

      <div className='mb-6'>
        <Link href='#'>Link</Link>
      </div>

      <div className='mb-6'>
        <Image src='logo.png' alt='Logo' width={100} height={50} />
      </div>

      <div className='grid grid-cols-2 md:grid-cols-6 gap-4 mb-6'>
        <InputLabel
          id='username'
          label='Username'
          placeholder='Enter your username'
          error='This field is required'
          icon={<FaUser />}
        />
        <InputLabel
          id='email'
          label='Email'
          placeholder='Enter your email'
          error='This field is required'
          icon={<MdEmail />}
        />
        <InputLabel
          id='birthdate'
          label='Birth Date'
          type='date'
          icon={<FaCalendar />}
        />
        <InputLabel
          id='country'
          label='Country'
          type='select'
          icon={<FaUser />}
          options={[
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' }
          ]}
        />
      </div>

      <div className='space-y-4 mb-6'>
        <InputGroup
          icon={<FaUser />}
          type='text'
          placeholder='Username'
        />
        <InputGroup
          icon={<MdEmail />}
          type='email'
          placeholder='Email'
        />
        <InputGroup
          icon={<FaUser />}
          type='checkbox'
          label='I agree to the terms and conditions'
        />
      </div>

      <div className='mt-8 p-4 border rounded'>
        <h2 className='text-xl font-bold mb-4'>Counter: {count}</h2>
        <div className='flex flex-wrap gap-2'>
          <Button variant='primary' onClick={() => setCount(count + 1)}>Increment</Button>
          <Button variant='secondary' onClick={() => setCount(count - 1)}>Decrement</Button>
          <Button variant='primary' onClick={() => setCount(0)}>Reset</Button>
          <Button variant='secondary' onClick={handleAlertClick}>Show Alert</Button>
        </div>
      </div>
    </div>
  )
}
