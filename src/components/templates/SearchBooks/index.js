'use client'
import { useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

import Filter from '@/components/templates/SearchBooks/Filter'
import Sort from './Sort'
import Items from './Items'
import Pagging from './Pagging'

export default function SearchBooks ({ items: initialItems, totalCount: initialTotalCount, facets: initialFacets }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  // Filters searchparams
  const format = searchParams.get('format')
  const genre = searchParams.get('genre')
  const newRelease = searchParams.get('newRelease')
  const publishedYear = searchParams.get('publishedYear') // i added this so my filtering by year works
  const keywords = searchParams.get('keywords') // i added this so my filtering by keywords works
  const yearFrom = searchParams.get('yearFrom') || '' // i added this so my filtering by year range works
  const yearTo = searchParams.get('yearTo') || '' // i added this so my filtering by year range works

  // Query searchparams
  const query = searchParams.get('query') || ''
  // Pagination searchparams
  const pageCount = searchParams.get('pageCount')
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const itemsPerPage = parseInt(searchParams.get('pageSize') || '10', 10)
  // Sort searchparams
  const sort = searchParams.get('sort') || 'title ASC'

  // States for items, totalCount, facets
  const [items, setItems] = useState(initialItems)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [facets, setFacets] = useState(initialFacets || {}) // This is where i made a state for facets for filtering

  // Filtered items
  const [filteredItems, setFilteredItems] = useState(initialItems)

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null && !(Array.isArray(value) && value.length === 0)) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    window.history.replaceState({}, '', `${pathname}?${params.toString()}`)

    // when filters change manually, we need to re-fetch
    isFirstRender.current = false
  }

  const handlePageChange = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    updateFilters({ page: validPage })
  }

  const handleItemsPerPageChange = (newItemsPerPage) => { // handle setting items per change (how many it will show)
    updateFilters({
      pageSize : newItemsPerPage,
      page     : 1
    })
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleSortChange = (newSort) => {
    updateFilters({ sort: newSort, page: 1 }) // My page will reset to page 1 on sort change
  }
  useEffect(() => {
    if (query && !isFirstRender.current) {
      fetch('/api/search-book', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({
          searchTerm : query,
          filters    : {
            format,
            genre,
            pageCount,
            newRelease: newRelease === 'true',
            publishedYear,
            keywords,
            yearFrom,
            yearTo
          },
          page     : currentPage,
          pageSize : itemsPerPage,
          sort
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data && data.items) {
            setItems(data.items)
            setTotalCount(data.totalCount || data.items.length)
            setFilteredItems(data.items)
            setFacets(data.facets || {})
          }
        })
        .catch(error => {
          console.error('Error fetching search results:', error)
        })
    }

    // when fetch happens first time it wont allow fetching another time
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [
    publishedYear, genre, newRelease, itemsPerPage, currentPage,
    format, pageCount, query, sort, keywords, yearFrom, yearTo
  ])

  useEffect(() => {
    setFilteredItems(items)
  }, [items])

  // if nothing is searched
  if (!query) {
    return (
      <div className='flex items-center justify-center w-full min-h-screen px-4'>
        <main className='w-full max-w-lg text-center'>
          <div className='p-6 sm:p-8 lg:p-10'>
            <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-4'>
              Looking for books?
            </h2>
            <p className='text-gray-500 text-sm sm:text-base'>
              Enter a search term to find books
            </p>
          </div>
        </main>
      </div>
    )
  }

  // if something is searched
  return (
    <div className='flex flex-col md:flex-row gap-6 p-4 w-full'>
      <aside className='w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0'>
        <div className='w-full h-full p-4 flex flex-col gap-4 bg-white rounded-lg border-r border-b border-gray-200'>
          <Filter
            facets={facets}
            format={format}
            updateFilters={updateFilters}
            genre={genre}
            pageCount={pageCount ? pageCount.split(',').map(Number) : [0, 1000]}
            newRelease={newRelease === 'true'}
            publishedYear={publishedYear}
            keywords={keywords}
            yearFrom={yearFrom}
            yearTo={yearTo}
          />
        </div>
      </aside>
      <main className='w-full md:w-2/3 lg:w-3/4 flex flex-col gap-4'>
        <div className='flex flex-col gap-4 mb-4 justify-center md:flex-row md:items-center md:justify-between'>
          <Sort
            value={searchParams.get('sort') || 'title ASC'}
            onChange={handleSortChange}
            options={[
              { value: 'Sort by...', label: 'Sort by...', disabled: true },
              { value: 'title ASC', label: 'Title (A-Z)' },
              { value: 'title DESC', label: 'Title (Z-A)' },
              { value: 'pageCount ASC', label: 'Page Count' }
            ]}
          />
          <Pagging
            currentPage={currentPage}
            totalItems={totalCount}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
        <Items items={filteredItems} />
      </main>
    </div>
  )
}

SearchBooks.propTypes = {
  items      : PropTypes.array.isRequired,
  totalCount : PropTypes.number.isRequired,
  facets     : PropTypes.object
}
