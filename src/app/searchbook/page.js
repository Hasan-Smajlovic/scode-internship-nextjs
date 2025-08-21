import PropTypes from 'prop-types'

import SearchBook from '@/components/templates/SearchBooks/index'
import DBObject from '@/data/mongoDb/DBObject'

const getItemsBySearchQuery = async (searchParams) => {
  const {
    page = '1',
    format = '',
    genre = '',
    pageSize = 10,
    query: searchTerm = '',
    sort = 'title ASC',
    publishedYear = '',
    keywords = '',
    yearFrom = '',
    yearTo = '',
    newRelease = '',
    pageCount = ''
  } = searchParams

  const searchObject = {
    filters: {},
    page,
    pageSize,
    searchTerm,
    sort
  }

  if (format) searchObject.filters.format = [format]
  if (genre) searchObject.filters.genre = [genre]
  if (publishedYear) searchObject.filters.publishedYear = [publishedYear]
  if (keywords) searchObject.filters.keywords = [keywords]
  if (yearFrom) searchObject.filters.yearFrom = yearFrom
  if (yearTo) searchObject.filters.yearTo = yearTo
  if (newRelease) searchObject.filters.newRelease = newRelease === 'true'
  if (pageCount) searchObject.filters.pageCount = pageCount

  const dbObject = new DBObject('books')
  await dbObject.init()

  return {
    ...await dbObject.searchWithFacets(searchObject),
    searchRequest: searchObject
  }
}

export default async function SearchBooks (props) {
  const params = props.searchParams ? await Promise.resolve(props.searchParams) : {}
  try {
    const response = await getItemsBySearchQuery(params)
    const currentPage = params.page || '1'
    return (
      <main className='bg-white min-h-screen'>
        <SearchBook
          items={response.items || []}
          totalCount={response.totalCount || 0}
          facets={response.facets || {}}
          searchRequest={response.searchRequest}
          currentPage={currentPage}
        />
      </main>
    )
  } catch (error) {
    console.error('Error fetching search results:', error)
    throw error
  }
}

SearchBooks.propTypes = {
  searchParams: PropTypes.object.isRequired
}
