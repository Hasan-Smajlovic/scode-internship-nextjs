'use client'
import PropTypes from 'prop-types'

import { PAGING_OPTIONS } from '@/constants/paging'
import Button from '@/components/patterns/atoms/Button'

export default function Pagging ({ currentPage, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) { return }
    onPageChange(page)
  }
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ type: 'page', value: i })
      }
    } else {
      pages.push({ type: 'page', value: 1 })
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push({ type: 'page', value: i })
      }
    }
    return pages
  }

  return (
    <>
      <div className='sticky flex justify-center mb-4 mr-50 mt-8'>
        <div className='text-sm text-gray-600'>
          <span className='font-medium'>Page {currentPage} of {totalPages}</span>
          <span className='mx-2'>|</span>
          Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
        </div>
      </div>
      <div className='flex justify-center mb-4 mt-6'>
        <label htmlFor='itemsPerPage' className='mr-2 text-sm text-gray-600 mt-1'>
          Items per page:
        </label>
        <select
          id='itemsPerPage'
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className='border border-gray-300 rounded px-2 py-1 text-sm'
        >
          {PAGING_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className='flex justify-center mt-2'>
        <nav className='flex items-center space-x-2'>
          <Button
            type='button'
            variant='primary'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Previous
          </Button>
          {getPageNumbers().map((item, idx) =>
            item.type === 'page'
              ? (
                <Button
                  key={`page-${item.value}`}
                  type='button'
                  variant='secondary'
                  onClick={() => handlePageChange(item.value)}
                  className={`px-4 py-2 rounded-lg ${currentPage === item.value ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {item.value}
                </Button>
                )
              : (
                <span key={`ellipsis-${idx}`} className='px-3 py-2'>...</span>
                )
          )}
          <Button
            type='button'
            variant='primary'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Next
          </Button>
        </nav>
      </div>
    </>
  )
}

Pagging.propTypes = {
  currentPage          : PropTypes.number.isRequired,
  totalItems           : PropTypes.number.isRequired,
  itemsPerPage         : PropTypes.number.isRequired,
  onPageChange         : PropTypes.func.isRequired,
  onItemsPerPageChange : PropTypes.func.isRequired
}
