const express = require('express')
const { getAll, getById, getBySlug, create, update, remove } = require('../controllers/categoryController')
const { auth, adminOnly } = require('../middleware/auth')
const { cache, invalidateCache } = require('../middleware/cache')

const router = express.Router()

router.get('/', cache(3600), getAll)
router.get('/slug/:slug', cache(1800), getBySlug)
router.get('/:id', cache(1800), getById)
router.post('/', auth, adminOnly, invalidateCache('/api/categories*'), create)
router.put('/:id', auth, adminOnly, invalidateCache('/api/categories*'), update)
router.delete('/:id', auth, adminOnly, invalidateCache('/api/categories*'), remove)

module.exports = router
