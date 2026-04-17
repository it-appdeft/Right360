import { useEffect } from 'react'
import { FaEye, FaUser, FaClock } from 'react-icons/fa'
import useContentStore from '../../store/useContentStore'
import { PageLoader } from '../common/Loader'

function ArticleView({ categoryId, type }) {
  const { currentArticle, isLoading, fetchArticle, clearArticle } = useContentStore()

  useEffect(() => {
    if (categoryId && type) {
      fetchArticle(categoryId, type)
    }
    return () => clearArticle()
  }, [categoryId, type, fetchArticle, clearArticle])

  if (isLoading) return <PageLoader />

  if (!currentArticle) {
    return (
      <div className="text-center py-16">
        <p className="text-text-muted">
          No {type === 'perspective' ? 'perspective' : 'informational'} article available for this category yet.
        </p>
      </div>
    )
  }

  return (
    <article className="max-w-3xl">
      {/* Perspective badge */}
      {type === 'perspective' && currentArticle.perspective && (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-purple/10 text-brand-purple mb-4">
          {currentArticle.perspective} Perspective
        </span>
      )}

      {/* Cover image */}
      {currentArticle.coverImage && (
        <img
          src={currentArticle.coverImage}
          alt={currentArticle.title}
          className="w-full h-48 object-cover rounded-card mb-6"
        />
      )}

      {/* Title */}
      <h2 className="text-2xl font-heading font-bold text-text-primary mb-3">
        {currentArticle.title}
      </h2>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-text-muted mb-6">
        <span className="flex items-center gap-1">
          <FaUser size={10} />
          {currentArticle.author}
        </span>
        <span className="flex items-center gap-1">
          <FaClock size={10} />
          {new Date(currentArticle.updatedAt || currentArticle.createdAt).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <FaEye size={10} />
          {currentArticle.viewCount} views
        </span>
      </div>

      {/* Summary */}
      {currentArticle.summary && (
        <p className="text-text-muted italic mb-6 border-l-3 border-primary pl-4">
          {currentArticle.summary}
        </p>
      )}

      {/* Content */}
      <div
        className="prose prose-sm max-w-none text-text-primary"
        dangerouslySetInnerHTML={{ __html: currentArticle.content }}
      />

      {/* Tags */}
      {currentArticle.tags && currentArticle.tags.length > 0 && (
        <div className="flex gap-2 mt-8 pt-6 border-t border-border">
          {currentArticle.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded text-xs bg-page text-text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}

export default ArticleView
