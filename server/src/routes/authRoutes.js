const express = require('express')
const { body } = require('express-validator')
const { register, login, getMe, updateProfile, forgotPassword, resetPassword } = require('../controllers/authController')
const { googleAuth } = require('../controllers/oauthController')
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

router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
], forgotPassword)

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], resetPassword)

router.post('/google', googleAuth)

router.get('/me', auth, getMe)
router.put('/profile', auth, updateProfile)

module.exports = router
