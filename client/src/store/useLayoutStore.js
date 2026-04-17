import { create } from 'zustand'

const STORAGE_KEY = 'right360_settings'

const defaultSettings = {
  background: '#1a1a2e',
  backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  opacity: 1,
  gridColumns: 8,
  tileSize: 'default',
  tileGap: 12,
  showLabels: true,
  theme: 'light',
}

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

const useLayoutStore = create((set, get) => ({
  settings: loadSettings(),
  isSettingsOpen: false,
  activeSettingsTab: 'background',

  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
  setSettingsTab: (tab) => set({ activeSettingsTab: tab }),

  updateSetting: (key, value) => {
    set((state) => {
      const updated = { ...state.settings, [key]: value }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return { settings: updated }
    })
  },

  setBackground: (color) => get().updateSetting('background', color),
  setBackgroundImage: (url) => get().updateSetting('backgroundImage', url),
  setOpacity: (val) => get().updateSetting('opacity', val),
  setGridColumns: (count) => get().updateSetting('gridColumns', count),

  resetSettings: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ settings: defaultSettings })
  },
}))

export default useLayoutStore
