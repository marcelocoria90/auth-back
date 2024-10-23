import { Router } from 'express'
import { AuthController } from '../controllers/index.js'
import { auth } from '../../utils/middlewares/authJwt.js'

export default ({ model }) => {
  const authRouter = Router()

  const authController = new AuthController({ model })

  authRouter.get('/', auth, authController.health)

  authRouter.post('/register', authController.register)
  authRouter.get('/login', authController.login)
  authRouter.get('/logout', authController.logout)

  return authRouter
}
