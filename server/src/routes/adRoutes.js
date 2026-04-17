const express = require('express')
const { getActive, getByCategory, getPanelAds, getTileAds, trackImpression, trackClick, create, update, remove } = require('../controllers/adController')
const { auth, adminOnly } = require('../middleware/auth')
const { cache, invalidateCache } = require('../middleware/cache')

const router = express.Router()

router.get('/', cache(900), getActive)
router.get('/panel', cache(900), getPanelAds)
router.get('/tiles', cache(900), getTileAds)
router.get('/category/:categoryId', cache(900), getByCategory)
router.post('/:id/impression', trackImpression)
router.post('/:id/click', trackClick)
router.post('/', auth, adminOnly, invalidateCache('/api/ads*'), create)
router.put('/:id', auth, adminOnly, invalidateCache('/api/ads*'), update)
router.delete('/:id', auth, adminOnly, invalidateCache('/api/ads*'), remove)

module.exports = router
