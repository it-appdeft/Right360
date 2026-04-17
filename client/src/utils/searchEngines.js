import {
  FaGoogle, FaYahoo, FaYoutube, FaAmazon, FaReddit,
  FaStackOverflow, FaGithub, FaPinterest, FaWikipediaW,
  FaGraduationCap, FaMapMarkerAlt, FaMicrosoft,
} from 'react-icons/fa'
import {
  SiDuckduckgo, SiBrave, SiEbay,
} from 'react-icons/si'
import { FaXTwitter } from 'react-icons/fa6'

const searchEngines = [
  // General
  { key: 'google', name: 'Google', icon: FaGoogle, searchUrl: 'https://www.google.com/search?q=', category: 'General' },
  { key: 'bing', name: 'Bing', icon: FaMicrosoft, searchUrl: 'https://www.bing.com/search?q=', category: 'General' },
  { key: 'yahoo', name: 'Yahoo', icon: FaYahoo, searchUrl: 'https://search.yahoo.com/search?p=', category: 'General' },
  { key: 'duckduckgo', name: 'DuckDuckGo', icon: SiDuckduckgo, searchUrl: 'https://duckduckgo.com/?q=', category: 'General' },
  { key: 'brave', name: 'Brave', icon: SiBrave, searchUrl: 'https://search.brave.com/search?q=', category: 'General' },

  // Video
  { key: 'youtube', name: 'YouTube', icon: FaYoutube, searchUrl: 'https://www.youtube.com/results?search_query=', category: 'Video' },

  // Shopping
  { key: 'amazon', name: 'Amazon', icon: FaAmazon, searchUrl: 'https://www.amazon.com/s?k=', category: 'Shopping' },
  { key: 'ebay', name: 'eBay', icon: SiEbay, searchUrl: 'https://www.ebay.com/sch/i.html?_nkw=', category: 'Shopping' },

  // Social
  { key: 'reddit', name: 'Reddit', icon: FaReddit, searchUrl: 'https://www.reddit.com/search/?q=', category: 'Social' },
  { key: 'twitter', name: 'X (Twitter)', icon: FaXTwitter, searchUrl: 'https://twitter.com/search?q=', category: 'Social' },
  { key: 'pinterest', name: 'Pinterest', icon: FaPinterest, searchUrl: 'https://www.pinterest.com/search/pins/?q=', category: 'Social' },

  // Knowledge
  { key: 'wikipedia', name: 'Wikipedia', icon: FaWikipediaW, searchUrl: 'https://en.wikipedia.org/wiki/Special:Search?search=', category: 'Knowledge' },
  { key: 'stackoverflow', name: 'Stack Overflow', icon: FaStackOverflow, searchUrl: 'https://stackoverflow.com/search?q=', category: 'Knowledge' },
  { key: 'github', name: 'GitHub', icon: FaGithub, searchUrl: 'https://github.com/search?q=', category: 'Knowledge' },
  { key: 'scholar', name: 'Google Scholar', icon: FaGraduationCap, searchUrl: 'https://scholar.google.com/scholar?q=', category: 'Knowledge' },

  // Maps
  { key: 'maps', name: 'Google Maps', icon: FaMapMarkerAlt, searchUrl: 'https://www.google.com/maps/search/', category: 'Maps' },
]

export const enginesByCategory = searchEngines.reduce((acc, engine) => {
  if (!acc[engine.category]) acc[engine.category] = []
  acc[engine.category].push(engine)
  return acc
}, {})

export const getEngine = (key) => searchEngines.find((e) => e.key === key)

export default searchEngines
