import { NextResponse } from 'next/server'

import DBObject from '@/data/mongoDb/DBObject'
import { BOOK_COLLECTION } from '@/constants/collections'

export async function POST (request) {
  try {
    const booksCollection = new DBObject(BOOK_COLLECTION)
    await booksCollection.init()

    const data = await request.json()

    const requiredFields = ['title', 'subtitle', 'authors', 'publisher', 'keywords', 'pageCount', 'genre', 'format', 'cover', 'publishedDate', 'shortDescription']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({
          success : false,
          error   : `${field} is required`
        }, { status: 400 })
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
    const result = await booksCollection.insertOne(data)

    return NextResponse.json({
      success    : true,
      message    : 'Book data saved successfully',
      insertedId : result.insertedId,
      data       : result.data
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      success : false,
      error   : error.message
    }, { status: 500 })
  }
}
