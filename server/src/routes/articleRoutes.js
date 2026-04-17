const express = require('express')
const { getByCategory, getPerspective, getInfo, getById, create, update, remove } = require('../controllers/articleController')
const { auth, adminOnly } = require('../middleware/auth')

const router = express.Router()

router.get('/category/:categoryId', getByCategory)
router.get('/category/:categoryId/perspective', getPerspective)
router.get('/category/:categoryId/info', getInfo)
router.get('/:id', getById)
router.post('/', auth, adminOnly, create)
router.put('/:id', auth, adminOnly, update)
router.delete('/:id', auth, adminOnly, remove)

module.exports = router
