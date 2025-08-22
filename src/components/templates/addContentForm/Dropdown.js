'use client'
import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

import Link from 'next/link'

export default function Dropdown () {
  const [isOpen, setIsOpen] = useState(false)
  const [contentItems, setContentItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const toggleDropdown = async () => {
    // Only fetch if opening and not already loaded
    if (!isOpen && contentItems.length === 0 && !isLoading) {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/get-dropdown-content', {
          method  : 'POST',
          headers : {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filters: {}
          })
        })

        if (!response.ok) {
          throw new Error(`Server error! Status: ${response.status}`)
        }

        const data = await response.json()
        if (data.success && data.items) {
          setContentItems(data.items)
        } else {
          throw new Error(data.error || 'Failed to fetch content')
        }
      } catch (error) {
        console.error('Error fetching dropdown content:', error)
        setError('Failed to load content. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    setIsOpen(!isOpen)
  }
  const handleSelectItem = (item) => {
    setIsOpen(false)
  }

  return (
    <div className='relative inline-block text-left'>
      <div>
        <button
          type='button'
          className='flex items-center py-2 px-3 rounded-md hover:bg-slate-700/50 transition-all duration-300 group'
          id='options-menu'
          aria-haspopup='true'
          aria-expanded='true'
          onClick={toggleDropdown}
        >
          Select Content
          <FiChevronDown />
        </button>
      </div>

      {isOpen && (
        <div className='absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
          <div role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
            {isLoading && (
              <div className='px-4 py-2 text-sm text-white bg-gradient-to-r from-slate-900 to-slate-800'>Loading...</div>
            )}

            {error && (
              <div className='px-4 py-2 text-sm text-red-500'>{error}</div>
            )}

            {!isLoading && !error && contentItems.length === 0 && (
              <div className='px-4 py-2 text-sm text-white bg-gradient-to-r from-slate-900 to-slate-800'>No content available</div>
            )}

            {!isLoading && !error && contentItems.map((item) => (
              <Link
                key={item.id}
                href={`/content/${item.id}`}
                onClick={() => handleSelectItem(item)}
                className='block px-4 py-2 text-sm bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-600 hover:to-slate-600 transition'
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
