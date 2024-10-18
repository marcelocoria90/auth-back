import OracleDB from 'oracledb'
import { executeQuery } from '../../db/index.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'

export class AuthModel {
  static async register (credentials) {
    console.log('🧪 credentials', credentials)
    const { email, password, confirmPassword } = credentials
    try {
      const queryEmail = `SELECT us_email FROM ${process.env.TABLA_USERS} WHERE us_email = :email`
      const bindsEmail = {
        email
      }
      const optionsEmail = { outFormat: OracleDB.OUT_FORMAT_OBJECT }
      const resultEmail = await executeQuery(queryEmail, bindsEmail, optionsEmail)

      if (resultEmail.rows.length > 0) return { error: 'Email already exists' }

      if (password !== confirmPassword) {
        return { error: 'Passwords do not match' }
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const query = `INSERT INTO ${process.env.TABLA_USERS} (us_email, us_password) VALUES (:email, :password)`
      const binds = {
        email,
        password: hashedPassword
      }

      const options = { autoCommit: true }

      const result = await executeQuery(query, binds, options)
      return result
    } catch (e) {
      console.error('🚨 errorModel', e)
    }
  }

  static async login (credentials) {
    const { username, password } = credentials
    try {
      const columns = 'us_id AS id, us_idrole AS role, us_email AS email, us_password AS password'
      const query = `SELECT ${columns} FROM ${process.env.TABLA_USERS} WHERE us_email = :email`
      const binds = {
        email: username
      }

      const options = { outFormat: OracleDB.OUT_FORMAT_OBJECT }

      const result = await executeQuery(query, binds, options)

      if (result.rows.length === 0) {
        return { error: 'Invalid credentials' }
      }
      const user = result.rows[0]
      const isValidPassword = await bcrypt.compare(String(password), user?.PASSWORD)
      if (!isValidPassword) {
        return { error: 'Invalid credentials' }
      }

      const token = generateToken({ id: user.ID, role: user.ROLE, email: user.EMAIL })

      return { token }
    } catch (e) {
      console.error('🚨 errorModel', e)
    }
  }
}
