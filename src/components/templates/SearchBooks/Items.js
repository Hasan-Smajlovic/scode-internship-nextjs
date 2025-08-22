import PropTypes from 'prop-types'
import { FaBook } from 'react-icons/fa'

import Link from '@/components/patterns/atoms/Link'

export default function Items ({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 px-4'>
        <div className='text-center max-w-md mx-auto'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-100 text-gray-400 rounded-full mb-4'>
            <FaBook size={24} />
          </div>
          <h3 className='text-lg font-medium text-gray-700 mb-2'>No books found</h3>
          <p className='text-gray-500'>Try adjusting your search criteria or filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {items.map(book => (
        <div
          key={book.id}
          className='group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1'
        >
          {book.cover && (
            <Link href={`/books/${book.id}`}>
              <div className='relative overflow-hidden'>
                <img
                  src={book.cover}
                  alt={book.title}
                  className='w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300'
                />
              </div>
            </Link>
          )}
          <div className='p-5'>
            <div className='mb-4'>
              <h2 className='text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200'>
                {book.title}
              </h2>
            </div>

            <div className='space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-3'>
              {book.authors && book.authors.length > 0 && (
                <div className='flex items-start'>
                  <span className='font-medium text-gray-700 min-w-[60px]'>Author:</span>
                  <span className='flex-1'>{book.authors.map(a => typeof a === 'string' ? a : a?.name || '').join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

Items.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id               : PropTypes.string.isRequired,
      title            : PropTypes.string.isRequired,
      cover            : PropTypes.string,
      shortDescription : PropTypes.string,
      authors          : PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
      genre            : PropTypes.arrayOf(PropTypes.string),
      format           : PropTypes.string,
      pageCount        : PropTypes.number
    })
  )
}
