'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Filter from '@/components/templates/SearchBooks/Filter'
import Sort from './Sort'
import Items from './Items'
import Pagging from './Pagging'

export default function SearchBooks ({ items, totalCount }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('query') || ''
  const format = searchParams.get('format')
  const genre = searchParams.get('genre')
  const pageCount = searchParams.get('pageCount')
  const newRelease = searchParams.get('newRelease')
  const publisher = searchParams.get('publisher')
  const publishedYear = searchParams.get('publishedYear')
  const author = searchParams.get('author')

  const [filteredItems, setFilteredItems] = useState(items)
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(searchParams.get('pageSize') || '10'))

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== '' && value.length !== 0) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    router.push(`/searchbook?${params.toString()}`)
  }

  const handlePageChange = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
    updateFilters({ page: validPage })
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    const newTotalPages = Math.ceil(filteredItems.length / newItemsPerPage)
    const newCurrentPage = Math.min(currentPage, newTotalPages || 1)
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(newCurrentPage)
    updateFilters({
      pageSize : newItemsPerPage,
      page     : newCurrentPage
    })
  }

  useEffect(() => {
    setFilteredItems(items)
  }, [items])

  if (!query) {
    return (
      <div className='flex flex-col md:flex-row gap-6 p-4'>
        <aside className='w-full md:w-1/3 lg:w-1/4'>
          <div className='w-full h-full p-4 flex flex-col gap-4 bg-white rounded-lg border-r border-b border-gray-200'>
            <Filter
              format={format}
              onFormatChange={(value) => updateFilters({ format: value })}
              genre={genre}
              onGenreChange={(value) => updateFilters({ genre: value })}
              pageCount={pageCount ? pageCount.split(',').map(Number) : [0, 1000]}
              onPageCountChange={value => updateFilters({ pageCount: value })}
              newRelease={newRelease === 'true'}
              onNewReleaseChange={(value) => updateFilters({ newRelease: value })}
              publisher={publisher}
              onPublisherChange={(value) => updateFilters({ publisher: value })}
              publishedYear={publishedYear}
              onPublishedYearChange={(value) => updateFilters({ publishedYear: value })}
              author={author}
              onAuthorChange={(value) => updateFilters({ author: value })}
            />
          </div>
        </aside>
        <main className='w-full md:w-2/3 lg:w-3/4 flex flex-col items-center justify-center'>
          <div className='text-center p-10'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>Looking for books?</h2>
            <p className='text-gray-500'>Enter a search term to find books</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className='flex flex-col md:flex-row gap-6 p-4'>
      <aside className='w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0'>
        <div className='w-full h-full p-4 flex flex-col gap-4 bg-white rounded-lg border-r border-b border-gray-200'>
          <Filter
            facets={items.facets}
            format={format}
            onFormatChange={(value) => updateFilters({ format: value })}
            genre={genre}
            onGenreChange={(value) => updateFilters({ genre: value })}
            pageCount={pageCount ? pageCount.split(',').map(Number) : [0, 1000]}
            onPageCountChange={value => updateFilters({ pageCount: value })}
            newRelease={newRelease === 'true'}
            onNewReleaseChange={(value) => updateFilters({ newRelease: value })}
            publisher={publisher}
            onPublisherChange={(value) => updateFilters({ publisher: value })}
            publishedYear={publishedYear}
            onPublishedYearChange={(value) => updateFilters({ publishedYear: value })}
            author={author}
            onAuthorChange={(value) => updateFilters({ author: value })}
          />
        </div>
      </aside>

      <main className='w-full md:w-2/3 lg:w-3/4 flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4'>
          <Sort
            value={query}
            onChange={value => router.push(`/searchbook?query=${value}`)}
            options={[
              { value: 'title', label: 'Title' },
              { value: 'author', label: 'Author' },
              { value: 'new release', label: 'New Release' },
              { value: 'page count', label: 'Page Count' },
              { value: 'published year', label: 'Published Year' }
            ]}
          />
          <div className='flex flex-col md:flex-row md:items-center md:gap-6 gap-2'>
            <Pagging
              currentPage={currentPage}
              totalItems={totalCount}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
        <Items items={items} />
      </main>
    </div>
  )
}

SearchBooks.propTypes = {
  items      : PropTypes.array.isRequired,
  totalCount : PropTypes.number.isRequired
}
