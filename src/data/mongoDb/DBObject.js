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
    let {
      searchTerm = '',
      filters = {},
      page = 1,
      pageSize = 9,
      sort = 'title ASC'
    } = searchObject

    page = Number(page) || 1
    pageSize = Number(pageSize) || 9

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
    if (filters.publishedYear) query.publishedDate = { $regex: `^${filters.publishedYear}` } // validation for published year
    if (filters.publishedYear && filters.publishedYear !== 'all') {
      query.publishedDate = { $regex: `^${filters.publishedYear}` } // here all years will be handled
    }
    if (filters.format) query.format = filters.format // filtering for format
    if (filters.genre) query.genre = filters.genre // filtering for genre
    if (filters.newRelease) query.newRelease = filters.newRelease // filtering for new releases
    if (filters.keywords) {
      if (Array.isArray(filters.keywords)) {
        query.keywords = { $all: filters.keywords }
      } else if (typeof filters.keywords === 'string') {
        const keywordsList = filters.keywords.split(',').map(k => k.trim()).filter(Boolean)
        if (keywordsList.length > 0) {
          query.keywords = { $all: keywordsList }
        }
      }
    }

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
          ],
          keywords: [
            { $unwind: '$keywords' },
            { $group: { _id: '$keywords', count: { $sum: 1 } } },
            { $project: { value: '$_id', count: 1, _id: 0 } }
          ]
        }
      }
    ]

    const [result] = await this.collection.aggregate(aggregation).toArray()
    return {
      searchRequest : searchObject,
      items         : result.items.map(({ _id, ...rest }) => ({ ...rest, id: _id.toString() })),
      totalCount    : result.totalCount[0]?.count || 0,
      facets        : {
        formats  : result.formats,
        genres   : result.genres,
        authors  : result.authors,
        keywords : result.keywords
      }
    }
  }
}

export default DBObject
