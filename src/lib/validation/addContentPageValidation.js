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

  // Format validation (required field)
  if (!fields.format || !Array.isArray(fields.format) || fields.format.length === 0) {
    errors.format = 'At least one format is required'
  }

  // Genre validation (optional, add this if you want to require genres)
  if (fields.genre && (!Array.isArray(fields.genre) || fields.genre.length === 0)) {
    errors.genre = 'Please select at least one genre'
  }

  // Year validation (optional, add this if you want to require years)
  if (fields.year && (!Array.isArray(fields.year) || fields.year.length === 0)) {
    errors.year = 'Please select at least one year'
  }

  // Keywords validation (optional, add this if you want to require keywords)
  if (fields.keywords && (!Array.isArray(fields.keywords) || fields.keywords.length === 0)) {
    errors.keywords = 'Please select at least one keyword'
  }

  // Year range validation - make sure this triggers properly
  if (fields.yearFrom && fields.yearTo && Number(fields.yearFrom) > Number(fields.yearTo)) {
    errors.yearRange = 'Starting year cannot be greater than ending year'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
