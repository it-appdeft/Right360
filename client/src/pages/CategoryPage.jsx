import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaHome, FaChevronRight } from 'react-icons/fa'
import useCategoryStore from '../store/useCategoryStore'
import CategoryTabs from '../components/categories/CategoryTabs'
import TileGrid from '../components/tiles/TileGrid'
import EmbeddedSearch from '../components/search/EmbeddedSearch'
import SponsoredSidebar from '../components/ads/SponsoredSidebar'
import ArticleView from '../components/content/ArticleView'
import { PageLoader } from '../components/common/Loader'

function CategoryPage() {
  const { slug, tab = 'start' } = useParams()
  const { categories, activeCategory, isLoading, fetchCategories, fetchCategoryBySlug } = useCategoryStore()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    if (slug) {
      fetchCategoryBySlug(slug)
    }
  }, [slug, fetchCategoryBySlug])

  if (isLoading && !activeCategory) return <PageLoader />

  return (
    <div className="flex gap-4 items-start">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
          <Link to="/" className="hover:text-white transition-colors">
            <FaHome size={13} />
          </Link>
          <FaChevronRight size={10} />
          <Link to="/categories" className="hover:text-white transition-colors">
            Categories
          </Link>
          {activeCategory && (
            <>
              <FaChevronRight size={10} />
              <span className="text-white font-medium">{activeCategory.name}</span>
            </>
          )}
        </nav>

        {activeCategory && (
          <>
            <CategoryTabs activeTab={tab} />

            {/* Tab Content */}
            {tab === 'start' && (
              <>
                <div className="mb-4 max-w-md">
                  <EmbeddedSearch />
                </div>
                <TileGrid categoryId={activeCategory._id} />
              </>
            )}
            {tab === 'perspective' && (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                <ArticleView categoryId={activeCategory._id} type="perspective" />
              </div>
            )}
            {tab === 'info' && (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg">
                <ArticleView categoryId={activeCategory._id} type="informational" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Ads */}
      <SponsoredSidebar />
    </div>
  )
}

export default CategoryPage
