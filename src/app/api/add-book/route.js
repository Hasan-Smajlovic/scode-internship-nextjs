import { NextResponse } from 'next/server'
import DBObject from '@/data/mongoDb/DBObject'
import { BOOK_COLLECTION } from '@/constants/collections'
import { BookSchema } from '@/lib/validation/bookSchema'

export async function POST (request) {
  try {
    const data = await request.json()
    const result = BookSchema.safeParse(data)

    if (!result.success) {
      const zodErrors = result.error.errors.map(e => ({
        path    : e.path,
        message : e.message
      }))
      return NextResponse.json({
        success : false,
        error   : true,
        data    : zodErrors,
        message : 'Validation failed'
      }, { status: 400 })
    }

    const booksCollection = new DBObject(BOOK_COLLECTION)
    await booksCollection.init()
    await booksCollection.insertOne(result.data)

    return NextResponse.json({
      success : true,
      error   : false,
      message : 'Book added successfully'
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      success : false,
      error   : true,
      message : 'Internal server error'
    }, { status: 500 })
  }
}
