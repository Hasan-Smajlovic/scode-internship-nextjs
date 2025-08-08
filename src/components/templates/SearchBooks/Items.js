import PropTypes from 'prop-types'

export default function Items ({ items }) {
  if (!items || items.length === 0) {
    return <p className='relative left-145 text-gray-500'>No books found.</p>
  }

  return (
    <ul className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
      {items.map(book => (
        <li
          key={book.id}
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
              {book.authors && book.authors.length > 0 && (
                <p>
                  <span className='font-medium'>Author:</span>{' '}
                  {book.authors.map(a => typeof a === 'string' ? a : a?.name || '').join(', ')}
                </p>
              )}
              {book.genre && book.genre.length > 0 && (
                <p><span className='font-medium'>Genre:</span> {book.genre.join(', ')}</p>
              )}
              {book.format && (
                <p><span className='font-medium'>Format:</span> {book.format}</p>
              )}
              {typeof book.pageCount === 'number' && (
                <p><span className='font-medium'>Pages:</span> {book.pageCount}</p>
              )}
              {book.publishedDate && (
                <p><span className='font-medium'>Published:</span> {new Date(book.publishedDate).toLocaleDateString()}</p>
              )}
              {'newRelease' in book && (
                <p><span className='font-medium'>New Release:</span> {book.newRelease ? 'Yes' : 'No'}</p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
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
