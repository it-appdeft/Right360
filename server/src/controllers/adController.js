const Ad = require('../models/Ad')

const activeAdQuery = () => ({
  isActive: true,
  $or: [
    { startDate: { $exists: false } },
    { startDate: null },
    { startDate: { $lte: new Date() } },
  ],
  $or: [
    { endDate: { $exists: false } },
    { endDate: null },
    { endDate: { $gte: new Date() } },
  ],
})

exports.getActive = async (req, res, next) => {
  try {
    const ads = await Ad.find(activeAdQuery()).sort('-priority')
    res.json({ ads })
  } catch (error) {
    next(error)
  }
}

exports.getByCategory = async (req, res, next) => {
  try {
    const ads = await Ad.find({
      ...activeAdQuery(),
      $or: [{ categoryId: req.params.categoryId }, { categoryId: null }],
    }).sort('-priority')
    res.json({ ads })
  } catch (error) {
    next(error)
  }
}

exports.getPanelAds = async (req, res, next) => {
  try {
    const ads = await Ad.find({ ...activeAdQuery(), type: 'panel' }).sort('-priority')
    res.json({ ads })
  } catch (error) {
    next(error)
  }
}

exports.getTileAds = async (req, res, next) => {
  try {
    const ads = await Ad.find({ ...activeAdQuery(), type: 'tile' }).sort('-priority')
    res.json({ ads })
  } catch (error) {
    next(error)
  }
}

exports.trackImpression = async (req, res, next) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { impressions: 1 } })
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
}

exports.trackClick = async (req, res, next) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } })
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const ad = await Ad.create(req.body)
    res.status(201).json({ ad })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found.' })
    }
    res.json({ ad })
  } catch (error) {
    next(error)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id)
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found.' })
    }
    res.json({ message: 'Ad deleted.' })
  } catch (error) {
    next(error)
  }
}
