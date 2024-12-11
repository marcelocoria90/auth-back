import express, { json } from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'

// TODO
// import errorHandler from './middlewares/errorHandler'

import { authRoutes } from './routes/index.js'

const PORT = process.env.PORT || 3000

export const createApp = ({ model }) => {
  const app = express()
  
  const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }

  app.use(cors(corsOptions))

  app.disable('x-powered-by')
  app.use(helmet())                 
  app.use(json())
  app.use(cookieParser())
  app.use(express.urlencoded({ extended: false }))
  app.use(morgan('dev'))

  app.use((_req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.use('/api/v1/auth', authRoutes({ model: model[0] }))

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT} 🚀`)
  })
}
