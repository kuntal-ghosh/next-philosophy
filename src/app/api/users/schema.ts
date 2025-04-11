import {z} from 'zod';

export const UserSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3).max(50),
  email: z.string().email(),
  posts: z.array(z.any()).optional(),
  followers: z.number().default(0),
  following: z.number().default(0),
  
  createdAt: z.date().optional().default(() => new Date()),
  updatedAt: z.date().optional(),
  isActive: z.boolean().default(true),
});