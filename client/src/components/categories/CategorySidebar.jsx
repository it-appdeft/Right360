import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { getCategoryIcon } from '../../utils/categoryIcons'

function CategorySidebar({ categories }) {
  const { slug } = useParams()
  const [expanded, setExpanded] = useState({})

  const toggleExpand = (catId) => {
    setExpanded((prev) => ({ ...prev, [catId]: !prev[catId] }))
  }

  return (
    <aside className="w-56 shrink-0 hidden lg:block">
      <div className="bg-surface rounded-card shadow-card p-3 sticky top-24">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 mb-2">
          Categories
        </h3>
        <nav className="space-y-0.5">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.icon)
            const isActive = cat.slug === slug
            const hasSubs = cat.subcategories && cat.subcategories.length > 0
            const isExpanded = expanded[cat._id]

            return (
              <div key={cat._id}>
                <div className="flex items-center">
                  <Link
                    to={`/category/${cat.slug}`}
                    className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-card text-sm transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-text-primary hover:bg-page'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-primary' : 'text-text-muted'} />
                    {cat.name}
                  </Link>
                  {hasSubs && (
                    <button
                      onClick={() => toggleExpand(cat._id)}
                      className="p-1.5 text-text-muted hover:text-text-primary"
                    >
                      {isExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                    </button>
                  )}
                </div>

                {hasSubs && isExpanded && (
                  <div className="ml-5 pl-3 border-l border-border space-y-0.5 mt-0.5">
                    {cat.subcategories.map((sub) => {
                      const SubIcon = getCategoryIcon(sub.icon)
                      return (
                        <Link
                          key={sub._id}
                          to={`/category/${sub.slug}`}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-card text-xs transition-colors ${
                            sub.slug === slug
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-text-muted hover:text-text-primary hover:bg-page'
                          }`}
                        >
                          <SubIcon size={11} />
                          {sub.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export default CategorySidebar
