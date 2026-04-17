import { useState } from 'react'
import { FaTh, FaSearch, FaCheck } from 'react-icons/fa'
import Modal from '../common/Modal'
import useWebmixStore from '../../store/useWebmixStore'
import { toast } from '../common/Toast'

const suggestedTags = ['Education', 'Math', 'Reading', 'ELA', 'Science', 'Gaming', 'Art', 'Social Studies']

function AddWebmixModal({ isOpen, onClose }) {
  const { createWebmix } = useWebmixStore()
  const [mode, setMode] = useState(null) // null | 'empty' | 'search'
  const [name, setName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateEmpty = async () => {
    if (!name.trim()) return
    setIsLoading(true)
    try {
      await createWebmix({ name: name.trim(), icon: '📋' })
      toast.success(`Webmix "${name}" created!`)
      onClose()
      setMode(null)
      setName('')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMode(null)
    setName('')
    setSearchQuery('')
  }

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); handleReset() }} title="Add a webmix" size="md">
      <p className="text-sm text-gray-500 text-center mb-6">
        Search for webmixes created by other Right360 users or add an empty webmix to get started.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Empty Webmix */}
        <div
          className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
            mode === 'empty' ? 'border-brand-green bg-brand-green/5' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setMode('empty')}
        >
          <div className="w-full h-28 rounded-lg bg-brand-green/80 flex items-center justify-center mb-3 relative overflow-hidden">
            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold text-white bg-black/20">Empty Webmix</span>
            <div className="grid grid-cols-4 gap-1 p-3 opacity-50">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded bg-white/40" />
              ))}
            </div>
          </div>
          <h3 className="font-bold text-sm text-gray-800 text-center">Add an empty webmix</h3>

          {mode === 'empty' && (
            <div className="mt-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Webmix name"
                autoFocus
                className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateEmpty()}
              />
              <button
                onClick={handleCreateEmpty}
                disabled={!name.trim() || isLoading}
                className="mt-2 w-full flex items-center justify-center gap-1.5 h-9 bg-brand-green text-white text-xs font-bold rounded-lg hover:bg-brand-green/90 disabled:opacity-40 transition-colors"
              >
                <FaCheck size={10} /> Add
              </button>
            </div>
          )}
        </div>

        {/* Search Existing */}
        <div
          className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
            mode === 'search' ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setMode('search')}
        >
          <div className="w-full h-28 rounded-lg bg-brand-blue/80 flex items-center justify-center mb-3 relative overflow-hidden">
            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold text-white bg-black/20">Community</span>
            <div className="grid grid-cols-3 gap-1 p-3">
              {['#FF6B6B', '#FFD93D', '#4ECDC4', '#7367F0', '#FF9F43', '#28C76F', '#45B7D1', '#EA5455', '#A855F7'].map((c, i) => (
                <div key={i} className="w-5 h-5 rounded" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <h3 className="font-bold text-sm text-gray-800 text-center">Search for an existing webmix</h3>

          {mode === 'search' && (
            <div className="mt-3">
              <div className="relative">
                <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={11} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Webmixes"
                  autoFocus
                  className="w-full h-9 pl-8 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>
              <div className="mt-2">
                <p className="text-[9px] text-gray-400 mb-1">Try suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-2 py-0.5 rounded-full text-[9px] bg-gray-100 text-gray-500 hover:bg-brand-blue/10 hover:text-brand-blue transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <button
                disabled={!searchQuery.trim()}
                className="mt-2 w-full flex items-center justify-center gap-1.5 h-9 bg-brand-blue text-white text-xs font-bold rounded-lg hover:bg-brand-blue/90 disabled:opacity-40 transition-colors"
              >
                <FaSearch size={10} /> Search
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default AddWebmixModal
