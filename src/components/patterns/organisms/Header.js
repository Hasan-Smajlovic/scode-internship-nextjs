import Image from '../../patterns/atoms/Image'
import Link from '../../patterns/atoms/Link'

export default function Header () {
  return (
    <header className='shadow-md *:tracking-wide z-100 sticky left-0 top-0 text-text'>
      <div className='w-full'>
        <div className='container mx-auto flex flex-1 h-[110px] items-center justify-between px-4'>
          <div className='flex items-center space-x-2'>
            <Image src='logo.png' alt='Logo' className='h-8 w-8' />
            <span className='font-bold text-lg'>Testing Header</span>
          </div>
          <nav className='flex space-x-6'>
            <Link href='/' className='hover:text-primary-300 transition'>Home</Link>
            <Link href='/custompage' className='hover:text-primary-300 transition'>Custom Page</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
