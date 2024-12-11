import { createApp } from './src/app.js'
import { AuthModel } from './src/models/index.js'

try {
  createApp({ model: [AuthModel] })
} catch (e) {
  console.error('🚨 err', e)
}
