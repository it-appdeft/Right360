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
