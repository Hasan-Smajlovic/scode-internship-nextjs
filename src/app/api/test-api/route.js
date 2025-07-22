import { NextResponse } from 'next/server'
import DBObject from '../../lib/DBObject'
import mongodb from '../../lib/mongodb'

const usersCollection = new DBObject('test_users') // This is where im creating new collection called test_users

export async function POST (request) {
  try {
    console.log('POST request to /api/test-api received') // debugging log
    console.log('Collection name:', usersCollection.collectionName) // debugging log
    console.log('Database being used:', mongodb.dbName) // debugging log. These debugs are visible in the terminal where i write npm run dev

    const data = await request.json() // This is where i converted data from json to js object
    console.log('Request data:', data) // debugging log

    if (!data.name || !data.email) { // this is where i did validation
      console.log('Validation failed: Missing name or email')
      return NextResponse.json({
        success : false,
        error   : 'Name and email are required'
      }, { status: 400 })
    }

    console.log('Simulating delay of 1 second...')
    // Simulate a delay chatgpt (didnt understand why this is needed)
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('About to insert document into MongoDB')
    // Insert document (insert one clarification needed)
    const result = await usersCollection.insertOne(data)
    console.log('Document inserted successfully:', result)

    // Return success response
    return NextResponse.json({
      success    : true,
      message    : 'User data saved successfully',
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
