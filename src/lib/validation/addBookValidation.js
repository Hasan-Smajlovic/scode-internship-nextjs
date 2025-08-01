export default function addBookValidation (fields) {
  const newErrors = {}

  if (!fields.title?.trim()) newErrors.title = 'Title is required'
  if (!fields.subtitle?.trim()) newErrors.subtitle = 'Subtitle is required'

  if (
    !Array.isArray(fields.authors) ||
    fields.authors.length === 0 ||
    fields.authors.some(author => !author.name || !author.image)
  ) {
    newErrors.authors = 'Each author must have a name and an image'
  }

  if (!fields.publisher?.trim()) newErrors.publisher = 'Publisher is required'
  if (!fields.pageCount || (typeof fields.pageCount === 'string' && (!fields.pageCount.trim() || isNaN(fields.pageCount)))) {
    newErrors.pageCount = 'Page count must be a number'
  }
  if (!fields.publishedDate?.trim()) newErrors.publishedDate = 'Published date is required'
  if (!fields.keywords || (typeof fields.keywords === 'string' && !fields.keywords.trim()) || (Array.isArray(fields.keywords) && fields.keywords.length === 0)) {
    newErrors.keywords = 'Keywords are required'
  }
  if (typeof fields.format !== 'string' || !fields.format.trim()) {
    newErrors.format = 'Format is required'
  }
  if (fields.publishedDate && isNaN(Date.parse(fields.publishedDate))) {
    newErrors.publishedDate = 'Published date must be a valid date'
  }
  if (!Array.isArray(fields.genre) || fields.genre.length === 0) {
    newErrors.genre = 'At least one genre is required'
  }
  if (
    !fields.cover ||
    (typeof fields.cover === 'string' && !fields.cover.trim()) ||
    (typeof fields.cover === 'object' && (!fields.cover.file && !fields.cover.formattedName))
  ) {
    newErrors.cover = 'Cover image is required'
  }
  if (!fields.shortDescription?.trim()) newErrors.shortDescription = 'Short description is required'

  return newErrors
}
