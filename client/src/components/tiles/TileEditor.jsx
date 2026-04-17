import { useState, useEffect } from 'react'
import { FaLink, FaTag, FaImage, FaInfoCircle, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import Modal from '../common/Modal'

const tileColors = [
  '#FFD93D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FF8A5C', '#EA5455', '#7367F0', '#28C76F', '#FF9F43',
  '#00CFE8', '#A855F7', '#E8842A', '#3F8ECF', '#6B9E3A',
  '#D94444', '#7B5EA7', '#4CAF50',
]

const sizeOptions = [
  { value: '1x1', label: '1×1 Small' },
  { value: '2x2', label: '2×2 Medium' },
  { value: '4x4', label: '4×4 Large' },
]

function TileEditor({ isOpen, onClose, tile = null, onSave, onDelete, categoryId }) {
  const isEditing = !!tile

  const [form, setForm] = useState({
    title: '',
    url: '',
    logo: '',
    subtitle: '',
    size: '1x1',
    bgColor: '#3F8ECF',
    metadata: {
      trendIndicator: 'none',
      biasIndicator: '',
      infoPanel: '',
      subLinks: [],
    },
  })

  const [newSubLink, setNewSubLink] = useState({ title: '', url: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (tile) {
      setForm({
        title: tile.title || '',
        url: tile.url || '',
        logo: tile.logo || '',
        subtitle: tile.subtitle || '',
        size: tile.size || '1x1',
        bgColor: tile.bgColor || '#3F8ECF',
        metadata: {
          trendIndicator: tile.metadata?.trendIndicator || 'none',
          biasIndicator: tile.metadata?.biasIndicator || '',
          infoPanel: tile.metadata?.infoPanel || '',
          subLinks: tile.metadata?.subLinks || [],
        },
      })
    } else {
      setForm({
        title: '',
        url: '',
        logo: '',
        subtitle: '',
        size: '1x1',
        bgColor: tileColors[Math.floor(Math.random() * tileColors.length)],
        metadata: { trendIndicator: 'none', biasIndicator: '', infoPanel: '', subLinks: [] },
      })
    }
    setErrors({})
  }, [tile, isOpen])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleMetaChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value },
    }))
  }

  const addSubLink = () => {
    if (newSubLink.title && newSubLink.url) {
      handleMetaChange('subLinks', [...form.metadata.subLinks, { ...newSubLink }])
      setNewSubLink({ title: '', url: '' })
    }
  }

  const removeSubLink = (index) => {
    handleMetaChange('subLinks', form.metadata.subLinks.filter((_, i) => i !== index))
  }

  // Auto-fetch favicon when URL changes
  const handleUrlChange = (url) => {
    handleChange('url', url)
    if (url && !form.logo) {
      try {
        const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
        handleChange('logo', `https://www.google.com/s2/favicons?domain=${domain}&sz=64`)
      } catch {
        // invalid URL
      }
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.url.trim()) errs.url = 'URL is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    let url = form.url.trim()
    if (!url.startsWith('http')) url = `https://${url}`

    onSave({
      ...form,
      url,
      categoryId,
    })
    onClose()
  }

  const handleDelete = () => {
    if (tile && onDelete) {
      onDelete(tile._id)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Tile' : 'Add New Tile'} size="md">
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <div className="relative">
            <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Google, YouTube"
              className={`w-full h-10 pl-9 pr-3 rounded-lg border text-sm ${errors.title ? 'border-danger' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/30`}
            />
          </div>
          {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
          <div className="relative">
            <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
            <input
              type="text"
              value={form.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://www.example.com"
              className={`w-full h-10 pl-9 pr-3 rounded-lg border text-sm ${errors.url ? 'border-danger' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/30`}
            />
          </div>
          {errors.url && <p className="text-xs text-danger mt-1">{errors.url}</p>}
        </div>

        {/* Logo + Subtitle row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <div className="relative">
              <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
              <input
                type="text"
                value={form.logo}
                onChange={(e) => handleChange('logo', e.target.value)}
                placeholder="Auto-detected"
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Short description"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Tile Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tile Color</label>
          <div className="flex flex-wrap gap-2">
            {tileColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleChange('bgColor', color)}
                className={`w-7 h-7 rounded-lg transition-all ${
                  form.bgColor === color ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tile Size</label>
          <div className="flex gap-2">
            {sizeOptions.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleChange('size', value)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                  form.size === value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FaInfoCircle className="inline mr-1" size={12} />
            Info Panel (tooltip)
          </label>
          <textarea
            value={form.metadata.infoPanel}
            onChange={(e) => handleMetaChange('infoPanel', e.target.value)}
            placeholder="Description shown on hover"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Trend Indicator */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trend Badge</label>
          <div className="flex gap-2">
            {['none', 'hot', 'new', 'trending'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleMetaChange('trendIndicator', t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  form.metadata.trendIndicator === t
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub-links</label>
          {form.metadata.subLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-600 flex-1 truncate">{link.title} → {link.url}</span>
              <button onClick={() => removeSubLink(i)} className="text-danger hover:text-danger/80">
                <FaTimes size={11} />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubLink.title}
              onChange={(e) => setNewSubLink({ ...newSubLink, title: e.target.value })}
              placeholder="Link title"
              className="flex-1 h-8 px-2 rounded border border-gray-200 text-xs"
            />
            <input
              type="text"
              value={newSubLink.url}
              onChange={(e) => setNewSubLink({ ...newSubLink, url: e.target.value })}
              placeholder="URL"
              className="flex-1 h-8 px-2 rounded border border-gray-200 text-xs"
            />
            <button onClick={addSubLink} className="h-8 px-2 bg-primary/10 text-primary rounded text-xs">
              <FaPlus size={10} />
            </button>
          </div>
        </div>

        {/* Bias Indicator */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bias Indicator</label>
          <input
            type="text"
            value={form.metadata.biasIndicator}
            onChange={(e) => handleMetaChange('biasIndicator', e.target.value)}
            placeholder="e.g. Left-leaning, Conservative, Neutral"
            className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Preview */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-medium text-gray-500 mb-2">Preview</p>
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
              style={{ backgroundColor: form.bgColor }}
            >
              {form.logo ? (
                <img src={form.logo} alt="" className="w-8 h-8 rounded-lg bg-white/90 p-1" onError={(e) => (e.target.style.display = 'none')} />
              ) : (
                <span className="text-white text-lg font-bold">{form.title?.charAt(0) || '?'}</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">{form.title || 'Tile Title'}</p>
              <p className="text-xs text-gray-400">{form.subtitle || 'Subtitle'}</p>
              <p className="text-[10px] text-gray-400 truncate">{form.url || 'https://...'}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {isEditing ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-danger hover:bg-danger/5 rounded-lg transition-colors"
            >
              <FaTrash size={11} /> Delete Tile
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Add Tile'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TileEditor
