import { NextResponse } from 'next/server'
import DBObject from '@/data/mongoDb/DBObject'
import { BOOK_COLLECTION } from '@/constants/collections'
import fs from 'fs'
import path from 'path'

export async function POST (request) {
  try {
    const booksCollection = new DBObject(BOOK_COLLECTION)
    await booksCollection.init()
    const data = await request.json()

    const requiredFields = [
      'title', 'subtitle', 'authors', 'publisher', 'keywords',
      'pageCount', 'genre', 'format', 'cover', 'publishedDate', 'shortDescription'
    ]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({
          success : false,
          error   : `${field} is required`
        }, { status: 400 })
      }
    }

    const publicDir = path.join(process.cwd(), 'public')
    const authorsImagesDir = path.join(publicDir, 'authors')
    if (!fs.existsSync(authorsImagesDir)) {
      fs.mkdirSync(authorsImagesDir, { recursive: true })
    }

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
