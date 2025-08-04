'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Search from '@/components/patterns/molecules/Search'
import Pagging from './Pagging'

const ITEMS_PER_PAGE = 9

export default function Items () {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const pageParam = parseInt(searchParams.get('page')) || 1

  const [currentPage, setCurrentPage] = useState(pageParam)
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    setCurrentPage(pageParam)
  }, [pageParam])

  useEffect(() => {
    if (!query) {
      setSearchResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    fetch(`/api/search-book?search=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data.books || [])
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching search results:', error)
        setError('Failed to fetch search results.')
        setIsLoading(false)
      })
  }, [query])

  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const visibleItems = searchResults.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page) => {
    router.push(`/searchbook?query=${query}&page=${page}`)
  }

  return (
    <>
      <div className='mb-6'>
        <Search
          value={query}
          onChange={value => router.push(`/searchbook?query=${value}`)}
          placeholder='Search for books...'
        />
      </div>

      {isLoading && <p className='text-center text-gray-500 mt-4'>Loading...</p>}
      {error && <p className='text-center text-red-500 mt-4'>{error}</p>}
      {!isLoading && !error && query && visibleItems.length === 0 && (
        <p className='text-center text-gray-500 mt-4'>No results found.</p>
      )}

      {!isLoading && visibleItems.length > 0 && (
        <>
          <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {visibleItems.map(book => (
              <li
                key={book._id}
                className='flex flex-col mr-7 mb-10 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden'
              >
                {book.cover && (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className='w-full h-64 object-cover rounded-t-2xl'
                  />
                )}
                <div className='flex flex-col p-4 h-full justify-between'>
                  <div>
                    <h2 className='text-lg font-semibold text-gray-800 text-center mb-2'>
                      {book.title}
                    </h2>
                    {book.shortDescription && (
                      <p className='text-sm text-gray-700 text-center mb-4'>
                        {book.shortDescription}
                      </p>
                    )}
                  </div>
                  <div className='text-sm text-gray-600 mt-auto space-y-1'>
                    {book.authors && (
                      <p>
                        <span className='font-medium'>Author:</span>{' '}
                        {book.authors.map(a => typeof a === 'string' ? a : a.name).join(', ')}
                      </p>
                    )}
                    {book.genre && (
                      <p><span className='font-medium'>Genre:</span> {book.genre.join(', ')}</p>
                    )}
                    {book.format && (
                      <p><span className='font-medium'>Format:</span> {book.format}</p>
                    )}
                    {book.pageCount && (
                      <p><span className='font-medium'>Pages:</span> {book.pageCount}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Pagging
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  )
}
