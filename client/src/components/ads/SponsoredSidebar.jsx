import { useEffect, useRef } from 'react'
import useAdStore from '../../store/useAdStore'

function SponsoredSidebar() {
  const { panelAds, fetchPanelAds, trackImpression, trackClick } = useAdStore()
  const tracked = useRef(new Set())

  useEffect(() => {
    fetchPanelAds()
  }, [fetchPanelAds])

  // Track impressions for visible ads
  useEffect(() => {
    panelAds.forEach((ad) => {
      if (!tracked.current.has(ad._id)) {
        tracked.current.add(ad._id)
        trackImpression(ad._id)
      }
    })
  }, [panelAds, trackImpression])

  const handleAdClick = (ad) => {
    trackClick(ad._id)
    window.open(ad.link, '_blank', 'noopener,noreferrer')
  }

  // Placeholder ads when no real ads exist
  const placeholderAds = [
    {
      _id: 'placeholder-1',
      title: 'Transform your productivity',
      advertiser: 'Right360 Premium',
      image: '',
      link: '#',
      bgColor: 'from-primary to-secondary',
    },
    {
      _id: 'placeholder-2',
      title: 'Discover new websites daily',
      advertiser: 'Right360',
      image: '',
      link: '#',
      bgColor: 'from-accent to-brand-red',
    },
  ]

  const displayAds = panelAds.length > 0 ? panelAds : placeholderAds

  return (
    <aside className="w-64 shrink-0 hidden xl:flex flex-col gap-3">
      {displayAds.slice(0, 3).map((ad) => (
        <div
          key={ad._id}
          onClick={() => ad.link !== '#' && handleAdClick(ad)}
          className={`relative rounded-xl overflow-hidden cursor-pointer group transition-transform hover:scale-[1.02] ${
            ad.link === '#' ? 'cursor-default' : ''
          }`}
        >
          {ad.image ? (
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className={`w-full h-40 bg-gradient-to-br ${ad.bgColor || 'from-primary to-secondary'} flex flex-col items-center justify-center p-4`}>
              <p className="text-white font-bold text-sm text-center leading-snug">
                {ad.title}
              </p>
              {ad.advertiser && (
                <p className="text-white/60 text-xs mt-2">{ad.advertiser}</p>
              )}
            </div>
          )}
          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold text-white/60 bg-black/30 backdrop-blur-sm">
            Sponsored
          </span>
        </div>
      ))}
    </aside>
  )
}

export default SponsoredSidebar
