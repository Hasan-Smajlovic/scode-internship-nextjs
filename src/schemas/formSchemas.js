import { z } from 'zod'

// Categories form schema
export const categoriesSchema = z.object({
  categories: z.array(z.string())
    .min(1, 'Please select at least one category')
    .max(5, 'You can select up to 5 categories')
})

// You can add more schemas here
export const userFormSchema = z.object({
  name  : z.string().min(2, 'Name must be at least 2 characters'),
  email : z.string().email('Please enter a valid email address')
})
