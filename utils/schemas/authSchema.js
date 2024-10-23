import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string({ message: 'Username is required' }),
  password: z.string({ message: 'Password is required' })
})

export const registerSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  username: z
    .string({ messge: 'Username is required' })
    .min(3, { message: 'Username must be at least 3 characters long' }),
  password: z
    .string({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string({ message: 'Confirm password is required' })
})

// export const validateLoginSchema = (input) => {
//   return loginSchema.safeParse(input)
// }

// export const validateRegisterSchema = (input) => {
//   return registerSchema.safeParse(input)
// }
