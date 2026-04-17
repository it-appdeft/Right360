const express = require('express')
const { getActive, getByCategory, getPanelAds, getTileAds, trackImpression, trackClick, create, update, remove } = require('../controllers/adController')
const { auth, adminOnly } = require('../middleware/auth')

const router = express.Router()

router.get('/', getActive)
router.get('/panel', getPanelAds)
router.get('/tiles', getTileAds)
router.get('/category/:categoryId', getByCategory)
router.post('/:id/impression', trackImpression)
router.post('/:id/click', trackClick)
router.post('/', auth, adminOnly, create)
router.put('/:id', auth, adminOnly, update)
router.delete('/:id', auth, adminOnly, remove)

module.exports = router
