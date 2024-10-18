import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z.string({ message: 'Password is required' })
})

export const registerSchema = z.object({
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z.string({ message: 'Password is required' }),
  confirmPassword: z.string({ message: 'Confirm password is required' })
})

// export const validateLoginSchema = (input) => {
//   return loginSchema.safeParse(input)
// }

// export const validateRegisterSchema = (input) => {
//   return registerSchema.safeParse(input)
// }
