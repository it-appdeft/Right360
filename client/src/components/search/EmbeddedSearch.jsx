import { FaSearch, FaChevronDown } from 'react-icons/fa'
import useSearchStore from '../../store/useSearchStore'
import { getEngine, enginesByCategory } from '../../utils/searchEngines'
import { useState, useRef, useEffect } from 'react'

function EmbeddedSearch() {
  const {
    query, selectedEngine, setQuery, setEngine, executeSearch,
  } = useSearchStore()

  const [showEngines, setShowEngines] = useState(false)
  const dropdownRef = useRef(null)
  const currentEngine = getEngine(selectedEngine)
  const EngineIcon = currentEngine?.icon

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowEngines(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    executeSearch()
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg">
      {/* Engine label */}
      <div className="relative mb-3" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setShowEngines(!showEngines)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
        >
          {EngineIcon && <EngineIcon size={18} className="text-primary" />}
          <span>{currentEngine?.name}</span>
          <FaChevronDown size={9} className="text-gray-400" />
        </button>

        {showEngines && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-64 overflow-y-auto">
            {Object.entries(enginesByCategory).map(([category, engines]) => (
              <div key={category}>
                <p className="px-3 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  {category}
                </p>
                {engines.map((engine) => {
                  const Icon = engine.icon
                  return (
                    <button
                      key={engine.key}
                      type="button"
                      onClick={() => {
                        setEngine(engine.key)
                        setShowEngines(false)
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
                        selectedEngine === engine.key
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={12} />
                      {engine.name}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web..."
          className="flex-1 h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <button
          type="submit"
          className="h-9 px-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FaSearch size={13} />
        </button>
      </form>
    </div>
  )
}

export default EmbeddedSearch
