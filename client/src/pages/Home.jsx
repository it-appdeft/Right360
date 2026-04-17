import { useEffect, useState } from 'react'
import useCategoryStore from '../store/useCategoryStore'
import useWebmixStore from '../store/useWebmixStore'
import useTileStore from '../store/useTileStore'
import useAuthStore from '../store/useAuthStore'
import TileGrid from '../components/tiles/TileGrid'
import EmbeddedSearch from '../components/search/EmbeddedSearch'
import SponsoredSidebar from '../components/ads/SponsoredSidebar'
import NewsFeedWidget from '../components/widgets/NewsFeedWidget'
import NewsCarousel from '../components/widgets/NewsCarousel'
import WeatherWidget from '../components/widgets/WeatherWidget'
import StocksWidget from '../components/widgets/StocksWidget'
import WebmixTabs from '../components/webmix/WebmixTabs'
import WebmixSidebar from '../components/webmix/WebmixSidebar'
import AddWebmixModal from '../components/webmix/AddWebmixModal'
import CTABanner from '../components/layout/CTABanner'
import { PageLoader } from '../components/common/Loader'

function Home() {
  const { categories, isLoading, fetchCategories } = useCategoryStore()
  const { fetchWebmixes, toggleSidebar, closeSidebar } = useWebmixStore()
  const { toggleEditMode } = useTileStore()
  const { isAuthenticated } = useAuthStore()
  const [showAddWebmix, setShowAddWebmix] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchWebmixes()
  }, [fetchCategories, fetchWebmixes])

  const firstCategory = categories[0]

  if (isLoading && categories.length === 0) return <PageLoader />

  const handleAddTileFromSidebar = () => {
    closeSidebar()
    toggleEditMode()
  }

  const handleCustomize = () => {
    closeSidebar()
    window.location.href = '/settings'
  }

  return (
    <div>
      {/* CTA Banner for non-authenticated users */}
      {!isAuthenticated && <CTABanner />}

      {/* Webmix Tabs */}
      <div className="flex items-center gap-3 mb-1">
        <WebmixTabs onAddWebmix={() => setShowAddWebmix(true)} />
        <button
          onClick={toggleSidebar}
          className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-white/15 text-white/70 hover:bg-white/25 hover:text-white transition-all backdrop-blur-sm"
        >
          ⚙ Edit Webmixes
        </button>
      </div>

      {/* News Carousel */}
      <NewsCarousel />

      {/* Main 3-column layout */}
      <div className="flex gap-4 items-start">
        {/* Left: News Feed */}
        <div className="w-56 shrink-0 hidden lg:block space-y-3">
          <NewsFeedWidget />
        </div>

        {/* Center: Search + Tile Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 max-w-md">
              <EmbeddedSearch />
            </div>
            <div className="w-56 hidden md:block">
              <WeatherWidget />
            </div>
          </div>

          {firstCategory && (
            <TileGrid categoryId={firstCategory._id} />
          )}
        </div>

        {/* Right: Sponsored + Stocks */}
        <div className="w-64 shrink-0 hidden xl:flex flex-col gap-3">
          <SponsoredSidebar />
          <StocksWidget />
        </div>
      </div>

      {/* Webmix Sidebar Panel */}
      <WebmixSidebar
        onAddTile={handleAddTileFromSidebar}
        onCustomize={handleCustomize}
      />

      {/* Add Webmix Modal */}
      <AddWebmixModal
        isOpen={showAddWebmix}
        onClose={() => setShowAddWebmix(false)}
      />
    </div>
  )
}

export default Home
