import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FaFire, FaStar, FaBolt } from 'react-icons/fa'

// Vibrant Symbaloo-style tile colors
const tileColors = [
  '#FFD93D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FF8A5C', '#EA5455', '#7367F0', '#28C76F', '#FF9F43',
  '#00CFE8', '#A855F7', '#E8842A', '#3F8ECF', '#6B9E3A',
  '#D94444', '#7B5EA7', '#4CAF50', '#F97316', '#06B6D4',
]

const getTileColor = (title) => {
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash)
  }
  return tileColors[Math.abs(hash) % tileColors.length]
}

const trendIcons = {
  hot: <FaFire className="text-white" size={8} />,
  new: <FaStar className="text-white" size={8} />,
  trending: <FaBolt className="text-white" size={8} />,
}

const trendLabels = {
  hot: 'Hot',
  new: 'New',
  trending: 'Trending',
}

function Tile({ tile, isEditMode }) {
  const bgColor = getTileColor(tile.title)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tile._id, disabled: !isEditMode })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleClick = () => {
    if (!isEditMode) {
      window.open(tile.url, '_blank', 'noopener,noreferrer')
    }
  }

  const trend = tile.metadata?.trendIndicator
  const hasTrend = trend && trend !== 'none'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isEditMode ? listeners : {})}
      onClick={handleClick}
      className={`group relative flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer select-none aspect-square overflow-hidden
        ${isDragging ? 'opacity-50 scale-105 z-50' : ''}
        ${isEditMode ? 'cursor-grab active:cursor-grabbing ring-2 ring-dashed ring-white/50' : 'hover:scale-105 hover:shadow-lg'}
        ${tile.isSponsored ? 'ring-2 ring-brand-orange/60' : ''}
      `}
    >
      {/* Colored background */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ backgroundColor: bgColor }}
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-black/10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 p-2 w-full h-full">
        {/* Trend Badge */}
        {hasTrend && (
          <span className="absolute top-1 right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-black/30 text-[8px] font-bold text-white">
            {trendIcons[trend]}
            {trendLabels[trend]}
          </span>
        )}

        {/* Sponsored badge */}
        {tile.isSponsored && (
          <span className="absolute top-1 left-1 px-1 py-0.5 rounded text-[7px] font-bold text-white bg-black/30">
            AD
          </span>
        )}

        {/* Logo */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/90 flex items-center justify-center overflow-hidden shadow-sm">
          {tile.logo ? (
            <img
              src={tile.logo}
              alt={tile.title}
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML = `<span class="text-base font-bold" style="color:${bgColor}">${tile.title.charAt(0)}</span>`
              }}
            />
          ) : (
            <span className="text-base font-bold" style={{ color: bgColor }}>
              {tile.title.charAt(0)}
            </span>
          )}
        </div>

        {/* Title */}
        <p className="text-[10px] sm:text-xs font-bold text-white text-center leading-tight truncate w-full drop-shadow-sm">
          {tile.title}
        </p>

        {tile.subtitle && (
          <p className="text-[8px] text-white/70 text-center truncate w-full leading-tight">
            {tile.subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

export default Tile
