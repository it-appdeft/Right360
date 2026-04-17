import { FaTimes, FaPlus, FaPalette, FaTag, FaLayerGroup, FaRoute, FaCog, FaImage, FaGlobe, FaLock, FaPen } from 'react-icons/fa'
import useWebmixStore from '../../store/useWebmixStore'
import useTileStore from '../../store/useTileStore'

function WebmixSidebar({ onAddTile, onCustomize }) {
  const { activeWebmix, isSidebarOpen, closeSidebar, updateWebmix } = useWebmixStore()
  const { toggleEditMode, isEditMode } = useTileStore()

  if (!isSidebarOpen) return null

  const handleTogglePublic = async () => {
    if (activeWebmix && activeWebmix._id && !activeWebmix._id.startsWith('guest')) {
      await updateWebmix(activeWebmix._id, { isPublic: !activeWebmix.isPublic })
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[80] bg-black/20" onClick={closeSidebar} />

      {/* Panel */}
      <aside className="fixed left-0 top-[88px] bottom-0 w-64 bg-white shadow-2xl z-[81] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-purple to-brand-blue p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-bold text-sm">{activeWebmix?.name || 'My Webmix'}</h2>
            <button onClick={closeSidebar} className="p-1 rounded hover:bg-white/20">
              <FaTimes size={13} />
            </button>
          </div>
          <p className="text-[10px] text-white/60">
            Last updated: just now
          </p>
        </div>

        {/* Webmix Content */}
        <div className="p-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Webmix Content
          </h3>
          <div className="space-y-1">
            <SidebarItem
              icon={FaPlus}
              iconColor="#4CAF50"
              label="Add Tiles"
              description="Add a Tile from URL or our collection"
              onClick={onAddTile}
            />
            <SidebarItem
              icon={FaPalette}
              iconColor="#E8842A"
              label="Customize Tiles"
              description="Edit Tile colors and appearance"
              onClick={() => {
                if (!isEditMode) toggleEditMode()
                closeSidebar()
              }}
            />
            <SidebarItem
              icon={FaTag}
              iconColor="#3F8ECF"
              label="Markers"
              description="Mark Tiles with labels & colors"
            />
            <SidebarItem
              icon={FaLayerGroup}
              iconColor="#7B5EA7"
              label="Groups"
              description="Group Tiles together in one Tile"
            />
            <SidebarItem
              icon={FaRoute}
              iconColor="#D94444"
              label="Learning Paths"
              description="Create a Learning Path and add steps"
            />
          </div>
        </div>

        {/* Webmix Customization */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Webmix Customization
          </h3>
          <div className="space-y-1">
            <SidebarItem
              icon={FaCog}
              iconColor="#E8842A"
              label="General"
              description="Set Webmix name, color and icon"
              onClick={onCustomize}
            />
            <SidebarItem
              icon={FaImage}
              iconColor="#4CAF50"
              label="Background"
              description="Pick a background for this Webmix"
              onClick={onCustomize}
            />
          </div>
        </div>

        {/* Visibility */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Visibility
          </h3>
          <button
            onClick={handleTogglePublic}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {activeWebmix?.isPublic ? (
              <FaGlobe size={14} className="text-brand-green" />
            ) : (
              <FaLock size={14} className="text-gray-400" />
            )}
            <div className="text-left">
              <p className="text-xs font-medium text-gray-700">
                {activeWebmix?.isPublic ? 'Public' : 'Private'}
              </p>
              <p className="text-[10px] text-gray-400">
                {activeWebmix?.isPublic ? 'Visible to everyone' : 'Only visible to you'}
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  )
}

function SidebarItem({ icon: Icon, iconColor, label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-gray-50 transition-colors group"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconColor + '18' }}
      >
        <Icon size={14} style={{ color: iconColor }} />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">{label}</p>
        <p className="text-[10px] text-gray-400 leading-snug">{description}</p>
      </div>
    </button>
  )
}

export default WebmixSidebar
