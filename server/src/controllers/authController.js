const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const User = require('../models/User')

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() })
    }

    const { username, email, password } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username'
      return res.status(400).json({ error: `${field} already exists.` })
    }

    const user = await User.create({
      username,
      email,
      passwordHash: password,
    })

    const token = generateToken(user)

    res.status(201).json({ user, token })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() })
    }

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const token = generateToken(user)

    res.json({ user, token })
  } catch (error) {
    next(error)
  }
}

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }
    res.json({ user })
  } catch (error) {
    next(error)
  }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: 'If that email exists, a reset link has been sent.' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000 // 1 hour
    await user.save({ validateBeforeSave: false })

    // In production, send email with reset link
    // For now, return token directly (dev mode)
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`

    res.json({
      message: 'If that email exists, a reset link has been sent.',
      // Dev only — remove in production
      ...(process.env.NODE_ENV !== 'production' && { resetUrl, resetToken }),
    })
  } catch (error) {
    next(error)
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() })
    }

    const { token, password } = req.body
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' })
    }

    user.passwordHash = password
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save()

    const jwtToken = generateToken(user)
    res.json({ user, token: jwtToken, message: 'Password reset successful.' })
  } catch (error) {
    next(error)
  }
}

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, avatar, preferences } = req.body
    const updates = {}

    if (username) updates.username = username
    if (avatar !== undefined) updates.avatar = avatar
    if (preferences) updates.preferences = preferences

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    res.json({ user })
  } catch (error) {
    next(error)
  }
}
