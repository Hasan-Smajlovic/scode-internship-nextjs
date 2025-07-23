import { MongoClient } from 'mongodb'

class MongoDB {
  constructor () {
    this.uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
    this.dbName = process.env.MONGODB_DB_NAME || 'test-db'
  }

  async connect () {
    try {
      const client = new MongoClient(this.uri)
      await client.connect()
      return client.db(this.dbName)
    } catch (error) {
      throw new Error(`Failed to connect to database: ${error.message}`)
    }
  }
}

export default MongoDB
