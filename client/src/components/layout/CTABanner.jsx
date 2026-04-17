import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'

const CTA_KEY = 'right360_cta_dismissed'

function CTABanner() {
  const [visible, setVisible] = useState(!localStorage.getItem(CTA_KEY))

  if (!visible) return null

  const dismiss = () => {
    localStorage.setItem(CTA_KEY, 'true')
    setVisible(false)
  }

  return (
    <div className="relative bg-white/95 backdrop-blur-md rounded-xl shadow-card px-4 py-3 mb-4 flex items-center justify-between gap-4">
      <div className="flex-1">
        <h3 className="text-sm font-heading font-bold text-gray-800">
          Create your personal Right360
        </h3>
        <p className="text-[11px] text-gray-500 mt-0.5">
          Create and customize your own Webmixes, manage all resources, change the look and feel, and more!
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={dismiss}
          className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Close
        </button>
        <a
          href="/register"
          className="px-4 py-1.5 bg-brand-green text-white text-xs font-bold rounded-full hover:bg-brand-green/90 transition-colors"
        >
          Learn more
        </a>
      </div>
      <button onClick={dismiss} className="absolute top-1.5 right-1.5 p-1 text-gray-300 hover:text-gray-500">
        <FaTimes size={10} />
      </button>
    </div>
  )
}

export default CTABanner
