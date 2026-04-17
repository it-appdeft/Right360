import { create } from 'zustand'
import api from '../services/api'

const GUEST_KEY = 'right360_guest_webmixes'

const useWebmixStore = create((set, get) => ({
  webmixes: [],
  activeWebmix: null,
  isLoading: false,
  isSidebarOpen: false,

  fetchWebmixes: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      // Guest — load from localStorage
      const saved = JSON.parse(localStorage.getItem(GUEST_KEY) || '[]')
      if (saved.length === 0) {
        saved.push({ _id: 'guest-default', name: 'My Webmix', icon: '🏠', color: '#7B5EA7', tiles: [], isDefault: true })
      }
      set({ webmixes: saved, activeWebmix: saved[0] })
      return
    }

    set({ isLoading: true })
    try {
      const { data } = await api.get('/webmixes')
      let webmixes = data.webmixes
      if (webmixes.length === 0) {
        // Create default webmix
        const res = await api.post('/webmixes', { name: 'My Webmix', icon: '🏠' })
        webmixes = [res.data.webmix]
      }
      set({ webmixes, activeWebmix: webmixes[0], isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  setActiveWebmix: (webmix) => set({ activeWebmix: webmix }),

  createWebmix: async (data) => {
    const token = localStorage.getItem('token')
    if (!token) {
      const newMix = { _id: `guest-${Date.now()}`, tiles: [], isDefault: false, ...data }
      set((s) => {
        const updated = [...s.webmixes, newMix]
        localStorage.setItem(GUEST_KEY, JSON.stringify(updated))
        return { webmixes: updated, activeWebmix: newMix }
      })
      return newMix
    }

    try {
      const res = await api.post('/webmixes', data)
      const webmix = res.data.webmix
      set((s) => ({ webmixes: [...s.webmixes, webmix], activeWebmix: webmix }))
      return webmix
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create webmix')
    }
  },

  updateWebmix: async (id, data) => {
    try {
      const res = await api.put(`/webmixes/${id}`, data)
      set((s) => ({
        webmixes: s.webmixes.map((w) => (w._id === id ? res.data.webmix : w)),
        activeWebmix: s.activeWebmix?._id === id ? res.data.webmix : s.activeWebmix,
      }))
    } catch {
      // silent
    }
  },

  deleteWebmix: async (id) => {
    try {
      await api.delete(`/webmixes/${id}`)
      set((s) => {
        const remaining = s.webmixes.filter((w) => w._id !== id)
        return {
          webmixes: remaining,
          activeWebmix: s.activeWebmix?._id === id ? remaining[0] : s.activeWebmix,
        }
      })
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete webmix')
    }
  },

  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
}))

export default useWebmixStore
