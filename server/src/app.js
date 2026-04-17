const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

// Route imports
const authRoutes = require('./routes/authRoutes')
const tileRoutes = require('./routes/tileRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const layoutRoutes = require('./routes/layoutRoutes')
const articleRoutes = require('./routes/articleRoutes')
const adRoutes = require('./routes/adRoutes')

const app = express()

// Security headers
app.use(helmet())

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/tiles', tileRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/layouts', layoutRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/ads', adRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  })
})

module.exports = app
