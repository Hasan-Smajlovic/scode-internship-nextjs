import { NextResponse } from 'next/server'
import DBObject from '@/data/mongoDb/DBObject'

export async function POST () {
  try {
    const db = new DBObject('content')
    await db.init()

    const contentItems = await db.getMany()

    const dropdownItems = contentItems.map(item => ({
      id    : item._id.toString(),
      title : item.title
    }))

    return NextResponse.json({
      success : true,
      items   : dropdownItems,
      status  : 200
    })
  } catch (error) {
    console.error('Error fetching dropdown content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}
