const Webmix = require('../models/Webmix')

exports.getUserWebmixes = async (req, res, next) => {
  try {
    const webmixes = await Webmix.find({ userId: req.user.userId })
      .sort('order')
      .populate('tiles.tileId')
    res.json({ webmixes })
  } catch (error) {
    next(error)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const webmix = await Webmix.findOne({
      _id: req.params.id,
      $or: [{ userId: req.user?.userId }, { isPublic: true }],
    }).populate('tiles.tileId')
    if (!webmix) {
      return res.status(404).json({ error: 'Webmix not found.' })
    }
    res.json({ webmix })
  } catch (error) {
    next(error)
  }
}

exports.getPublic = async (req, res, next) => {
  try {
    const webmixes = await Webmix.find({ isPublic: true })
      .select('name slug icon color description coverImage tags userId createdAt')
      .sort('order')
      .limit(30)
    res.json({ webmixes })
  } catch (error) {
    next(error)
  }
}

exports.search = async (req, res, next) => {
  try {
    const { q } = req.query
    if (!q) return res.json({ webmixes: [] })
    const webmixes = await Webmix.find({
      isPublic: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name slug icon color description coverImage tags userId')
      .limit(20)
    res.json({ webmixes })
  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { name, icon, color, tiles, background, isPublic } = req.body
    const count = await Webmix.countDocuments({ userId: req.user.userId })

    const slug = (name || 'webmix').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const webmix = await Webmix.create({
      userId: req.user.userId,
      name: name || `Webmix ${count + 1}`,
      slug: `${slug}-${Date.now()}`,
      icon: icon || '📋',
      color: color || '#3F8ECF',
      tiles: tiles || [],
      background: background || { type: 'color', value: '#1a1a2e' },
      isPublic: isPublic || false,
      isDefault: count === 0,
      order: count,
    })

    res.status(201).json({ webmix })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const webmix = await Webmix.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('tiles.tileId')

    if (!webmix) {
      return res.status(404).json({ error: 'Webmix not found.' })
    }
    res.json({ webmix })
  } catch (error) {
    next(error)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const webmix = await Webmix.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
      isDefault: false,
    })
    if (!webmix) {
      return res.status(400).json({ error: 'Cannot delete default webmix.' })
    }
    res.json({ message: 'Webmix deleted.' })
  } catch (error) {
    next(error)
  }
}
