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

  async searchWithFacets (searchObject = {}) {
    const {
      searchTerm = '',
      filters = {},
      page = 1,
      pageSize = 9,
      sort = 'title ASC'
    } = searchObject

    const query = {}
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { subtitle: { $regex: searchTerm, $options: 'i' } },
        { authors: { $elemMatch: { name: { $regex: searchTerm, $options: 'i' } } } },
        { genre: { $elemMatch: { $regex: searchTerm, $options: 'i' } } },
        { keywords: { $elemMatch: { $regex: searchTerm, $options: 'i' } } },
        { publisher: { $regex: searchTerm, $options: 'i' } },
        { shortDescription: { $regex: searchTerm, $options: 'i' } }
      ]
    }
    if (filters.format) query.format = filters.format
    if (filters.genre) query.genre = filters.genre

    const [sortField, sortOrder] = sort.split(' ')
    const sortQuery = { [sortField]: sortOrder.toLowerCase() === 'asc' ? 1 : -1 }
    const skip = (page - 1) * pageSize

    const aggregation = [
      { $match: query },
      {
        $facet: {
          items: [
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: pageSize }
          ],
          totalCount: [
            { $count: 'count' }
          ],
          formats: [
            { $unwind: '$format' },
            { $group: { _id: '$format', count: { $sum: 1 } } },
            { $project: { value: '$_id', count: 1, _id: 0 } }
          ],
          genres: [
            { $unwind: '$genre' },
            { $group: { _id: '$genre', count: { $sum: 1 } } },
            { $project: { value: '$_id', count: 1, _id: 0 } }
          ],
          authors: [
            { $unwind: '$authors' },
            { $group: { _id: '$authors.name', count: { $sum: 1 } } },
            { $project: { value: '$_id', count: 1, _id: 0 } }
          ]
        }
      }
    ]

    const [result] = await this.collection.aggregate(aggregation).toArray()
    return {
      searchRequest : searchObject,
      items         : result.items,
      totalCount    : result.totalCount[0]?.count || 0,
      facets        : {
        formats : result.formats,
        genres  : result.genres,
        authors : result.authors
      }
    }
  }
}

export default DBObject
