import { NextResponse } from 'next/server'

import DBObject from '@/data/mongoDb/DBObject'
import { PRODUCT_COLLECTION } from '@/constants/collections'

export async function POST (request) {
  try {
    const productsCollection = new DBObject(PRODUCT_COLLECTION)
    await productsCollection.init() // This is where im creating new collection called test_products
    const data = await request.json() // This is where i converted data from json to js object

    if (!data.name || !data.email) { // this is where i did validation
      return NextResponse.json({
        success : false,
        error   : 'Name and email are required'
      }, { status: 400 })
    }

    // Simulate a delay, used chatgpt (didnt understand why this is needed)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Insert document (insert one clarification needed)
    const result = await productsCollection.insertOne(data)

    // Return success response
    return NextResponse.json({
      success    : true,
      message    : 'Product data saved successfully',
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
