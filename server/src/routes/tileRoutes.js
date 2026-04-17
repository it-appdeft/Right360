const express = require('express')
const { getAll, getByCategory, getById, create, update, remove } = require('../controllers/tileController')
const { auth, adminOnly } = require('../middleware/auth')

const router = express.Router()

router.get('/', getAll)
router.get('/category/:categoryId', getByCategory)
router.get('/:id', getById)
router.post('/', auth, adminOnly, create)
router.put('/:id', auth, adminOnly, update)
router.delete('/:id', auth, adminOnly, remove)

module.exports = router
