import { Link } from 'react-router-dom'
import { FaHome, FaThLarge, FaCog, FaBookmark, FaHistory, FaPlus } from 'react-icons/fa'

const sidebarItems = [
  { icon: FaHome, to: '/', title: 'Home', color: '#3F8ECF' },
  { icon: FaThLarge, to: '/categories', title: 'Categories', color: '#7B5EA7' },
  { icon: FaBookmark, to: '#', title: 'Bookmarks', color: '#4CAF50' },
  { icon: FaHistory, to: '#', title: 'Recent', color: '#E8842A' },
  { icon: FaCog, to: '/settings', title: 'Settings', color: '#7A7A7A' },
]

function LeftSidebar() {
  return (
    <aside className="fixed left-0 top-[88px] bottom-0 w-12 flex flex-col items-center py-3 gap-2 z-40 hidden md:flex">
      <div className="bg-black/20 backdrop-blur-md rounded-r-xl py-3 px-1.5 flex flex-col gap-2">
        {sidebarItems.map(({ icon: Icon, to, title, color }) => (
          <Link
            key={title}
            to={to}
            title={title}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundColor: color + '33' }}
          >
            <Icon size={14} style={{ color }} />
          </Link>
        ))}
        <div className="w-6 h-px bg-white/20 mx-auto my-1" />
        <button
          title="Add Tile"
          className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all"
        >
          <FaPlus size={12} />
        </button>
      </div>
    </aside>
  )
}

export default LeftSidebar
