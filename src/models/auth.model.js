import bcrypt from 'bcryptjs'
import generateToken from '../../utils/helpers/generateToken.js'
import { authQueries } from '../../utils/services/auth.service.js'

export class AuthModel {
  static async register (credentials) {
    const { password, confirmPassword } = credentials
    try {
      const resultEmail = await authQueries.checkUser(credentials)

      if (resultEmail.rows.length > 0) return { error: 'Email or user in use' }

      if (password !== confirmPassword) {
        return { error: 'Passwords do not match' }
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      credentials.password = hashedPassword

      const result = await authQueries.insertUser(credentials)
      return result
    } catch (e) {
      console.error('🚨 errorModel', e)
    }
  }

  static async login (credentials) {
    const { password } = credentials
    try {
      const result = await authQueries.getUser(credentials)

      if (result.rows.length === 0) {
        return { error: 'Invalid credentials' }
      }
      const user = result.rows[0]

      const isValidPassword = await bcrypt.compare(String(password), user?.PASSWORD)
      if (!isValidPassword) {
        return { error: 'Invalid credentials' }
      }

      const token = generateToken({ username: user.USERNAME, role: user.ROLE, email: user.EMAIL, status: user.ESTADO })

      const data = { ok: true, token }

      return { data }
    } catch (e) {
      console.error('🚨 errorModel', e)
    }
  }
}
