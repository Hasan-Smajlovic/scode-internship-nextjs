import { NextResponse } from 'next/server'
import DBObject from '@/data/mongoDb/DBObject'

export async function GET (request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const dbObject = new DBObject('books')
    await dbObject.init()

    const books = await dbObject.search(search)

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
