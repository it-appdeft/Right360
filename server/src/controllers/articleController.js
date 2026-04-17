const Article = require('../models/Article')

exports.getByCategory = async (req, res, next) => {
  try {
    const articles = await Article.find({
      categoryId: req.params.categoryId,
      isPublished: true,
    })
    res.json({ articles })
  } catch (error) {
    next(error)
  }
}

exports.getPerspective = async (req, res, next) => {
  try {
    const article = await Article.findOne({
      categoryId: req.params.categoryId,
      type: 'perspective',
      isPublished: true,
    })
    res.json({ article })
  } catch (error) {
    next(error)
  }
}

exports.getInfo = async (req, res, next) => {
  try {
    const article = await Article.findOne({
      categoryId: req.params.categoryId,
      type: 'informational',
      isPublished: true,
    })
    res.json({ article })
  } catch (error) {
    next(error)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) {
      return res.status(404).json({ error: 'Article not found.' })
    }
    // Increment view count
    article.viewCount += 1
    await article.save()
    res.json({ article })
  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const article = await Article.create(req.body)
    res.status(201).json({ article })
  } catch (error) {
    next(error)
  }
}

exports.update = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!article) {
      return res.status(404).json({ error: 'Article not found.' })
    }
    res.json({ article })
  } catch (error) {
    next(error)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id)
    if (!article) {
      return res.status(404).json({ error: 'Article not found.' })
    }
    res.json({ message: 'Article deleted.' })
  } catch (error) {
    next(error)
  }
}
