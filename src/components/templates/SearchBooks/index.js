'use client'
import { useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

import Filter from '@/components/templates/SearchBooks/Filter'
import Sort from './Sort'
import Items from './Items'
import Pagging from './Pagging'

export default function SearchBooks (props) {
  const {
    items: initialItems,
    totalCount: initialTotalCount,
    facets: initialFacets,
    alwaysShow = false,
    initialSearchParams = {},
    isContentPage = false
  } = props

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  // extracting initial filters and sort from initialSearchParams
  const initialFilters = initialSearchParams.filters || {}
  const initialSort = initialSearchParams.sort || 'title ASC'

  // initialSearchParams for default values if present
  const format = searchParams.get('format') || initialFilters.format || ''
  const genre = searchParams.get('genre') || initialFilters.genre || ''
  const newRelease = searchParams.get('newRelease') ?? initialFilters.newRelease ?? ''
  const publishedYear = searchParams.get('publishedYear') || initialFilters.publishedYear || ''
  const keywords = searchParams.get('keywords') || initialFilters.keywords || ''
  const yearFrom = searchParams.get('yearFrom') || initialFilters.yearFrom || ''
  const yearTo = searchParams.get('yearTo') || initialFilters.yearTo || ''

  const query = searchParams.get('query') || ''
  const pageCount = searchParams.get('pageCount') || initialFilters.pageCount || ''
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const itemsPerPage = parseInt(searchParams.get('pageSize') || '10', 10)
  const sort = searchParams.get('sort') || initialSort

  // States for items, totalCount, facets
  const [items, setItems] = useState(initialItems)
  const [totalCount, setTotalCount] = useState(initialTotalCount || 0)
  const [facets, setFacets] = useState(initialFacets || {})
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
    isFirstRender.current = false
  }

  const handlePageChange = (page) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    updateFilters({ page: validPage })
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
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
    updateFilters({ sort: newSort, page: 1 })
  }

  useEffect(() => {
    // fetch if we have a query OR alwaysShow is true
    if ((query || alwaysShow) && !isFirstRender.current) {
      const searchTerm = query || ''
      fetch('/api/search-book', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({
          searchTerm,
          filters: {
            format        : format ? [format] : [],
            genre         : genre ? [genre] : [],
            pageCount,
            newRelease    : newRelease === 'true',
            publishedYear : publishedYear ? [publishedYear] : [],
            keywords      : keywords ? [keywords] : [],
            yearFrom,
            yearTo
          },
          page     : currentPage,
          pageSize : itemsPerPage,
          sort
        })
      })
        .then(response => {
          if (!response.ok) {
            console.error('Search API returned error status:', response.status)
            return response.json().then(errorData => {
              throw new Error(errorData.details || 'Error fetching search results')
            })
          }
          return response.json()
        })
        .then(data => {
          if (data && Array.isArray(data.items)) {
            setItems(data.items)
            setTotalCount(data.totalCount || data.items.length)
            setFilteredItems(data.items)
            setFacets(data.facets || {})
          } else {
            console.error('Search API returned unexpected data structure:', data)
            setItems([])
            setTotalCount(0)
            setFilteredItems([])
          }
        })
        .catch(error => {
          console.error('Error fetching search results:', error)
        })
    }

    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [
    publishedYear, genre, newRelease, itemsPerPage, currentPage,
    format, pageCount, query, sort, keywords, yearFrom, yearTo, alwaysShow
  ])

  useEffect(() => {
    // Cleanup only after first render dependencies
    return () => {
      isFirstRender.current = true
    }
  }, [])

  useEffect(() => {
    setFilteredItems(items)
  }, [items])

  if (!query && !alwaysShow) {
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

  return (
    <div className='flex flex-col md:flex-row gap-6 p-4 w-full'>
      <aside className='w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0'>
        <div className='w-full h-full p-4 flex flex-col gap-4 bg-white rounded-lg border-r border-b border-gray-200'>
          <Filter
            facets={{
              formats  : facets.formats || [],
              genres   : facets.genres || [],
              years    : facets.years || [],
              keywords : facets.keywords || []
            }}
            format={format}
            genre={genre}
            publishedYear={publishedYear}
            keywords={keywords}
            yearFrom={yearFrom}
            yearTo={yearTo}
            newRelease={newRelease}
            updateFilters={updateFilters}
            initialFilters={initialFilters}
            isContentPage={isContentPage}
          />
        </div>
      </aside>
      <main className='w-full md:w-2/3 lg:w-3/4 flex flex-col gap-4'>
        <div className='flex flex-col gap-4 mb-4 justify-center md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4'>
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
  items               : PropTypes.array.isRequired,
  totalCount          : PropTypes.number.isRequired,
  facets              : PropTypes.object,
  alwaysShow          : PropTypes.bool,
  initialSearchParams : PropTypes.shape({
    filters : PropTypes.object,
    sort    : PropTypes.string
  }),
  isContentPage: PropTypes.bool
}
