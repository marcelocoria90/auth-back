import express, { json } from 'express'
import 'dotenv/config'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

// TODO
// import errorHandler from './middlewares/errorHandler'

import { authRoutes } from './routes/index.js'

const PORT = process.env.PORT || 3000

export const createApp = ({ model }) => {
  const app = express()
  app.use(cors())
  app.use(helmet())
  app.use(json())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.static('public'))
  app.use(morgan('dev'))

  app.use('/api/v1/auth', authRoutes({ model: model[0] }))

  app.listen(PORT, () => {
    console.log(`⚡ Server is running on port ${PORT} ⚡`)
  })
}
