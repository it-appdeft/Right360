const mongoose = require('mongoose')

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Ad title is required'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Ad image is required'],
  },
  link: {
    type: String,
    required: [true, 'Ad link is required'],
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  type: {
    type: String,
    enum: ['panel', 'tile'],
    required: true,
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  impressions: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  costModel: {
    type: String,
    enum: ['cpc', 'cpm'],
    default: 'cpc',
  },
  costValue: {
    type: Number,
    default: 0,
  },
  advertiser: {
    type: String,
    default: '',
  },
  startDate: Date,
  endDate: Date,
}, {
  timestamps: true,
})

adSchema.index({ isActive: 1, categoryId: 1, priority: -1 })

module.exports = mongoose.model('Ad', adSchema)
