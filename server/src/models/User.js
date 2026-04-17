const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
  },
  avatar: {
    type: String,
    default: '',
  },
  preferences: {
    defaultCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    theme: { type: String, default: 'light' },
    searchEngine: { type: String, default: 'google' },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  googleId: {
    type: String,
    default: null,
  },
  resetToken: String,
  resetTokenExpiry: Date,
}, {
  timestamps: true,
})

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
  next()
})

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

// Remove sensitive fields from JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.passwordHash
  delete obj.resetToken
  delete obj.resetTokenExpiry
  return obj
}

module.exports = mongoose.model('User', userSchema)
