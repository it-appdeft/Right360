import { useState, useEffect, useRef } from 'react'
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from 'react-icons/fa'

const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url='
const FEED_URL = 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'

function NewsCarousel() {
  const [articles, setArticles] = useState([])
  const [current, setCurrent] = useState(0)
  const scrollRef = useRef(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${RSS_PROXY}${encodeURIComponent(FEED_URL)}`)
        const data = await res.json()
        if (data.status === 'ok' && data.items) {
          setArticles(data.items.slice(0, 9).map((item) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            thumbnail: item.thumbnail || item.enclosure?.link || '',
            source: item.author || 'News',
          })))
        }
      } catch {
        setArticles([])
      }
    }
    fetchNews()
  }, [])

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  // Show 3 articles at a time
  const visibleArticles = articles.slice(current, current + 3)
  const canPrev = current > 0
  const canNext = current + 3 < articles.length

  if (articles.length === 0) return null

  return (
    <div className="mb-4">
      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {Array.from({ length: Math.ceil(articles.length / 3) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i * 3)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              Math.floor(current / 3) === i ? 'w-4 bg-brand-green' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Cards row */}
      <div className="relative">
        {canPrev && (
          <button
            onClick={() => setCurrent(Math.max(0, current - 3))}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-7 h-7 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-600 hover:bg-white"
          >
            <FaChevronLeft size={10} />
          </button>
        )}

        <div className="grid grid-cols-3 gap-2">
          {visibleArticles.map((article, i) => (
            <a
              key={i}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] h-40"
            >
              {article.thumbnail ? (
                <img
                  src={article.thumbnail}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-purple to-brand-blue" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-[11px] font-bold text-white leading-snug line-clamp-2 drop-shadow-lg">
                  {article.title}
                </p>
                <p className="text-[9px] text-white/60 mt-1">
                  {article.source} · {timeAgo(article.pubDate)}
                </p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <FaExternalLinkAlt size={10} className="text-white/70" />
              </div>
            </a>
          ))}
        </div>

        {canNext && (
          <button
            onClick={() => setCurrent(Math.min(articles.length - 3, current + 3))}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-7 h-7 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-600 hover:bg-white"
          >
            <FaChevronRight size={10} />
          </button>
        )}
      </div>
    </div>
  )
}

export default NewsCarousel
