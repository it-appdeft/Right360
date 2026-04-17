const Category = require('../models/Category')

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.find({ parentId: null, isActive: true })
      .sort('order')
      .populate('subcategories')
    res.json({ categories })
  } catch (error) {
    next(error)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('subcategories')
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' })
    }
    res.json({ category })
  } catch (error) {
    next(error)
  }
}

exports.getBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('subcategories')
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' })
    }
    res.json({ category })
  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json({ category })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' })
    }
    res.json({ category })
  } catch (error) {
    next(error)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' })
    }
    res.json({ message: 'Category deleted.' })
  } catch (error) {
    next(error)
  }
}
