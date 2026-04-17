import { useEffect } from 'react'
import useCategoryStore from '../store/useCategoryStore'
import TileGrid from '../components/tiles/TileGrid'
import EmbeddedSearch from '../components/search/EmbeddedSearch'
import SponsoredSidebar from '../components/ads/SponsoredSidebar'
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
      {/* Main content area */}
      <div className="flex-1 min-w-0">
        {/* Embedded search */}
        <div className="mb-4 max-w-md">
          <EmbeddedSearch />
        </div>

        {/* Tile Grid */}
        {firstCategory && (
          <TileGrid categoryId={firstCategory._id} />
        )}
      </div>

      {/* Right sponsored sidebar */}
      <SponsoredSidebar />
    </div>
  )
}

export default Home
