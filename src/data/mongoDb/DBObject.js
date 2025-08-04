import { ObjectId } from 'mongodb'

import MongoDB from './MongoDB'

class DBObject {
  constructor (collectionName) {
    this.collectionName = collectionName
  }

  async init () {
    const mongoDbConnection = new MongoDB()
    const connection = await mongoDbConnection.connect()
    this.collection = connection.collection(this.collectionName)
  }

  async getOne (query = {}) {
    if (typeof query === 'string') {
      return await this.collection.findOne({ _id: new ObjectId(query) })
    }
    return await this.collection.findOne(query)
  }

  async getMany (query = {}) {
    return await this.collection.find(query).toArray()
  }

  async insertOne (document) {
    const docToInsert = {
      ...document,
      createdAt: new Date()
    }

    const result = await this.collection.insertOne(docToInsert)

    return {
      insertedId : result.insertedId,
      data       : { ...docToInsert, _id: result.insertedId }
    }
  }

  async insertMany (documents) {
    const docsToInsert = documents.map(doc => ({
      ...doc,
      createdAt: new Date()
    }))

    const result = await this.collection.insertMany(docsToInsert)

    return {
      insertedCount : result.insertedCount,
      insertedIds   : result.insertedIds
    }
  }

  async search (search = '', options = {}) {
    let query = {}
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { subtitle: { $regex: search, $options: 'i' } },
          { authors: { $elemMatch: { name: { $regex: search, $options: 'i' } } } },
          { genre: { $elemMatch: { $regex: search, $options: 'i' } } },
          { keywords: { $elemMatch: { $regex: search, $options: 'i' } } },
          { publisher: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } }
        ]
      }
    }
    return await this.collection.find(query, options).toArray()
  }
}

export default DBObject
