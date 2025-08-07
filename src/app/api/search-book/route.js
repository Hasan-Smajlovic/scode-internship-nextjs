import { NextResponse } from 'next/server'

import DBObject from '@/data/mongoDb/DBObject'
import { DEFAULT_PAGE_SIZE } from '@/constants/collections'

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

    const dbObject = new DBObject('books')
    await dbObject.init()

    const books = await dbObject.search({
      searchTerm,
      filters,
      page,
      pageSize,
      sort
    })

    return NextResponse.json({
      success : true,
      count   : books.length,
      status  : 200,
      books
    })
  } catch (error) {
    return NextResponse.json({
      success : false,
      message : 'Error fetching books',
      error   : error.message
    }, { status: 500 })
  }
}
