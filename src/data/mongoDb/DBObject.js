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
    if (filters.publishedYear && filters.publishedYear) {
      query.publishedDate = { $regex: `^${filters.publishedYear}` } // here all years will be handled
    }
    if (filters.format) {
      query.format = filters.format // filtering for format
    }
    if (filters.genre) {
      query.genre = filters.genre // filtering for genre
    }
    if (filters.newRelease) {
      query.newRelease = filters.newRelease // filtering for new releases
    }
    if (filters.keywords) {
      query.keywords = filters.keywords // filtering for keywords
    }

    if (filters.yearTo || filters.yearFrom) { // i removed 0,4 so that my full date works instead of just year
      const dateQuery = {}

      if (filters.yearFrom && filters.yearFrom.trim() !== '') {
        dateQuery.$gte = filters.yearFrom
      }
      if (filters.yearTo && filters.yearTo.trim() !== '') {
        dateQuery.$lte = filters.yearTo
      }
      if (Object.keys(dateQuery).length > 0) {
        query.publishedDate = dateQuery
      }
    }
    const [sortField, sortOrder] = sort.split(' ')
    const sortQuery = { [sortField]: sortOrder.toLowerCase() === 'asc' ? 1 : -1 }
    const skip = (page - 1) * pageSize

    let formatsQuery = query
    let genresQuery = query
    let keywordsQuery = query
    let yearsQuery = query

    if (query.format) {
      const { format, ...rest } = query
      formatsQuery = rest
    }
    if (query.genre) {
      const { genre, ...rest } = query
      genresQuery = rest
    }
    if (query.keywords) {
      const { keywords, ...rest } = query
      keywordsQuery = rest
    }
    if (query.publishedDate) {
      const { publishedDate, ...rest } = query
      yearsQuery = rest
    }

    const aggregation = [
      {
        $facet: {
          items: [
            { $match: query },
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: pageSize }
          ],
          totalCount: [
            { $match: query },
            { $count: 'count' }
          ],
          formats: [
            { $match: formatsQuery },
            { $unwind: '$format' },
            { $group: { _id: '$format', count: { $sum: 1 } } },
            { $project: { value: '$_id', count: 1, _id: 0 } }
          ],
          genres: [
            { $match: genresQuery },
            { $unwind: '$genre' },
            { $group: { _id: '$genre', count: { $sum: 1 } } },
            { $project: { value: '$_id', count: 1, _id: 0 } }
          ],
          keywords: [
            { $match: keywordsQuery },
            { $unwind: '$keywords' },
            { $group: { _id: '$keywords', count: { $sum: 1 } } },
            { $project: { value: '$_id', count: 1, _id: 0 } }
          ],
          years: [
            { $match: yearsQuery },
            {
              $project: {
                year: { $substr: ['$publishedDate', 0, 4] } // this is for published year since it is only a year
              }
            },
            { $group: { _id: '$year', count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } },
            { $project: { value: '$_id', count: 1, _id: 0 } }
          ]
        }
      }
    ]

    // Add sorting to your facets
    aggregation[0].$facet.formats.push({ $sort: { count: -1 } })
    aggregation[0].$facet.genres.push({ $sort: { count: -1 } })
    aggregation[0].$facet.keywords.push({ $sort: { count: -1 } })
    aggregation[0].$facet.years.push({ $sort: { _id: -1 } })

    const [result] = await this.collection.aggregate(aggregation).toArray()
    return {
      searchRequest : searchObject,
      items         : result.items.map(({ _id, ...rest }) => ({ ...rest, id: _id.toString() })),
      totalCount    : result.totalCount[0]?.count || 0,
      facets        : {
        formats  : result.formats,
        genres   : result.genres,
        keywords : result.keywords,
        years    : result.years
      },
      aggregation
    }
  }

  async searchOnlyWithFacets ({ filters = {}, sort = 'title ASC' }) {
    const query = {}

    // Validate sort
    const [sortField, sortOrder] = sort.split(' ')
    const sortQuery = { [sortField]: sortOrder.toLowerCase() === 'asc' ? 1 : -1 }

    const normalize = (val) => !val ? [] : Array.isArray(val) ? val : [val]

    if (filters.format) query.format = { $in: normalize(filters.format) }
    if (filters.genre) query.genre = { $in: normalize(filters.genre) }
    if (filters.keywords) query.keywords = { $in: normalize(filters.keywords) }
    if (filters.newRelease !== undefined) query.newRelease = filters.newRelease
    if (filters.yearFrom || filters.yearTo) {
      query.publishedDate = {}
      if (filters.yearFrom) query.publishedDate.$gte = filters.yearFrom
      if (filters.yearTo) query.publishedDate.$lte = filters.yearTo
    }

    const aggregation = [
      { $match: query },
      { $sort: sortQuery },
      {
        $facet: {
          formats: [
            { $unwind: { path: '$format', preserveNullAndEmptyArrays: true } },
            { $group: { _id: '$format', count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } },
            { $project: { value: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } }
          ],
          genres: [
            { $unwind: { path: '$genre', preserveNullAndEmptyArrays: true } },
            { $group: { _id: '$genre', count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } },
            { $project: { value: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } }
          ],
          keywords: [
            { $unwind: '$keywords' },
            { $group: { _id: '$keywords', count: { $sum: 1 } } },
            { $project: { value: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } }
          ],
          years: [
            { $project: { year: { $substr: [{ $toString: '$publishedDate' }, 0, 4] } } },
            { $group: { _id: '$year', count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } },
            { $project: { value: '$_id', count: 1, _id: 0 } },
            { $sort: { value: -1 } }
          ]
        }
      }
    ]

    const [result] = await this.collection.aggregate(aggregation).toArray()

    return {
      searchRequest: {
        filters,
        sort
      },
      facets: {
        format   : result.formats,
        genre    : result.genres,
        keywords : result.keywords,
        year     : result.years
      }
    }
  }

  async getById (id) {
    try {
      const objectId = new ObjectId(id)
      return await this.collection.findOne({ _id: objectId })
    } catch (error) {
      console.error('Error fetching document by ID:', error)
      return null
    }
  }
}
export default DBObject
