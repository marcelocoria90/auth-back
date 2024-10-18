// import generateToken from '../utils/generateToken.js'
import { loginSchema, registerSchema } from '../utils/schemas/authSchema.js'
import { ZodError } from 'zod'
import { formatError } from '../utils/formatError.js'
import logger from '../utils/logger.js'

export class AuthController {
  constructor ({ model }) {
    this.authModel = model
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
    console.log('🧪 credentials', credentials)
    try {
      const payload = loginSchema.parse(credentials)
      const { error, data } = await this.authModel.login(payload)

      if (error) return res.status(401).json({ ok: false, code: 401, error })

      return res.status(200).json({ ok: true, data })
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
}
