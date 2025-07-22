import mongodb from './mongodb'
import { ObjectId } from 'mongodb'

class DBObject {
  constructor (collectionName) {
    this.collectionName = collectionName
  }

  async getCollection () {
    const db = await mongodb.getDb()
    return db.collection(this.collectionName)
  }

  async getOne (query = {}) {
    const collection = await this.getCollection()

    if (typeof query === 'string') {
      return await collection.findOne({ _id: new ObjectId(query) })
    }

    return await collection.findOne(query)
  }

  async getMany (query = {}) {
    const collection = await this.getCollection()
    return await collection.find(query).toArray()
  }

  async insertOne (document) {
    const collection = await this.getCollection()

    const docToInsert = {
      ...document,
      createdAt: new Date()
    }

    const result = await collection.insertOne(docToInsert)

    return {
      insertedId : result.insertedId,
      data       : { ...docToInsert, _id: result.insertedId }
    }
  }

  async insertMany (documents) {
    const collection = await this.getCollection()

    const docsToInsert = documents.map(doc => ({
      ...doc,
      createdAt: new Date()
    }))

    const result = await collection.insertMany(docsToInsert)

    return {
      insertedCount : result.insertedCount,
      insertedIds   : result.insertedIds
    }
  }
}

export default DBObject
