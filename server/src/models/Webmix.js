const mongoose = require('mongoose')

const webmixSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Webmix name is required'],
    trim: true,
    default: 'My Webmix',
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
  },
  icon: {
    type: String,
    default: '🏠',
  },
  color: {
    type: String,
    default: '#7B5EA7',
  },
  tiles: [{
    tileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tile' },
    customTitle: String,
    customUrl: String,
    customLogo: String,
    bgColor: String,
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
    size: {
      type: String,
      enum: ['1x1', '2x2', '4x4'],
      default: '1x1',
    },
  }],
  background: {
    type: { type: String, enum: ['color', 'image'], default: 'color' },
    value: { type: String, default: '#1a1a2e' },
  },
  description: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
})

webmixSchema.index({ userId: 1, order: 1 })

module.exports = mongoose.model('Webmix', webmixSchema)
