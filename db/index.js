/* eslint-disable no-async-promise-executor */
import oracledb from 'oracledb'
import configDB from '../db/config.js'

let cnxPool

export const initDb = async () => {
  try {
    const connectionPool = await oracledb.createPool(configDB)
    cnxPool = connectionPool
    console.log(`⚡ Connection ${configDB.connectString} ⚡`)
  } catch (e) {
    console.error(e)
  }
}

export const getConnection = async () => {
  try {
    const cnx = await cnxPool.getConnection()
    return cnx
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const executeQuery = async (sql, binds = [], options = {}) => {
  return new Promise(async (resolve, reject) => {
    let connection
    try {
      connection = await getConnection()
      const result = await connection.execute(sql, binds, options)
      resolve(result)
    } catch (error) {
      reject(error)
    } finally {
      if (connection) {
        try {
          await connection.close()
        } catch (error) {
          console.error('Error closing Oracle connection:', error)
        }
      }
    }
  })
}

initDb()
