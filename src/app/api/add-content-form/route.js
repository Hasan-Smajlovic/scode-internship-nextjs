import { NextResponse } from 'next/server'

import DBObject from '@/data/mongoDb/DBObject'
import { CONTENT_COLLECTION } from '@/constants/collections'

export async function POST (request) {
  try {
    const contentData = await request.json()

    if (!contentData.title || !contentData.description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const contentPageData = {
      title         : contentData.title,
      description   : contentData.description,
      searchRequest : {
        filters: {
          format     : contentData.format || [],
          genre      : contentData.genre || [],
          year       : contentData.year || [],
          keywords   : contentData.keywords || [],
          date       : [contentData.yearFrom, contentData.yearTo],
          newRelease : contentData.newRelease || false
        }
      },
      createdAt: new Date().toISOString()
    }

    const db = new DBObject(CONTENT_COLLECTION)
    await db.init()
    const result = await db.insertMany([contentPageData])

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to save to database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success : true,
      message : 'Content saved successfully',
      data    : contentPageData
    })
  } catch (error) {
    console.error('Error processing content submission:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process content submission' },
      { status: 500 }
    )
  }
}
