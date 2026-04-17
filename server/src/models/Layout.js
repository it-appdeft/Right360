const mongoose = require('mongoose')

const layoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  tiles: [{
    tileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tile' },
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
  settings: {
    background: { type: String, default: '#F5F7FA' },
    backgroundImage: { type: String, default: '' },
    opacity: { type: Number, default: 1, min: 0, max: 1 },
    gridColumns: { type: Number, default: 8 },
  },
}, {
  timestamps: true,
})

layoutSchema.index({ userId: 1, categoryId: 1 }, { unique: true })

module.exports = mongoose.model('Layout', layoutSchema)
