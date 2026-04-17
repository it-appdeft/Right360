import { create } from 'zustand'
import api from '../services/api'

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  isGuest: true,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
      })
      return data
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed'
      set({ isLoading: false, error: message })
      throw new Error(message)
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.post('/auth/register', { username, email, password })
      localStorage.setItem('token', data.token)
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
      })
      return data
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed'
      set({ isLoading: false, error: message })
      throw new Error(message)
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: true,
      error: null,
    })
  },

  loadUser: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ isGuest: true, isAuthenticated: false })
      return
    }
    set({ isLoading: true })
    try {
      const { data } = await api.get('/auth/me')
      set({
        user: data.user,
        token,
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
      })
    } catch {
      localStorage.removeItem('token')
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isGuest: true,
        isLoading: false,
      })
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.put('/auth/profile', profileData)
      set({ user: data.user, isLoading: false })
      return data
    } catch (error) {
      const message = error.response?.data?.error || 'Update failed'
      set({ isLoading: false, error: message })
      throw new Error(message)
    }
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
