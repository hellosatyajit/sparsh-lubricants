import { z } from 'zod';

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  category: z.string().nullable(),
  description: z.string().nullable(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  deleted_at: z.string().nullable(),
});

export type Product = z.infer<typeof productSchema>;

export const productFormSchema = productSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true, 
  deleted_at: true 
});
