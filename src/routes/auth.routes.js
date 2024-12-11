import { Router } from 'express'
import { AuthController } from '../controllers/index.js'
import { auth } from '../../utils/middlewares/authJwt.js'

export default ({ model }) => {
  const authRouter = Router()

  const authController = new AuthController({ model })

  authRouter.get('/health', authController.health)

  authRouter.get('/session', auth, authController.session)

  authRouter.post('/register', authController.register)
  authRouter.post('/login', authController.login)
  authRouter.post('/logout', authController.logout)

  return authRouter
}
