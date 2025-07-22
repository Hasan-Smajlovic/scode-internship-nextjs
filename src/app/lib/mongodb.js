import { MongoClient } from 'mongodb'

class MongoDB {
  constructor () {
    this.uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
    this.client = null
    this.db = null
    this.isConnected = false
    this.dbName = process.env.MONGODB_DB_NAME || 'test-db'

    console.log('MongoDB class initialized')
    console.log('Using database:', this.dbName)
  }

  async connect () {
    if (this.isConnected) {
      console.log('Using existing MongoDB connection')
      return { client: this.client, db: this.db }
    }

    try {
      console.log('Creating new MongoDB connection...')

      const client = new MongoClient(this.uri)

      console.log('Connecting to MongoDB...')
      await client.connect()
      console.log('Connected to MongoDB server')

      const db = client.db(this.dbName)
      console.log(`Using database: ${this.dbName}`)

      this.client = client
      this.db = db
      this.isConnected = true

      console.log('MongoDB connection established successfully')

      return { client, db }
    } catch (error) {
      console.error('MongoDB connection error:', error)
      throw new Error(`Failed to connect to database: ${error.message}`)
    }
  }

  async getDb () {
    console.log('Getting database instance')
    try {
      const { db } = await this.connect()
      return db
    } catch (error) {
      console.error('Error getting DB instance:', error)
      throw error
    }
  }
}

// Create a singleton instance
const mongodb = new MongoDB()
console.log('MongoDB singleton instance created')

export default mongodb
