const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  const token = header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization

  if (header && header.startsWith('Bearer ')) {
    try {
      const token = header.split(' ')[1]
      req.user = jwt.verify(token, process.env.JWT_SECRET)
    } catch {
      // Token invalid — continue as guest
    }
  }

  next()
}

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' })
  }
  next()
}

module.exports = { auth, optionalAuth, adminOnly }
