import { useEffect, useRef } from 'react'
import useAdStore from '../../store/useAdStore'

function SponsoredPanel() {
  const { currentPanelAd, fetchPanelAds, rotateAd, trackImpression, trackClick } = useAdStore()
  const tracked = useRef(new Set())

  useEffect(() => {
    fetchPanelAds()
  }, [fetchPanelAds])

  // Rotate every 30 seconds
  useEffect(() => {
    const interval = setInterval(rotateAd, 30000)
    return () => clearInterval(interval)
  }, [rotateAd])

  // Track impression
  useEffect(() => {
    if (currentPanelAd && !tracked.current.has(currentPanelAd._id)) {
      tracked.current.add(currentPanelAd._id)
      trackImpression(currentPanelAd._id)
    }
  }, [currentPanelAd, trackImpression])

  if (!currentPanelAd) return null

  const handleClick = () => {
    trackClick(currentPanelAd._id)
    window.open(currentPanelAd.link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      onClick={handleClick}
      className="relative w-full rounded-card overflow-hidden cursor-pointer group mb-6"
    >
      <div className="relative h-24 sm:h-32 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-between px-6">
        {currentPanelAd.image && (
          <img
            src={currentPanelAd.image}
            alt={currentPanelAd.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="relative z-10">
          <p className="text-sm font-semibold text-text-primary">{currentPanelAd.title}</p>
          {currentPanelAd.advertiser && (
            <p className="text-xs text-text-muted">{currentPanelAd.advertiser}</p>
          )}
        </div>
      </div>
      <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-semibold text-text-muted bg-surface/80 backdrop-blur-sm">
        Sponsored
      </span>
    </div>
  )
}

export default SponsoredPanel
