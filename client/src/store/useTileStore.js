import { create } from 'zustand'
import api from '../services/api'

const useTileStore = create((set, get) => ({
  tiles: [],
  userLayout: null,
  isLoading: false,
  isEditMode: false,
  error: null,

  fetchTiles: async (categoryId) => {
    set({ isLoading: true, error: null })
    try {
      // Try to load user layout first (if authenticated)
      const token = localStorage.getItem('token')
      let userLayout = null

      if (token) {
        try {
          const layoutRes = await api.get(`/layouts/${categoryId}`)
          userLayout = layoutRes.data.layout
        } catch {
          // No saved layout — use defaults
        }
      }

      // Load default tiles
      const { data } = await api.get(`/tiles/category/${categoryId}`)
      let tiles = data.tiles

      // If user has a layout, reorder tiles according to saved positions
      if (userLayout && userLayout.tiles?.length > 0) {
        const layoutTileIds = userLayout.tiles.map((t) => t.tileId?._id || t.tileId)
        const orderedTiles = []
        for (const lt of userLayout.tiles) {
          const id = lt.tileId?._id || lt.tileId
          const found = tiles.find((t) => t._id === id)
          if (found) orderedTiles.push({ ...found, size: lt.size || '1x1' })
        }
        // Add any tiles not in layout
        for (const t of tiles) {
          if (!layoutTileIds.includes(t._id)) orderedTiles.push(t)
        }
        tiles = orderedTiles
      }

      set({ tiles, userLayout, isLoading: false })
    } catch {
      set({ isLoading: false, error: 'Failed to load tiles' })
    }
  },

  reorderTiles: (newTiles) => {
    set({ tiles: newTiles })
  },

  saveLayout: async (categoryId) => {
    const { tiles, userLayout } = get()
    const token = localStorage.getItem('token')
    if (!token) {
      // Guest — save to localStorage
      localStorage.setItem(`right360_layout_${categoryId}`, JSON.stringify(tiles.map((t) => t._id)))
      return
    }

    const layoutData = {
      categoryId,
      tiles: tiles.map((t, i) => ({
        tileId: t._id,
        position: { x: i % 6, y: Math.floor(i / 6) },
        size: t.size || '1x1',
      })),
    }

    try {
      const { data } = await api.post('/layouts', layoutData)
      set({ userLayout: data.layout })
    } catch {
      // silent fail
    }
  },

  toggleEditMode: () => {
    const { isEditMode } = get()
    if (isEditMode) {
      // Exiting edit mode — auto-save layout
      // categoryId will be passed from component
    }
    set({ isEditMode: !isEditMode })
  },

  addTile: async (tileData) => {
    try {
      const { data } = await api.post('/tiles', tileData)
      set((state) => ({ tiles: [...state.tiles, data.tile] }))
      return data.tile
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add tile')
    }
  },

  removeTile: async (tileId) => {
    try {
      await api.delete(`/tiles/${tileId}`)
      set((state) => ({
        tiles: state.tiles.filter((t) => t._id !== tileId),
      }))
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to remove tile')
    }
  },

  clearTiles: () => set({ tiles: [], userLayout: null, error: null }),
}))

export default useTileStore
