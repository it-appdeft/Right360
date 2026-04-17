const Layout = require('../models/Layout')

exports.getByCategory = async (req, res, next) => {
  try {
    const layout = await Layout.findOne({
      userId: req.user.userId,
      categoryId: req.params.categoryId,
    }).populate('tiles.tileId')

    if (!layout) {
      return res.json({ layout: null })
    }

    res.json({ layout })
  } catch (error) {
    next(error)
  }
}

exports.save = async (req, res, next) => {
  try {
    const { categoryId, tiles, settings } = req.body

    const layout = await Layout.findOneAndUpdate(
      { userId: req.user.userId, categoryId },
      { tiles, settings },
      { new: true, upsert: true, runValidators: true }
    )

    res.json({ layout })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const layout = await Layout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!layout) {
      return res.status(404).json({ error: 'Layout not found.' })
    }

    res.json({ layout })
  } catch (error) {
    next(error)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const layout = await Layout.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!layout) {
      return res.status(404).json({ error: 'Layout not found.' })
    }

    res.json({ message: 'Layout deleted.' })
  } catch (error) {
    next(error)
  }
}
