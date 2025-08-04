import PropTypes from 'prop-types'

import Button from '@/components/patterns/atoms/Button'

export default function Pagging ({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    onPageChange(page)
  }

  return (
    <div className='flex flex-col items-center mt-6'>
      <div className='flex justify-center mt-6'>
        <nav className='flex items-center space-x-2'>
          <Button
            type='button'
            variant='secondary'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Previous
          </Button>
          <span className='text-sm text-gray-700'>
            Page {currentPage} of {totalPages}
          </span>
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
    </div>
  )
}
Pagging.propTypes = {
  currentPage  : PropTypes.number.isRequired,
  totalPages   : PropTypes.number.isRequired,
  onPageChange : PropTypes.func.isRequired
}
