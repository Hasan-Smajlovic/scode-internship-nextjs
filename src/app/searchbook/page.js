import PropTypes from 'prop-types'

import SearchBook from '@/components/templates/SearchBooks/index'
import DBObject from '@/data/mongoDb/DBObject'

function transformBookDoc (doc) {
  return {
    ...doc,
    _id       : doc._id.toString(),
    createdAt : doc.createdAt ? new Date(doc.createdAt).toISOString() : null
  }
}

const getItemsBySearchQuery = async (searchParams) => {
  const searchTerm = searchParams.get('query') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const format = searchParams.get('format') || ''
  const genre = searchParams.get('genre') || ''
  const pageSize = parseInt(searchParams.get('pageSize') || '10')
  const sort = searchParams.get('sort') || 'title ASC'

  const searchObject = {
    searchTerm,
    filters: {},
    page,
    pageSize,
    sort
  }

  if (format) searchObject.filters.format = format
  if (genre) searchObject.filters.genre = genre

  const dbObject = new DBObject('books')
  await dbObject.init()

  const books = await dbObject.searchWithFacets(searchObject)
  const transformedItems = (books.items || []).map(transformBookDoc)
  return {
    ...books,
    items: transformedItems
  }
}
export default async function SearchBooks (props) {
  const searchParams = new URLSearchParams()
  if (props.searchParams && typeof props.searchParams === 'object') {
    Object.entries(props.searchParams).forEach(([key, value]) => {
      if (value) searchParams.set(key, value)
    })
  }
  try {
    const items = await getItemsBySearchQuery(searchParams)

    return (
      <main className='bg-white min-h-screen'>
        <SearchBook
          items={items.items}
          totalCount={items.totalCount}
          currentPage={parseInt(searchParams.get('page') || '1')}
          facets={items.facets}
          searchRequest={items.searchRequest}
        />
      </main>
    )
  } catch (error) {
    console.log('Error fetching search results:', error)
    throw error
  }
}

SearchBooks.propTypes = {
  searchParams: PropTypes.object.isRequired
}
