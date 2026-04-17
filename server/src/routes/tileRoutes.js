const express = require('express')
const { getAll, getByCategory, getById, create, update, remove } = require('../controllers/tileController')
const { auth, adminOnly } = require('../middleware/auth')
const { cache, invalidateCache } = require('../middleware/cache')

const router = express.Router()

router.get('/', cache(1800), getAll)
router.get('/category/:categoryId', cache(1800), getByCategory)
router.get('/:id', cache(900), getById)
router.post('/', auth, invalidateCache('/api/tiles*'), create)
router.put('/:id', auth, invalidateCache('/api/tiles*'), update)
router.delete('/:id', auth, invalidateCache('/api/tiles*'), remove)

module.exports = router
