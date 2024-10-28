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

/**
 *
 * import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string({ message: 'Name is required' })
      .min(3, { message: 'Name must be 3 characters long' }),
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Please enter correct email' }),
    password: z
      .string({ message: 'Password is required' })
      .min(6, { message: 'Password must be 3 characters long' }),
    confirm_password: z.string({ message: 'Confirm Password is required' })
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Confirm password not matched',
    path: ['confirm_password']
  })

export const loginSchema = z
  .object({
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Please enter correct email' }),
    password: z
      .string({ message: 'Password is required' })
  })

export const resetPasswordSchema = z
  .object({
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Please enter correct email' }),
    token: z
      .string({ message: 'Token is required' }),
    password: z
      .string({ message: 'Password is required' })
      .min(6, { message: 'Password must be 3 characters long' }),
    confirm_password: z.string({ message: 'Confirm Password is required' })
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Confirm password not matched',
    path: ['confirm_password']
  })

 */
