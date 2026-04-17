const express = require('express')
const { getByCategory, save, update, remove } = require('../controllers/layoutController')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.get('/:categoryId', auth, getByCategory)
router.post('/', auth, save)
router.put('/:id', auth, update)
router.delete('/:id', auth, remove)

module.exports = router
