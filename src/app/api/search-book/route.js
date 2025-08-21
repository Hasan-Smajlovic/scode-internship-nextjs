import { NextResponse } from 'next/server'
import DBObject from '@/data/mongoDb/DBObject'

export async function POST (request) {
  try {
    const requestData = await request.json()
    const { searchTerm, filters, sort, page, pageSize } = requestData

    // validate searchTerm
    const cleanSearchTerm = typeof searchTerm === 'string' ? searchTerm : ''
    // Create a new DBObject for books collection
    const dbObject = new DBObject('books')
    await dbObject.init()
    // Make the search request with proper error handling
    try {
      const searchResults = await dbObject.searchWithFacets({
        searchTerm : cleanSearchTerm,
        filters    : filters || {},
        sort       : sort || 'title ASC',
        page       : Number(page) || 1,
        pageSize   : Number(pageSize) || 10
      })

      return NextResponse.json(searchResults)
    } catch (searchError) {
      console.error('Error in searchWithFacets:', searchError)

      // Check if it's a regex error
      if (searchError.message && searchError.message.includes('Regular expression')) {
        // Return a more user-friendly response for regex errors
        return NextResponse.json({
          error      : 'Invalid search pattern',
          details    : 'Your search contains special characters that cannot be processed.',
          items      : [],
          totalCount : 0,
          facets     : {}
        }, { status: 400 })
      }
      throw searchError
    }
  } catch (error) {
    console.error('Search API error:', error.stack || error)
    return NextResponse.json({
      error      : 'An error occurred while searching books',
      details    : error.message,
      stack      : process.env.NODE_ENV === 'development' ? error.stack : undefined,
      items      : [],
      totalCount : 0,
      facets     : {}
    }, { status: 500 })
  }
}
