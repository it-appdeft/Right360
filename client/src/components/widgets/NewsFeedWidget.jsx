import { useState, useEffect } from 'react'
import { FaNewspaper, FaExternalLinkAlt, FaSync, FaChevronDown } from 'react-icons/fa'

// Free news sources using RSS-to-JSON converters
const NEWS_FEEDS = {
  'Top News': 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
  'Technology': 'https://feeds.feedburner.com/TechCrunch/',
  'World': 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
}

const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url='

function NewsFeedWidget() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Top News')
  const [expanded, setExpanded] = useState(true)

  const fetchNews = async (category) => {
    setLoading(true)
    try {
      const feedUrl = NEWS_FEEDS[category]
      const res = await fetch(`${RSS_PROXY}${encodeURIComponent(feedUrl)}`)
      const data = await res.json()

      if (data.status === 'ok' && data.items) {
        setArticles(data.items.slice(0, 6).map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          thumbnail: item.thumbnail || item.enclosure?.link || '',
          source: item.author || category,
        })))
      }
    } catch {
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews(activeCategory)
  }, [activeCategory])

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-orange to-brand-red cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 text-white">
          <FaNewspaper size={14} />
          <span className="text-sm font-bold">News feeds</span>
        </div>
        <FaChevronDown
          size={11}
          className={`text-white/70 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      {expanded && (
        <>
          {/* Category tabs */}
          <div className="flex gap-1 px-3 py-2 border-b border-gray-100">
            {Object.keys(NEWS_FEEDS).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => fetchNews(activeCategory)}
              className="ml-auto p-1 text-gray-400 hover:text-primary transition-colors"
              title="Refresh"
            >
              <FaSync size={10} />
            </button>
          </div>

          {/* Articles */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-3">
                    <div className="w-16 h-12 bg-gray-200 rounded" />
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {articles.map((article, i) => (
                  <a
                    key={i}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                  >
                    {article.thumbnail && (
                      <img
                        src={article.thumbnail}
                        alt=""
                        className="w-16 h-12 object-cover rounded shrink-0"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-1">
                        {article.source} · {timeAgo(article.pubDate)}
                      </p>
                    </div>
                    <FaExternalLinkAlt size={8} className="text-gray-300 shrink-0 mt-1 opacity-0 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-center text-xs text-gray-400 py-6">No articles available</p>
            )}
          </div>

          {/* Learn more link */}
          <div className="px-4 py-2 border-t border-gray-100 text-center">
            <button className="text-[10px] text-primary font-medium hover:underline">
              Learn more ↗
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default NewsFeedWidget
