import { useNavigate, useParams } from 'react-router-dom'

const tabs = [
  { key: 'start', label: 'Start Page' },
  { key: 'perspective', label: 'Perspective' },
  { key: 'info', label: 'Info' },
]

function CategoryTabs({ activeTab = 'start' }) {
  const navigate = useNavigate()
  const { slug } = useParams()

  const handleTabClick = (tabKey) => {
    if (tabKey === 'start') {
      navigate(`/category/${slug}`)
    } else {
      navigate(`/category/${slug}/${tabKey}`)
    }
  }

  return (
    <div className="flex gap-1 bg-black/20 backdrop-blur-md rounded-xl p-1 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleTabClick(tab.key)}
          className={`flex-1 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === tab.key
              ? 'bg-white/90 text-gray-800 shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryTabs
