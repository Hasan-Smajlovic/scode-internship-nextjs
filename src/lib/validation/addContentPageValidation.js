export default function addContentPageValidation (fields) {
  const errors = {}

  // Required fields
  if (!fields.title || fields.title.trim() === '') {
    errors.title = 'Title is required'
  } else if (fields.title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters'
  }

  if (!fields.description || fields.description.trim() === '') {
    errors.description = 'Description is required'
  }

  if (!fields.format || !Array.isArray(fields.format) || fields.format.length === 0) {
    errors.format = 'At least one format is required'
  }

  if (fields.genre && (!Array.isArray(fields.genre) || fields.genre.length === 0)) {
    errors.genre = 'Please select at least one genre'
  }

  if (fields.year && (!Array.isArray(fields.year) || fields.year.length === 0)) {
    errors.year = 'Please select at least one year'
  }

  if (fields.keywords && (!Array.isArray(fields.keywords) || fields.keywords.length === 0)) {
    errors.keywords = 'Please select at least one keyword'
  }

  if (fields.yearFrom && fields.yearTo && Number(fields.yearFrom) > Number(fields.yearTo)) {
    errors.yearRange = 'Starting year cannot be greater than ending year'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
