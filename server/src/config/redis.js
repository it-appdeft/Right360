const { createClient } = require('redis')

let redisClient = null

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
    })

    redisClient.on('error', (err) => {
      console.warn('Redis error:', err.message)
    })

    redisClient.on('connect', () => {
      console.log('✅ Redis connected')
    })

    await redisClient.connect()
  } catch (error) {
    console.warn('Redis not available, running without cache:', error.message)
    redisClient = null
  }
}

const getRedisClient = () => redisClient

module.exports = { connectRedis, getRedisClient }
