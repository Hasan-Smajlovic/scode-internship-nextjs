import PropTypes from 'prop-types'
import DBObject from '@/data/mongoDb/DBObject'
import AddedContent from '@/components/templates/addedContent/index'
// content items
async function getContentWithSearchResults (id) {
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
    const filtersObj = content.searchRequest?.filters || {}
    const sort = content.searchRequest?.sort || 'title ASC'

    // always array
    const normalize = (val) => !val ? [] : Array.isArray(val) ? val : [val]

    const processedFilters = {}

    if (filtersObj.format) {
      processedFilters.format = { $in: normalize(filtersObj.format) }
    }

    if (filtersObj.genre?.length) {
      processedFilters.genre = { $in: filtersObj.genre }
    }

    if (filtersObj.keywords?.length) {
      processedFilters.keywords = { $in: filtersObj.keywords }
    }

    if (filtersObj.year) {
      processedFilters.publishedDate = { $regex: `^${filtersObj.year[0] || filtersObj.year}` }
    }

    if (filtersObj.newRelease !== undefined) {
      processedFilters.newRelease = filtersObj.newRelease
    }
    const searchParams = {
      searchTerm : '',
      filters    : processedFilters,
      sort,
      page       : 1,
      pageSize   : 10
    }

    console.log('Filters received:', filtersObj)

    try {
      const searchResults = await booksDb.searchWithFacets(searchParams)
      console.log('Search results items without length:', searchResults)

      if (!searchResults.facets) {
        searchResults.facets = {}
      }
      searchResults.facets.format = searchResults.facets.format || []
      searchResults.facets.genre = searchResults.facets.genre || []
      searchResults.facets.keywords = searchResults.facets.keywords || []
      searchResults.facets.year = searchResults.facets.year || []

      return {
        content,
        searchResults,
        initialSearchParams: { // iskoristi ove u searchbook da excluda vec predefinisan filter i isto tako da mi vraca tacnu vrijednost
          filters: filtersObj,
          sort
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
          filters: filtersObj,
          sort
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
      <main className='bg-white min-h-screen p-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-6 p-6 bg-white shadow-lg rounded-lg'>
            <h1 className='text-3xl font-bold mb-4'>Invalid ID parameter</h1>
          </div>
        </div>
      </main>
    )
  }

  const data = await getContentWithSearchResults(id)

  if (!data) {
    return (
      <main className='bg-white min-h-screen p-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-6 p-6 bg-white shadow-lg rounded-lg'>
            <h1 className='text-3xl font-bold mb-4'>Content not found</h1>
          </div>
        </div>
      </main>
    )
  }

  const { content, initialSearchParams } = data
  console.log('Content fetched:', content)
  console.log('Initial search params:', initialSearchParams)

  return (
    <main className='bg-white min-h-screen p-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-6 p-6 bg-white shadow-lg rounded-lg'>
          <h1 className='text-3xl font-bold mb-4'>{content.title}</h1>
          {content.description && (
            <p className='text-gray-700'>{content.description}</p>
          )}
        </div>
        <AddedContent
          searchResults={data.searchResults}
          initialSearchParams={initialSearchParams}
        />
      </div>
    </main>
  )
}

ContentPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string
  })
}
