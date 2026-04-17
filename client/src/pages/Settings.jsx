import { useState } from 'react'
import { FaPalette, FaTh, FaUser, FaUndo } from 'react-icons/fa'
import useLayoutStore from '../store/useLayoutStore'
import useAuthStore from '../store/useAuthStore'
import Button from '../components/common/Button'
import { toast } from '../components/common/Toast'

const presetColors = [
  '#F5F7FA', '#FFFFFF', '#E8F0FE', '#FEF3E2', '#F0FDF4',
  '#FDF2F8', '#1A1A2E', '#0F172A', '#1E293B', '#374151',
]

const tabs = [
  { key: 'background', label: 'Background', icon: FaPalette },
  { key: 'grid', label: 'Grid', icon: FaTh },
  { key: 'account', label: 'Account', icon: FaUser },
]

function Settings() {
  const { settings, updateSetting, resetSettings } = useLayoutStore()
  const { user, isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState('background')

  const handleReset = () => {
    resetSettings()
    toast.success('Settings reset to defaults')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Settings</h1>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <FaUndo size={12} />
          Reset All
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-page rounded-card p-1 mb-6">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-card text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-surface text-primary shadow-card'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Background Tab */}
      {activeTab === 'background' && (
        <div className="bg-surface rounded-card shadow-card p-6 space-y-6">
          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Background Color
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => updateSetting('background', color)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    settings.background === color
                      ? 'border-primary scale-110 shadow-card'
                      : 'border-border hover:border-text-muted'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.background}
                  onChange={(e) => updateSetting('background', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-border"
                />
                <input
                  type="text"
                  value={settings.background}
                  onChange={(e) => updateSetting('background', e.target.value)}
                  className="w-24 h-10 px-2 text-xs rounded-card border border-border bg-page text-text-primary"
                />
              </div>
            </div>
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Background Image URL
            </label>
            <input
              type="text"
              value={settings.backgroundImage}
              onChange={(e) => updateSetting('backgroundImage', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full h-10 px-4 rounded-card border border-border bg-page text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            {settings.backgroundImage && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={settings.backgroundImage}
                  alt="Preview"
                  className="w-20 h-14 object-cover rounded-card border border-border"
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSetting('backgroundImage', '')}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          {/* Opacity */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Grid Opacity: {Math.round(settings.opacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.opacity}
              onChange={(e) => updateSetting('opacity', parseFloat(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>
      )}

      {/* Grid Tab */}
      {activeTab === 'grid' && (
        <div className="bg-surface rounded-card shadow-card p-6 space-y-6">
          {/* Columns */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Grid Columns: {settings.gridColumns}
            </label>
            <input
              type="range"
              min="4"
              max="12"
              step="1"
              value={settings.gridColumns}
              onChange={(e) => updateSetting('gridColumns', parseInt(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>4 (compact)</span>
              <span>12 (wide)</span>
            </div>
          </div>

          {/* Tile Size */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Tile Size
            </label>
            <div className="flex gap-2">
              {['compact', 'default', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => updateSetting('tileSize', size)}
                  className={`flex-1 py-2.5 rounded-card text-sm font-medium capitalize transition-colors ${
                    settings.tileSize === size
                      ? 'bg-primary text-white'
                      : 'bg-page text-text-muted hover:text-text-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Tile Gap */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tile Spacing: {settings.tileGap}px
            </label>
            <input
              type="range"
              min="4"
              max="24"
              step="2"
              value={settings.tileGap}
              onChange={(e) => updateSetting('tileGap', parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Show Labels */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">
              Show Tile Labels
            </label>
            <button
              onClick={() => updateSetting('showLabels', !settings.showLabels)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                settings.showLabels ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  settings.showLabels ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="bg-surface rounded-card shadow-card p-6">
          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-text-primary">{user?.username}</p>
                  <p className="text-sm text-text-muted">{user?.email}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-text-muted">
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-muted mb-2">You're browsing as a guest.</p>
              <p className="text-sm text-text-muted">
                Sign in to sync your settings across devices.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Settings
