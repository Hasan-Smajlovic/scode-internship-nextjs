import PropTypes from 'prop-types'

import DBObject from '@/data/mongoDb/DBObject'
import AddedContent from '@/components/templates/addedContent/index'

// content items
async function getContentFromDB (id) {
  try {
    const dbObject = new DBObject('content')
    await dbObject.init()
    const content = await dbObject.getById(id)

    if (!content) {
      return null
    }

    // fetch books based on the filters
    const booksDb = new DBObject('books')
    await booksDb.init()

    // extract filters from the nested searchRequest object
    const searchParams = {
      searchTerm : '',
      filters    : content.searchRequest?.filters || {},
      sort       : content.searchRequest?.sort || 'title ASC',
      page       : 1,
      pageSize   : 10
    }

    try {
      const searchResults = await booksDb.searchWithFacets(searchParams)

      return {
        content,
        searchResults,
        initialSearchParams: {
          ...content.searchRequest
        }
      }
    } catch (searchError) {
      console.error('Error in searchWithFacets:', searchError)
      return {
        content,
        searchResults: {
          items      : [],
          totalCount : 0,
          facets     : {
            format   : [],
            genre    : [],
            keywords : [],
            year     : []
          }
        },
        initialSearchParams: {
          ...content.searchRequest
        }
      }
    }
  } catch (error) {
    console.error('Error fetching content by ID:', error)
    return null
  }
}

export default async function ContentPage ({ params }) {
  const resolvedParams = await params
  const id = resolvedParams?.id

  if (!id) {
    return (
      <main className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-2xl shadow-lg p-8 border border-slate-100'>
            <div className='text-center py-8'>
              <h1 className='text-3xl font-bold text-slate-800 mb-4'>Invalid ID parameter</h1>
              <p className='text-slate-600'>The requested content could not be found. Please check the URL and try again.</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const data = await getContentFromDB(id)

  if (!data) {
    return (
      <main className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-2xl shadow-lg p-8 border border-slate-100'>
            <div className='text-center py-8'>
              <h1 className='text-3xl font-bold text-slate-800 mb-4'>Content not found</h1>
              <p className='text-slate-600'>The requested content does not exist or may have been removed.</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const { content, initialSearchParams } = data

  return (
    <main className='min-h-screen bg-gradient-to-br from-slate-10 to-white-10 py-8 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-10 text-center px-4 py-12 bg-gradient-to-r from-white-600 to-indigo-100 rounded-2xl shadow-xl text-primary'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4 font-serif tracking-tight'>
            {content.title}
          </h1>
          {content.description && (
            <p className='text-xl text-black max-w-3xl mx-auto leading-relaxed'>
              {content.description}
            </p>
          )}
        </div>

        <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200'>
          <AddedContent
            searchResults={data.searchResults}
            initialSearchParams={initialSearchParams}
          />
        </div>
      </div>
    </main>
  )
}

ContentPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string
  })
}
