'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Filter from '@/components/templates/SearchBooks/Filter'
import Sort from './Sort'
import Items from './Items'
import Pagging from './Pagging'
export default function SearchBooks ({ items: initialItems, totalCount: initialTotalCount }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const query = searchParams.get('query') || ''
  const format = searchParams.get('format')
  const genre = searchParams.get('genre')
  const pageCount = searchParams.get('pageCount')
  const newRelease = searchParams.get('newRelease')
  const publisher = searchParams.get('publisher')
  const publishedYear = searchParams.get('publishedYear') // i added this so my filtering by year works
  const author = searchParams.get('author')

  const [items, setItems] = useState(initialItems)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [facets, setFacets] = useState(initialItems.facets || {}) // This is where i made a state for facets for filtering

  const [filteredItems, setFilteredItems] = useState(initialItems)
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(searchParams.get('pageSize') || '10'))

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== '' && value.length !== 0) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    if (pathname === '/searchbook') {
      router.push(`/searchbook?${params.toString()}`) // samo za header
    }
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

  const handleClick = (event) => {
    const { value } = event.target
    router.push(`/searchbook?query=${value} ` + 11)
    console.log('Search term clicked:')
  }

  const handleSortChange = (newSort) => {
    updateFilters({ sort: newSort, page: 1 }) // Page will reset to page 1 on sort change
    console.log('My sorted data:', newSort)
  }

  useEffect(() => {
    const paramsObject = {}
    searchParams.forEach((value, key) => {
      paramsObject[key] = value
    })

    if (query) {
      fetch('/api/search-book', {
        method  : 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          searchTerm : query,
          filters    : {
            format,
            genre,
            pageCount,
            newRelease: newRelease === 'true',
            publisher,
            publishedYear,
            author
          },
          page     : currentPage,
          pageSize : itemsPerPage,
          sort     : searchParams.get('sort') || 'title ASC'
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log('API response', data)
          if (data && data.items) {
            setItems(data.items)
            setTotalCount(data.totalCount || data.items.length)
            setFilteredItems(data.items)
            setFacets(data.facets || {}) // called facets for filtering
          }
        })
        .catch(error => {
          console.error('Error fetching search results:', error)
        })
    }
  }, [author, publishedYear, genre, newRelease, publisher, itemsPerPage, currentPage, format, pageCount, query, searchParams])

  useEffect(() => {
    setFilteredItems(items)
  }, [items])

  if (!query) {
    return (
      <div className='flex flex-col md:flex-row gap-6 p-4'>
        <aside className='w-full md:w-1/3 lg:w-1/4'>
          <div className='w-full h-full p-4 flex flex-col gap-4 bg-white rounded-lg border-r border-b border-gray-200'>
            <Filter
              facets={facets} // called facets
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
            facets={facets} // added facets here
            year={publishedYear}
            onYearChange={(value) => updateFilters({ publishedYear: value })}
            format={format}
            onFormatChange={(value) => updateFilters({ format: value })}
            genre={genre}
            onGenreChange={(value) => updateFilters({ genre: value })}
            pageCount={pageCount ? pageCount.split(',').map(Number) : [0, 1000]}
            onPageCountChange={value => updateFilters({ pageCount: value })}
            newRelease={newRelease === 'true'} // still does not work
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
            value={searchParams.get('sort') || 'title ASC'}
            onChange={handleSortChange}
            options={[
              { value: 'Sort by...', label: 'Sort by...' },
              { value: 'title ASC', label: 'Title (A-Z)' },
              { value: 'title DESC', label: 'Title (Z-A)' },
              { value: 'author ASC', label: 'Author (A-Z)' },
              { value: 'author DESC', label: 'Author (Z-A)' },
              { value: 'newRelease DESC', label: 'New Release' },
              { value: 'pageCount DESC', label: 'Page Count' },
              { value: 'publishedYear DESC', label: 'Published Year' }
            ]}
          />
          <div className='flex flex-col md:flex-row md:items-center md:gap-6 gap-2'>
            <Pagging
              currentPage={currentPage}
              totalItems={totalCount}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              onClick={handleClick}
            />
          </div>
        </div>

        <Items items={filteredItems} />
      </main>
    </div>
  )
}

SearchBooks.propTypes = {
  items      : PropTypes.array.isRequired,
  totalCount : PropTypes.number.isRequired
}
