import InputLabel from '../patterns/molecules/InputLabel'
import Button from '../patterns/atoms/Button'
import Link from '../patterns/atoms/Link'
import Image from '../patterns/atoms/Image'
import Alert from '../patterns/atoms/Alert'
import InputGroup from '../patterns/molecules/InputGroup'

export default function CustomPage () {
  return (
    <>
      <Alert type='error'>Error Alert</Alert>
      <Button variant='primary'>Primary Button</Button>
      <Button variant='secondary'>Secondary Button</Button>
      <Link href='#'>Link</Link>
      <Image src='logo.png' alt='Logo' width={100} height={50} />
      <InputLabel id='username' label='Username' placeholder='Enter your username' error='This field is required' />
      <InputLabel id='email' label='Email' placeholder='Enter your email' error='This field is required' />
      <InputGroup iconName='user' type='text' placeholder='Username' />
      <InputGroup iconName='mail' type='email' placeholder='Email' />
      <InputLabel id='birthdate' label='Birth Date' type='date' />
      <InputLabel
        id='country'
        label='Country'
        type='select'
        options={[
          { value: 'us', label: 'United States' },
          { value: 'ca', label: 'Canada' }
        ]}
      />
    </>
  )
}
