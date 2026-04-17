import { useState, useRef, useEffect } from 'react'
import { FaSearch, FaChevronDown, FaTimes, FaHistory } from 'react-icons/fa'
import useSearchStore from '../../store/useSearchStore'
import { getEngine, enginesByCategory } from '../../utils/searchEngines'

function SearchBar() {
  const {
    query, selectedEngine, recentSearches, isDropdownOpen,
    setQuery, setEngine, toggleDropdown, closeDropdown, executeSearch, clearRecent,
  } = useSearchStore()

  const [showRecent, setShowRecent] = useState(false)
  const dropdownRef = useRef(null)
  const recentRef = useRef(null)
  const inputRef = useRef(null)

  const currentEngine = getEngine(selectedEngine)
  const EngineIcon = currentEngine?.icon

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown()
      }
      if (recentRef.current && !recentRef.current.contains(e.target)) {
        setShowRecent(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [closeDropdown])

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    executeSearch()
    setShowRecent(false)
  }

  const handleRecentClick = (q) => {
    setQuery(q)
    setShowRecent(false)
    setTimeout(() => executeSearch(), 0)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full">
      {/* Engine Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleDropdown}
          className="flex items-center gap-1.5 h-10 pl-3 pr-2 rounded-l-full border border-r-0 border-border bg-surface text-text-primary hover:bg-page transition-colors"
        >
          {EngineIcon && <EngineIcon size={16} />}
          <FaChevronDown size={8} className="text-text-muted" />
        </button>

        {/* Engine Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-surface rounded-card shadow-tile-hover border border-border py-2 z-50 max-h-80 overflow-y-auto">
            {Object.entries(enginesByCategory).map(([category, engines]) => (
              <div key={category}>
                <p className="px-3 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  {category}
                </p>
                {engines.map((engine) => {
                  const Icon = engine.icon
                  return (
                    <button
                      key={engine.key}
                      type="button"
                      onClick={() => setEngine(engine.key)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                        selectedEngine === engine.key
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-text-primary hover:bg-page'
                      }`}
                    >
                      <Icon size={14} />
                      {engine.name}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative flex-1" ref={recentRef}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => recentSearches.length > 0 && setShowRecent(true)}
          placeholder={`Search with ${currentEngine?.name || 'Google'}...`}
          className="w-full h-10 px-4 border border-border bg-page text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary"
          >
            <FaTimes size={12} />
          </button>
        )}

        {/* Recent Searches */}
        {showRecent && recentSearches.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface rounded-card shadow-tile-hover border border-border py-1 z-50">
            <div className="flex items-center justify-between px-3 py-1.5">
              <span className="text-[10px] font-bold text-text-muted uppercase">Recent</span>
              <button
                type="button"
                onClick={clearRecent}
                className="text-[10px] text-primary hover:underline"
              >
                Clear
              </button>
            </div>
            {recentSearches.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleRecentClick(q)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-page transition-colors"
              >
                <FaHistory size={11} className="text-text-muted" />
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="h-10 px-4 rounded-r-full bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <FaSearch size={14} />
        <span className="hidden sm:inline text-sm">Search</span>
      </button>
    </form>
  )
}

export default SearchBar
