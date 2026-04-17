import { useState } from 'react'
import { FaPlus, FaEllipsisH, FaTrash, FaPen, FaGlobe, FaLock } from 'react-icons/fa'
import useWebmixStore from '../../store/useWebmixStore'

function WebmixTabs({ onAddWebmix }) {
  const { webmixes, activeWebmix, setActiveWebmix } = useWebmixStore()
  const [menuOpen, setMenuOpen] = useState(null)

  return (
    <div className="flex items-center gap-1 mb-3 overflow-x-auto scrollbar-hide">
      {webmixes.map((wm) => {
        const isActive = activeWebmix?._id === wm._id
        return (
          <div key={wm._id} className="relative shrink-0">
            <button
              onClick={() => setActiveWebmix(wm)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all backdrop-blur-sm ${
                isActive
                  ? 'bg-white/90 text-gray-800 shadow-md'
                  : 'bg-white/15 text-white/70 hover:bg-white/25 hover:text-white'
              }`}
            >
              <span>{wm.icon || '📋'}</span>
              <span className="max-w-[80px] truncate">{wm.name}</span>
              {wm.isPublic && <FaGlobe size={8} className="text-brand-green opacity-70" />}
            </button>
          </div>
        )
      })}

      <button
        onClick={onAddWebmix}
        className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/50 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm"
      >
        <FaPlus size={9} />
      </button>
    </div>
  )
}

export default WebmixTabs
