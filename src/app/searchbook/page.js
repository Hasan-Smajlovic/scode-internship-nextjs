import PropTypes from 'prop-types'

import SearchBook from '@/components/templates/SearchBooks/index'
import DBObject from '@/data/mongoDb/DBObject'

const getItemsBySearchQuery = async (searchParams) => {
  const {
    searchTerm = '',
    page = '1',
    format = '',
    genre = '',
    pageSize = 10,
    sort = 'title ASC'
  } = searchParams

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

  return await dbObject.searchWithFacets(searchObject)
}
export default async function SearchBooks (props) {
  const searchParams = await props.searchParams || {}
  try {
    const response = await getItemsBySearchQuery(searchParams)
    return (
      <main className='bg-white min-h-screen'>
        <SearchBook
          items={response.items}
          totalCount={response.totalCount}
          currentPage={searchParams.page}
          facets={response.facets}
          searchRequest={response.searchRequest}
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
