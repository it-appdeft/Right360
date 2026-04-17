import { create } from 'zustand'
import { getEngine } from '../utils/searchEngines'

const useSearchStore = create((set, get) => ({
  query: '',
  selectedEngine: localStorage.getItem('right360_searchEngine') || 'google',
  recentSearches: JSON.parse(localStorage.getItem('right360_recentSearches') || '[]'),
  isDropdownOpen: false,

  setQuery: (query) => set({ query }),

  setEngine: (key) => {
    localStorage.setItem('right360_searchEngine', key)
    set({ selectedEngine: key, isDropdownOpen: false })
  },

  toggleDropdown: () => set((state) => ({ isDropdownOpen: !state.isDropdownOpen })),
  closeDropdown: () => set({ isDropdownOpen: false }),

  executeSearch: () => {
    const { query, selectedEngine, addToRecent } = get()
    const engine = getEngine(selectedEngine)
    const trimmed = query.trim()

    if (!trimmed || !engine) return

    addToRecent(trimmed)
    const encoded = encodeURIComponent(trimmed)
    window.open(`${engine.searchUrl}${encoded}`, '_blank')
  },

  addToRecent: (query) => {
    set((state) => {
      const filtered = state.recentSearches.filter((q) => q !== query)
      const updated = [query, ...filtered].slice(0, 10)
      localStorage.setItem('right360_recentSearches', JSON.stringify(updated))
      return { recentSearches: updated }
    })
  },

  clearRecent: () => {
    localStorage.removeItem('right360_recentSearches')
    set({ recentSearches: [] })
  },

  useRecentSearch: (query) => {
    set({ query })
    get().executeSearch()
  },
}))

export default useSearchStore
