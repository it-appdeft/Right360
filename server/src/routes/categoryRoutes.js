const express = require('express')
const { getAll, getById, getBySlug, create, update, remove } = require('../controllers/categoryController')
const { auth, adminOnly } = require('../middleware/auth')

const router = express.Router()

router.get('/', getAll)
router.get('/slug/:slug', getBySlug)
router.get('/:id', getById)
router.post('/', auth, adminOnly, create)
router.put('/:id', auth, adminOnly, update)
router.delete('/:id', auth, adminOnly, remove)

module.exports = router
