// import generateToken from '../utils/generateToken.js'
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

  register = async (req, res, next) => {
    const credentials = req.body
    try {
      const payload = registerSchema.parse(credentials)

      const { error } = await this.authModel.register(payload)

      if (error) return res.status(401).json({ ok: false, code: 401, error })

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

      res.cookie('access_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 // 1 hour
      })
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
