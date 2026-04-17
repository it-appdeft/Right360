import { create } from 'zustand'
import api from '../services/api'

const useTileStore = create((set, get) => ({
  tiles: [],
  isLoading: false,
  isEditMode: false,
  error: null,

  fetchTiles: async (categoryId) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.get(`/tiles/category/${categoryId}`)
      set({ tiles: data.tiles, isLoading: false })
    } catch {
      set({ isLoading: false, error: 'Failed to load tiles' })
    }
  },

  reorderTiles: (newTiles) => {
    set({ tiles: newTiles })
  },

  toggleEditMode: () => {
    set((state) => ({ isEditMode: !state.isEditMode }))
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

  clearTiles: () => set({ tiles: [], error: null }),
}))

export default useTileStore
