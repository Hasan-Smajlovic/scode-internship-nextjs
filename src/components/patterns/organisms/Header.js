'use client'
import { useRouter, usePathname } from 'next/navigation'
import { FiHome, FiBook, FiFileText } from 'react-icons/fi'

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
    <header className='shadow-md *:tracking-wide z-50 sticky left-0 top-0 text-text bg-gradient-to-r from-slate-900 to-slate-800 text-white'>
      <div className='w-full'>
        <div className='container mx-auto flex flex-1 h-[110px] items-center justify-between px-4'>
          <div className='flex items-center space-x-2'>
            <Image src='logo.png' alt='Logo' className='h-8 w-8' />
            <span className='font-bold text-lg'>SCode</span>
          </div>
          <div className='mb-6 ml-100'>
            <Search
              onChange={handleSearchChange}
              placeholder='Search for books...'
            />
          </div>
          <nav className='flex items-center space-x-6'>
            <div className='flex items-center space-x-4'>
              <Link href='/' className=' flex items-center py-2 px-3 rounded-md hover:bg-slate-700/50 transition-all duration-300 group'>
                <FiHome />
                <span className='ml-1'>Home</span>
              </Link>
              <Link href='/addbook' className=' flex items-center py-2 px-3 rounded-md hover:bg-slate-700/50 transition-all duration-300 group'>
                <FiBook />
                <span className='ml-1'>Add Book</span>
              </Link>
              <Link href='/addcontentpage' className=' flex items-center py-2 px-3 rounded-md hover:bg-slate-700/50 transition-all duration-300 group'>
                <FiFileText />
                <span className='ml-1'>Add Content Page</span>
              </Link>
            </div>
            <Dropdown />
          </nav>
        </div>
      </div>
    </header>
  )
}
