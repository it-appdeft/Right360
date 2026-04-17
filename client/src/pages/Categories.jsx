import { useEffect } from 'react'
import useCategoryStore from '../store/useCategoryStore'
import CategoryCard from '../components/categories/CategoryCard'
import { PageLoader } from '../components/common/Loader'

function Categories() {
  const { categories, isLoading, fetchCategories } = useCategoryStore()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  if (isLoading) return <PageLoader />

  return (
    <div>
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-lg mb-6">
        <h1 className="text-xl font-heading font-bold text-gray-800">
          Explore Categories
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse websites organized by topic
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.map((category, index) => (
          <CategoryCard key={category._id} category={category} index={index} />
        ))}
      </div>
    </div>
  )
}

export default Categories
