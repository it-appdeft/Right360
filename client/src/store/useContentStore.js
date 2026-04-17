import { create } from 'zustand'
import api from '../services/api'

const useContentStore = create((set) => ({
  articles: {},
  currentArticle: null,
  isLoading: false,
  error: null,

  fetchArticle: async (categoryId, type) => {
    const endpoint = type === 'perspective'
      ? `/articles/category/${categoryId}/perspective`
      : `/articles/category/${categoryId}/info`

    set({ isLoading: true, error: null, currentArticle: null })
    try {
      const { data } = await api.get(endpoint)
      set({ currentArticle: data.article, isLoading: false })
    } catch {
      set({ isLoading: false, error: 'Failed to load article' })
    }
  },

  clearArticle: () => set({ currentArticle: null, error: null }),
}))

export default useContentStore
