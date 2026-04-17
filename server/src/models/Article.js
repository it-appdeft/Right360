const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  type: {
    type: String,
    enum: ['perspective', 'informational'],
    required: true,
  },
  perspective: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: [true, 'Article content is required'],
  },
  summary: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: 'Right360',
  },
  coverImage: {
    type: String,
    default: '',
  },
  tags: [String],
  isPublished: {
    type: Boolean,
    default: false,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
})

articleSchema.index({ categoryId: 1, type: 1 })

module.exports = mongoose.model('Article', articleSchema)
