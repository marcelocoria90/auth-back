import { loginSchema, registerSchema } from '../../utils/schemas/authSchema.js'
import { ZodError } from 'zod'
import { formatError } from '../../utils/helpers/formatError.js'
import logger from '../../utils/helpers/logger.js'

export class AuthController {
  constructor ({ model }) {
    this.authModel = model
  }

  health = async (req, res, next) => {
    try {
      return res.status(200).json({ ok: true, message: 'Auth API is healthy' })
    } catch (e) {
      console.log('🚨 errorController', e)
      logger.error(`Error: ${e}`)
      res.status(500).json({ error: 'Internal Server Error' })
      next(e)
    }
  }

  session = async ( req, res, next) => {
    try{
      const { session } = req

      if (session) return res.status(200).json(session)

      next()

    }catch(e){
      console.log('⛔e',e)
      next(e)
    }
  }

  register = async (req, res, next) => {
    const credentials = req.body
    console.log('🧪credentials', credentials)
    try {
      const payload = registerSchema.parse(credentials)

      const { error } = await this.authModel.register(payload)

      if (error) return res.status(401).json({ ok: false, code: 401, message: error })

      return res.status(200).json({ ok: true, message: 'User created' })
    } catch (e) {
      console.log('🚨 errorController', e)
      if (e instanceof ZodError) {
        const errors = formatError(e)
        res.status(422).json({ errors })
      } else {
        logger.error(`Error: ${e}`)
        res.status(500).json({ error: 'Internal Server Error' })
      }
      next(e)
    }
  }

  login = async (req, res, next) => {
    const credentials = req.body
    try {
      const payload = loginSchema.parse(credentials)
      const { error, data } = await this.authModel.login(payload) 
      
      if (error) return res.status(401).json({ ok: false, code: 401, error })

      const expires = new Date(Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 1000)
        
      res.cookie('access_token', data.accesToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        expires
      })

      console.log('🗽 data: ', data)

      return res.status(200).json({ data })
    } catch (e) {
      console.log('🚨 errorController', e)
      if (e instanceof ZodError) {
        const errors = formatError(e)
        res.status(422).json({ errors })
      } else {
        logger.error(`Error: ${e}`)
        res.status(500).json({ error: 'Internal Server Error' })
      }
      next(e)
    }
  }

  logout = async (req, res, next) => {
    try {
      res.clearCookie('access_token')
      return res.status(200).json({ ok: true, message: 'User logged out' })
    } catch (e) {
      console.log('🚨 errorController', e)
      logger.error(`Error: ${e}`)
      res.status(500).json({ error: 'Internal Server Error' })
      next(e)
    }
  }
}
