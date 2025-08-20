'use client'
import { useRouter, usePathname } from 'next/navigation'

import Image from '../../patterns/atoms/Image'
import Link from '../../patterns/atoms/Link'
import Search from '../../patterns/molecules/Search'
import Dropdown from '../../templates/addContentForm/Dropdown'

export default function Header () {
  const router = useRouter()
  const pathname = usePathname()
  let searchTimeout = null

  const handleSearchChange = value => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      const searchQuery = `query=${encodeURIComponent(value)}`
      if (pathname === '/searchbook') { // use push if not on search book, use window if on search book
        const newUrl = `/searchbook?${searchQuery}`
        window.history.pushState({}, '', newUrl)
      } else {
        router.push(`/searchbook?${searchQuery}`)
      }
    }, 500)
  }

  return (
    <header className='shadow-md *:tracking-wide z-50 sticky left-0 top-0 text-text bg-white'>
      <div className='w-full'>
        <div className='container mx-auto flex flex-1 h-[110px] items-center justify-between px-4'>
          <div className='flex items-center space-x-2'>
            <Image src='logo.png' alt='Logo' className='h-8 w-8' />
            <span className='font-bold text-lg'>Testing Header</span>
          </div>
          <nav className='flex space-x-6'>
            <Link href='/' className='hover:text-primary-300 transition'>Home</Link>
            <Link href='/addbook' className='hover:text-primary-300 transition'>Add Book</Link>
            <Link href='/addcontentpage' className='hover:text-primary-300 transition'>Add Content Page</Link>
            <Dropdown />
            <div className='mb-6'>
              <Search
                onChange={handleSearchChange}
                placeholder='Search for books...'
              />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
