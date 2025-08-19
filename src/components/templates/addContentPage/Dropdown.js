'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Dropdown () {
  const [isOpen, setIsOpen] = useState(false)
  const [contentItems, setContentItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const fetchContent = async () => {
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

    fetchContent()
  }, [])

  const handleSelectItem = (item) => {
    setIsOpen(false)
  }

  return (
    <div className='relative inline-block text-left'>
      <div>
        <button
          type='button'
          className='inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500'
          id='options-menu'
          aria-haspopup='true'
          aria-expanded='true'
          onClick={toggleDropdown}
        >
          Select Content
        </button>
      </div>

      {isOpen && (
        <div className='absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
          <div className='py-1' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
            {isLoading && (
              <div className='px-4 py-2 text-sm text-gray-500'>Loading...</div>
            )}

            {error && (
              <div className='px-4 py-2 text-sm text-red-500'>{error}</div>
            )}

            {!isLoading && !error && contentItems.length === 0 && (
              <div className='px-4 py-2 text-sm text-gray-500'>No content available</div>
            )}

            {!isLoading && !error && contentItems.map((item) => (
              <Link
                key={item.id}
                href={`/content/${item.id}`}
                onClick={() => handleSelectItem(item)}
                className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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
