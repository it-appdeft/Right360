import { create } from 'zustand'
import api from '../services/api'

const useCategoryStore = create((set, get) => ({
  categories: [],
  activeCategory: null,
  activeTab: 'start',
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    if (get().categories.length > 0) return
    set({ isLoading: true })
    try {
      const { data } = await api.get('/categories')
      set({ categories: data.categories, isLoading: false })
    } catch (error) {
      set({ isLoading: false, error: 'Failed to load categories' })
    }
  },

  setActiveCategory: (category) => {
    set({ activeCategory: category, activeTab: 'start' })
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab })
  },

  getCategoryBySlug: (slug) => {
    return get().categories.find((c) => c.slug === slug) || null
  },

  fetchCategoryBySlug: async (slug) => {
    try {
      const { data } = await api.get(`/categories/slug/${slug}`)
      set({ activeCategory: data.category })
      return data.category
    } catch {
      set({ error: 'Category not found' })
      return null
    }
  },
}))

export default useCategoryStore
