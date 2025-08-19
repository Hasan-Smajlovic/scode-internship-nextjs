import { NextResponse } from 'next/server'
import DBObject from '@/data/mongoDb/DBObject'

export async function POST (request) {
  try {
    const body = await request.json()
    const { filters = {}, sort = 'title ASC' } = body

    const dbObject = new DBObject('books')
    await dbObject.init()

    const result = await dbObject.searchOnlyWithFacets({ filters, sort })
    return NextResponse.json({
      success : true,
      facets  : { format: result.facets.format, genre: result.facets.genre, year: result.facets.year, keywords: result.facets.keywords },
      sort    : result.searchRequest.sort
    })
  } catch (error) {
    console.error('Error fetching facets:', error)
    return NextResponse.json({
      success : false,
      error   : 'Failed to fetch facets',
      status  : 500
    })
  }
}
