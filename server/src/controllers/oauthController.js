const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

/**
 * Google OAuth — receives the ID token from the client-side
 * Google Sign-In, verifies it, and creates/logs in the user.
 */
exports.googleAuth = async (req, res, next) => {
  try {
    const { email, name, googleId, avatar } = req.body

    if (!email || !googleId) {
      return res.status(400).json({ error: 'Email and Google ID are required.' })
    }

    // Check if user exists
    let user = await User.findOne({ email })

    if (user) {
      // Existing user — login
      if (!user.googleId) {
        // Link Google account to existing email
        user.googleId = googleId
        if (avatar && !user.avatar) user.avatar = avatar
        await user.save({ validateBeforeSave: false })
      }
    } else {
      // New user — register
      const username = name?.replace(/\s+/g, '').toLowerCase().slice(0, 20) +
        Math.floor(Math.random() * 1000)

      user = await User.create({
        username,
        email,
        passwordHash: googleId + Date.now(), // placeholder hash (not used for OAuth)
        avatar: avatar || '',
        googleId,
      })
    }

    const token = generateToken(user)
    res.json({ user, token })
  } catch (error) {
    next(error)
  }
}
