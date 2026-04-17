import { useEffect } from 'react'
import useCategoryStore from '../store/useCategoryStore'
import TileGrid from '../components/tiles/TileGrid'
import EmbeddedSearch from '../components/search/EmbeddedSearch'
import SponsoredSidebar from '../components/ads/SponsoredSidebar'
import NewsFeedWidget from '../components/widgets/NewsFeedWidget'
import WeatherWidget from '../components/widgets/WeatherWidget'
import StocksWidget from '../components/widgets/StocksWidget'
import { PageLoader } from '../components/common/Loader'

function Home() {
  const { categories, isLoading, fetchCategories } = useCategoryStore()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const firstCategory = categories[0]

  if (isLoading && categories.length === 0) return <PageLoader />

  return (
    <div className="flex gap-4 items-start">
      {/* Left: News Feed */}
      <div className="w-56 shrink-0 hidden lg:block space-y-3">
        <NewsFeedWidget />
      </div>

      {/* Center: Search + Tile Grid */}
      <div className="flex-1 min-w-0">
        {/* Embedded search + Weather row */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 max-w-md">
            <EmbeddedSearch />
          </div>
          <div className="w-56 hidden md:block">
            <WeatherWidget />
          </div>
        </div>

        {/* Tile Grid */}
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
  )
}

export default Home
