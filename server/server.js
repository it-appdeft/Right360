require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/config/db')
const { connectRedis } = require('./src/config/redis')

const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB()
    await connectRedis()
    app.listen(PORT, () => {
      console.log(`🚀 Right360 API running on port ${PORT}`)
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

start()
