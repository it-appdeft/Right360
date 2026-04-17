const express = require('express')
const { getUserWebmixes, getById, getPublic, search, create, update, remove } = require('../controllers/webmixController')
const { auth, optionalAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/public', getPublic)
router.get('/search', search)
router.get('/', auth, getUserWebmixes)
router.get('/:id', optionalAuth, getById)
router.post('/', auth, create)
router.put('/:id', auth, update)
router.delete('/:id', auth, remove)

module.exports = router
