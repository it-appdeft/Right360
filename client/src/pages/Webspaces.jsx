import { useState, useEffect } from 'react'
import { FaSearch, FaTimes, FaPlus, FaGlobe } from 'react-icons/fa'
import api from '../services/api'
import useWebmixStore from '../store/useWebmixStore'
import { toast } from '../components/common/Toast'
import { PageLoader } from '../components/common/Loader'

function Webspaces() {
  const [webmixes, setWebmixes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { createWebmix } = useWebmixStore()

  useEffect(() => {
    fetchPublicWebmixes()
  }, [])

  const fetchPublicWebmixes = async () => {
    try {
      const { data } = await api.get('/webmixes/public')
      setWebmixes(data.webmixes)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchPublicWebmixes()
      return
    }
    setLoading(true)
    try {
      const { data } = await api.get(`/webmixes/search?q=${encodeURIComponent(search)}`)
      setWebmixes(data.webmixes)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const handleAddWebmix = async (wm) => {
    try {
      await createWebmix({
        name: wm.name,
        icon: wm.icon,
        color: wm.color,
      })
      toast.success(`"${wm.name}" added to your webmixes!`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-purple/90 to-brand-blue/90 backdrop-blur-md rounded-2xl p-6 mb-6 text-center">
        <h1 className="text-xl font-heading font-bold text-white mb-1">
          Add a Public Webspace
        </h1>
        <p className="text-sm text-white/70 mb-5">
          Public Webspaces contain internet resources and pre-selected content from Right360 and trusted partners.
        </p>

        {/* Close link */}
        <a
          href="/"
          className="absolute top-4 right-4 text-white/50 hover:text-white text-xs"
        >
          ✕ Close
        </a>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={13} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search webspaces..."
            className="w-full h-10 pl-9 pr-10 rounded-full bg-white/15 border border-white/20 text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); fetchPublicWebmixes() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <PageLoader />
      ) : webmixes.length === 0 ? (
        <div className="text-center py-16">
          <FaGlobe className="mx-auto text-white/20 mb-3" size={40} />
          <p className="text-white/50 text-sm">No webspaces found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {webmixes.map((wm) => (
            <WebmixCard key={wm._id} webmix={wm} onAdd={() => handleAddWebmix(wm)} />
          ))}
        </div>
      )}
    </div>
  )
}

function WebmixCard({ webmix, onAdd }) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group">
      {/* Cover Image */}
      <div className="h-36 relative overflow-hidden">
        {webmix.coverImage ? (
          <img
            src={webmix.coverImage}
            alt={webmix.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: webmix.color || '#7B5EA7' }}
          >
            {webmix.icon || '📋'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-2 left-2 text-2xl drop-shadow-lg">{webmix.icon}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-bold text-gray-800 text-sm mb-1">
          {webmix.name}
        </h3>

        {webmix.description && (
          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3 mb-3">
            {webmix.description}
          </p>
        )}

        {/* Tags */}
        {webmix.tags && webmix.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {webmix.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-gray-100 text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Add button */}
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-1.5 h-9 bg-brand-green text-white text-xs font-bold rounded-lg hover:bg-brand-green/90 transition-colors"
        >
          <FaPlus size={10} /> Add to My Webmixes
        </button>
      </div>
    </div>
  )
}

export default Webspaces
