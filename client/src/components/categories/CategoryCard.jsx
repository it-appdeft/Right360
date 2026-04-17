import { Link } from 'react-router-dom'
import { getCategoryIcon } from '../../utils/categoryIcons'

const bgColors = [
  '#3F8ECF', '#7B5EA7', '#E8842A', '#4CAF50', '#D94444',
  '#6B9E3A', '#A0522D', '#45B7D1', '#FF6B6B', '#96CEB4',
]

function CategoryCard({ category, index = 0 }) {
  const Icon = getCategoryIcon(category.icon)
  const bgColor = bgColors[index % bgColors.length]

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col items-center gap-3 p-5 rounded-2xl transition-all hover:scale-105 hover:shadow-xl backdrop-blur-md bg-white/90"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md"
        style={{ backgroundColor: bgColor }}
      >
        <Icon size={24} />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-800">{category.name}</h3>
        {category.subcategories && category.subcategories.length > 0 && (
          <p className="text-[10px] text-gray-400 mt-0.5">
            {category.subcategories.length} subcategories
          </p>
        )}
      </div>
    </Link>
  )
}

export default CategoryCard
