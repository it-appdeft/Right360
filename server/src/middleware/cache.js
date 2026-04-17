const { getRedisClient } = require('../config/redis')

const cache = (ttlSeconds = 300) => {
  return async (req, res, next) => {
    const client = getRedisClient()
    if (!client) return next()

    const key = `cache:${req.originalUrl}`

    try {
      const cached = await client.get(key)
      if (cached) {
        return res.json(JSON.parse(cached))
      }

      // Override res.json to cache the response
      const originalJson = res.json.bind(res)
      res.json = (body) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          client.setEx(key, ttlSeconds, JSON.stringify(body)).catch(() => {})
        }
        return originalJson(body)
      }

      next()
    } catch {
      next()
    }
  }
}

const invalidateCache = (pattern) => {
  return async (req, res, next) => {
    const client = getRedisClient()
    if (client) {
      try {
        const keys = await client.keys(`cache:${pattern}`)
        if (keys.length > 0) {
          await client.del(keys)
        }
      } catch {
        // silent
      }
    }
    next()
  }
}

module.exports = { cache, invalidateCache }
