const express = require('express')
const { body } = require('express-validator')
const { register, login, getMe, updateProfile } = require('../controllers/authController')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], register)

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], login)

router.get('/me', auth, getMe)
router.put('/profile', auth, updateProfile)

module.exports = router
