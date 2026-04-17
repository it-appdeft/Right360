const { createClient } = require('redis')

let redisClient = null
let redisErrorLogged = false

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            if (!redisErrorLogged) {
              console.warn('⚠️  Redis unavailable — running without cache')
              redisErrorLogged = true
            }
            redisClient = null
            return false // stop retrying
          }
          return 1000 // retry after 1s
        },
      },
    })

    redisClient.on('error', () => {
      // suppress repeated logs
    })

    redisClient.on('connect', () => {
      console.log('✅ Redis connected')
      redisErrorLogged = false
    })

    await redisClient.connect()
  } catch (error) {
    console.warn('⚠️  Redis not available, running without cache')
    redisClient = null
  }
}

const getRedisClient = () => redisClient

module.exports = { connectRedis, getRedisClient }
