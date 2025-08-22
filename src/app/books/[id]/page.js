import PropTypes from 'prop-types'
import { FaUser, FaBook, FaBuilding, FaCalendarAlt, FaFileAlt, FaTags, FaStar, FaLayerGroup } from 'react-icons/fa'

import DBObject from '@/data/mongoDb/DBObject'

async function getBookData (id) {
  try {
    const booksDb = new DBObject('books')
    await booksDb.init()
    const book = await booksDb.getById(id)

    if (!book) {
      return null
    }
    return book
  } catch (error) {
    console.error('Error fetching book:', error)
    return null
  }
}

export default async function Page ({ params }) {
  const awaitedParams = await params
  const id = awaitedParams.id

  if (!id) {
    console.error('No book ID found in params')
    return (
      <h1>No book ID provided in the URL.</h1>
    )
  }

  const data = await getBookData(id)

  if (!data) {
    console.error('No book data found')
    return (
      <h1>No book found with ID: {id}</h1>
    )
  }
  return (
    <main className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-5xl mx-auto'>

        <div className='bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl p-10'>
          <div className='inline-block mb-4 space-y-2 justify-center text-center w-full border-b border-gray-300'>
            <h1 className='text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight'> {data.title}</h1>
            <h3 className='text-xl text-gray-600  p-4 border-gray-300 italic text-center font-light'>{data.subtitle}</h3>
          </div>

          <div className='flex items-center mb-4'>

            <div className=' border-r border-gray-300 pr-10'>
              <img src={data.cover} alt='cover' className='min-w-[350px] h-auto rounded-lg' />
              <div className='bg-slate-50 p-3 rounded-lg shadow-sm mt-2'>
                <h4 className='text-sm font-medium text-slate-500 mb-3 flex items-center'><FaUser className='mr-2' />Authors</h4>
                <div className='flex flex-wrap gap-4'>
                  {data.authors.map((author, index) => (
                    <div key={index} className='flex items-center gap-2'>
                      <img src={author.image} alt={author.name} className='w-8 h-8 rounded-full object-cover' />
                      <span className='text-slate-800 font-semibold'>{author.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex-1 ml-10'>
              <h3 className='text-lg font-semibold text-slate-800 uppercase tracking-wide '>
                Description
              </h3>
              <h3 className='text-xl mb-3 pt-2 pl-5 pb-4 border-l-8 border-yellow-500 font-light'>{data.shortDescription}</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>

                <div className='bg-slate-50 p-3 rounded-lg shadow-sm'>
                  <h4 className='text-sm font-medium text-slate-500 mb-1 flex items-center'><FaBuilding className='mr-2' />Publisher</h4>
                  <p className='text-slate-800 font-semibold'>{data.publisher}</p>
                </div>

                <div className='bg-slate-50 p-3 rounded-lg shadow-sm'>
                  <h4 className='text-sm font-medium text-slate-500 mb-1 flex items-center'><FaCalendarAlt className='mr-2' />Published Date</h4>
                  <p className='text-slate-800 font-semibold'>{data.publishedDate}</p>
                </div>

                <div className='bg-slate-50 p-3 rounded-lg shadow-sm'>
                  <h4 className='text-sm font-medium text-slate-500 mb-1 flex items-center'><FaFileAlt className='mr-2' />Page Count</h4>
                  <p className='text-slate-800 font-semibold'>{data.pageCount} pages</p>
                </div>

                <div className='bg-slate-50 p-3 rounded-lg shadow-sm'>
                  <h4 className='text-sm font-medium text-slate-500 mb-1 flex items-center'><FaLayerGroup className='mr-2' />Genre</h4>
                  <p className='text-slate-800 font-semibold'>
                    {Array.isArray(data.genre) ? data.genre.join(', ') : data.genre}
                  </p>
                </div>

                <div className='bg-slate-50 p-3 rounded-lg shadow-sm'>
                  <h4 className='text-sm font-medium text-slate-500 mb-1 flex items-center'><FaBook className='mr-2' />Format</h4>
                  <p className='text-slate-800 font-semibold capitalize'>{data.format}</p>
                </div>

                <div className='bg-slate-50 p-3 rounded-lg shadow-sm'>
                  <h4 className='text-sm font-medium text-slate-500 mb-1 flex items-center'><FaStar className='mr-2' />New Release</h4>
                  <p className='text-slate-800 font-semibold'>{data.newRelease ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div className='bg-slate-50 p-3 rounded-lg shadow-sm mt-5'>
                <h4 className='text-sm font-medium text-slate-500 mb-1 flex items-center'><FaTags className='mr-2' />Keywords</h4>
                <p className='text-slate-800 font-semibold'>{data.keywords.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

Page.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
}
