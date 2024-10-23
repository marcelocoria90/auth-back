import OracleDB from 'oracledb'
import { executeQuery } from '../../db/index.js'

export const authQueries = {
  checkUser: async (credentials) => {
    const { email, username } = credentials
    try {
      const query = `SELECT 1 FROM ${process.env.TABLA_USERS} WHERE us_email = :email or us_username = :username`
      const binds = {
        email,
        username
      }
      const options = { outFormat: OracleDB.OUT_FORMAT_OBJECT }
      const result = await executeQuery(query, binds, options)

      return result
    } catch (e) {
      console.error('🚨 errorAuthQuerie', e)
    }
  },
  insertUser: async (credentials) => {
    const { email, username, password } = credentials
    try {
      const query = `INSERT INTO ${process.env.TABLA_USERS} (us_email, us_username, us_password) VALUES (:email, :username, :password)`
      const binds = {
        email,
        username,
        password
      }
      const options = { autoCommit: true }
      const result = await executeQuery(query, binds, options)

      return result
    } catch (e) {
      console.error('🚨 errorInsertUser', e)
    }
  },
  getUser: async (credentials) => {
    const { username } = credentials
    try {
      const columns = 'us_username AS username, us_idrole AS role, us_email AS email, us_password AS password'
      const query = `SELECT ${columns} FROM ${process.env.TABLA_USERS} WHERE us_username = :username`
      const binds = {
        username
      }

      const options = { outFormat: OracleDB.OUT_FORMAT_OBJECT }

      const result = await executeQuery(query, binds, options)

      return result
    } catch (e) {
      console.error('🚨 errorAuthQuerie', e)
    }
  }
}
