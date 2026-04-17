const mongoose = require('mongoose')

const tileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tile title is required'],
    trim: true,
  },
  url: {
    type: String,
    required: [true, 'Tile URL is required'],
    trim: true,
  },
  logo: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  metadata: {
    trendIndicator: {
      type: String,
      enum: ['hot', 'new', 'trending', 'none'],
      default: 'none',
    },
    biasIndicator: { type: String, default: '' },
    subLinks: [{
      title: { type: String, required: true },
      url: { type: String, required: true },
    }],
    infoPanel: { type: String, default: '' },
  },
  isSponsored: {
    type: Boolean,
    default: false,
  },
  isDefault: {
    type: Boolean,
    default: true,
  },
  position: {
    type: Number,
    default: 0,
  },
  size: {
    type: String,
    enum: ['1x1', '2x2', '4x4'],
    default: '1x1',
  },
}, {
  timestamps: true,
})

tileSchema.index({ categoryId: 1, position: 1 })

module.exports = mongoose.model('Tile', tileSchema)
