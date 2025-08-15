import { NextResponse } from 'next/server'

import { DEFAULT_PAGE_SIZE } from '@/constants/paging'
import DBObject from '@/data/mongoDb/DBObject'

export async function POST (request) {
  try {
    const body = await request.json()
    const {
      searchTerm = '',
      filters = {},
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      sort = ''
    } = body

    const parsedPage = parseInt(page, 10) || 1
    const parsedPageSize = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE

    const dbObject = new DBObject('books')
    await dbObject.init()

    const result = await dbObject.searchWithFacets({
      searchTerm,
      filters,
      page     : parsedPage,
      pageSize : parsedPageSize,
      sort
    })

    return NextResponse.json({
      success       : true,
      status        : 200,
      items         : result.items,
      totalCount    : result.totalCount,
      facets        : result.facets,
      searchRequest : result.searchRequest,
      aggregation   : result.aggregation
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json({
      success : false,
      message : 'Error fetching books',
      error   : error.message
    }, { status: 500 })
  }
}
