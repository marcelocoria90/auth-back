import OracleDB from 'oracledb'
import { v4 as uuidv4 } from 'uuid'
import { executeQuery } from '../../db/index.js'

export const authQueries = {
  checkUser: async (credentials) => {
    const { email, username } = credentials
    try {
      const query = `SELECT 1 FROM ${process.env.TABLA_USERS} WHERE us_mail = :email or us_username = :username`
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
    const { email, username, password, role = 3, status = 3 } = credentials
    const idUser = uuidv4()
    try {
      const query = `INSERT INTO ${process.env.TABLA_USERS} (us_mail, us_username, us_password, us_idrole, us_idstatus, us_iduser) VALUES (:email, :username, :password, :role, :status, :idUser)`
      const binds = {
        email,
        username,
        password,
        role,
        status,
        idUser
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
    console.log('🧪username', username)
    try {
      const columns = 'us_iduser AS id, us_username AS username, us_password AS password, us_mail AS email, ro_description AS role, st_description AS estado'
      const query = `SELECT ${columns} FROM ${process.env.TABLA_USERS}
                    join ${process.env.TABLA_ROLES}
                        on ro_id = us_idrole
                    join ${process.env.TABLA_STATUS}
                        on st_id = us_idstatus
                    WHERE us_username = :username`
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
