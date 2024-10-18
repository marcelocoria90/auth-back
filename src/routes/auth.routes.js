import { Router } from 'express'
import { AuthController } from '../controllers/index.js'

export default ({ model }) => {
  const authRouter = Router()

  const authController = new AuthController({ model })

  authRouter.post('/register', authController.register)
  authRouter.get('/login', authController.login)

  return authRouter
}
