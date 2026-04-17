import { create } from 'zustand'
import api from '../services/api'

const useAdStore = create((set, get) => ({
  panelAds: [],
  tileAds: [],
  currentPanelAd: null,
  isLoading: false,

  fetchPanelAds: async () => {
    try {
      const { data } = await api.get('/ads/panel')
      const ads = data.ads || []
      set({ panelAds: ads, currentPanelAd: ads[0] || null })
    } catch {
      // silent fail for ads
    }
  },

  fetchTileAds: async (categoryId) => {
    try {
      const url = categoryId ? `/ads/category/${categoryId}` : '/ads/tiles'
      const { data } = await api.get(url)
      set({ tileAds: (data.ads || []).filter((a) => a.type === 'tile') })
    } catch {
      // silent fail
    }
  },

  rotateAd: () => {
    const { panelAds, currentPanelAd } = get()
    if (panelAds.length <= 1) return

    const currentIndex = panelAds.findIndex((a) => a._id === currentPanelAd?._id)
    const nextIndex = (currentIndex + 1) % panelAds.length
    set({ currentPanelAd: panelAds[nextIndex] })
  },

  trackImpression: async (adId) => {
    try {
      await api.post(`/ads/${adId}/impression`)
    } catch {
      // silent
    }
  },

  trackClick: async (adId) => {
    try {
      await api.post(`/ads/${adId}/click`)
    } catch {
      // silent
    }
  },
}))

export default useAdStore
