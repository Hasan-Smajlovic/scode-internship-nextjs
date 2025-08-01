import { z } from 'zod'

export const AuthorSchema = z.object({
  name  : z.string().min(1, 'Author name is required'),
  image : z.union([
    z.string().min(1, 'Author image is required'),
    z.object({
      file          : z.any(),
      formattedName : z.string().min(1, 'Author image is required')
    })
  ])
})

export const BookSchema = z.object({
  title         : z.string().min(1, 'Title is required'),
  subtitle      : z.string().min(1, 'Subtitle is required'),
  authors       : z.array(AuthorSchema).min(1, 'At least one author is required'),
  publisher     : z.string().min(1, 'Publisher is required'),
  publishedDate : z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Published date must be in YYYY-MM-DD format')
    .refine(val => {
      const date = new Date(val)
      const now = new Date()
      return !isNaN(date) && date <= now
    }, { message: 'Published date cannot be in the future' }),
  pageCount: z.union([
    z.string().min(1, 'Page count is required'),
    z.number().positive('Page count must be a positive number')
  ]),
  genre : z.array(z.string()).min(1, 'At least one genre is required'),
  cover : z.union([
    z.string().min(1, 'Cover image is required'),
    z.object({
      file          : z.any(),
      formattedName : z.string().min(1, 'Cover image is required')
    }),
    z.null()
  ]),
  shortDescription : z.string().min(1, 'Short description is required'),
  format           : z.string().min(1, 'Format is required'),
  newRelease       : z.boolean(),
  keywords         : z.union([
    z.string().min(1, 'Keywords are required'),
    z.array(z.string().min(1, 'Keywords are required'))
  ])
})
