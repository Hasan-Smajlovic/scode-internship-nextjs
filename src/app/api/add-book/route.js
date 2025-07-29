import { NextResponse } from 'next/server'
import DBObject from '@/data/mongoDb/DBObject'
import { BOOK_COLLECTION } from '@/constants/collections'
import fs from 'fs'
import path from 'path'
import { BookSchema } from '@/validation/bookSchema'

export async function POST (request) {
  try {
    const booksCollection = new DBObject(BOOK_COLLECTION)
    await booksCollection.init()
    const data = await request.json()
    const result = BookSchema.safeParse(data)
    if (!result.success) {
      console.log('Zod validation error:', result.error)
      const zodErrors = result.error && Array.isArray(result.error.errors)
        ? result.error.errors.map(e => ({
          path    : e.path,
          message : e.message
        }))
        : [{ message: 'Validation failed. Please make sure to use valid inputs' }]
      return NextResponse.json({
        success : false,
        error   : zodErrors,
        zodRaw  : result.error
      }, { status: 400 })
    }
    const publicDir = path.join(process.cwd(), 'public')
    const authorsImagesDir = path.join(publicDir, 'authors')
    if (!fs.existsSync(authorsImagesDir)) {
      fs.mkdirSync(authorsImagesDir, { recursive: true })
    }
    console.log('Inserting book data:', data)
    const insertResult = await booksCollection.insertOne(data)
    console.log('Insert result:', insertResult)

    return NextResponse.json({
      success    : true,
      message    : 'Book data saved successfully',
      insertedId : insertResult.insertedId,
      data       : insertResult.data
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      success : false,
      error   : [
        {
          message: error?.message || 'Internal server error'
        }
      ]
    }, { status: 500 })
  }
}
