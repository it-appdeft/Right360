const Tile = require('../models/Tile')

exports.getAll = async (req, res, next) => {
  try {
    const tiles = await Tile.find({ isDefault: true }).sort('position')
    res.json({ tiles })
  } catch (error) {
    next(error)
  }
}

exports.getByCategory = async (req, res, next) => {
  try {
    const tiles = await Tile.find({
      categoryId: req.params.categoryId,
      isDefault: true,
    }).sort('position')
    res.json({ tiles })
  } catch (error) {
    next(error)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const tile = await Tile.findById(req.params.id)
    if (!tile) {
      return res.status(404).json({ error: 'Tile not found.' })
    }
    res.json({ tile })
  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const tile = await Tile.create(req.body)
    res.status(201).json({ tile })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const tile = await Tile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!tile) {
      return res.status(404).json({ error: 'Tile not found.' })
    }
    res.json({ tile })
  } catch (error) {
    next(error)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const tile = await Tile.findByIdAndDelete(req.params.id)
    if (!tile) {
      return res.status(404).json({ error: 'Tile not found.' })
    }
    res.json({ message: 'Tile deleted.' })
  } catch (error) {
    next(error)
  }
}
