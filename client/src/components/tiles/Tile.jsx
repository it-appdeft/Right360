import { useState, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FaFire, FaStar, FaBolt, FaInfoCircle, FaChevronDown, FaExternalLinkAlt, FaBalanceScale } from 'react-icons/fa'

const tileColors = [
  '#FFD93D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FF8A5C', '#EA5455', '#7367F0', '#28C76F', '#FF9F43',
  '#00CFE8', '#A855F7', '#E8842A', '#3F8ECF', '#6B9E3A',
  '#D94444', '#7B5EA7', '#4CAF50', '#F97316', '#06B6D4',
]

const getTileColor = (title, customColor) => {
  if (customColor) return customColor
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

function Tile({ tile, isEditMode, onContextMenu, onEdit }) {
  const [showInfo, setShowInfo] = useState(false)
  const [showSubLinks, setShowSubLinks] = useState(false)
  const bgColor = getTileColor(tile.title, tile.bgColor)
  const infoRef = useRef(null)

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

  const handleClick = (e) => {
    if (isEditMode) {
      onEdit?.(tile)
    } else {
      window.open(tile.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    onContextMenu?.(e, tile)
  }

  const trend = tile.metadata?.trendIndicator
  const hasTrend = trend && trend !== 'none'
  const hasSubLinks = tile.metadata?.subLinks?.length > 0
  const hasInfoPanel = !!tile.metadata?.infoPanel
  const hasBias = !!tile.metadata?.biasIndicator

  // Determine grid span for size
  const sizeClasses = {
    '1x1': '',
    '2x2': 'col-span-2 row-span-2',
    '4x4': 'col-span-4 row-span-4',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isEditMode ? listeners : {})}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`group relative flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer select-none aspect-square overflow-hidden
        ${sizeClasses[tile.size] || ''}
        ${isDragging ? 'opacity-50 scale-105 z-50' : ''}
        ${isEditMode ? 'cursor-grab active:cursor-grabbing ring-2 ring-dashed ring-white/50' : 'hover:scale-105 hover:shadow-lg'}
        ${tile.isSponsored ? 'ring-2 ring-brand-orange/60' : ''}
      `}
    >
      {/* Colored background */}
      <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: bgColor }} />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-black/10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 p-2 w-full h-full">
        {/* Trend Badge */}
        {hasTrend && (
          <span className="absolute top-1 right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-black/30 text-[8px] font-bold text-white">
            {trendIcons[trend]}
            <span className="capitalize">{trend}</span>
          </span>
        )}

        {/* Bias Indicator */}
        {hasBias && (
          <span className="absolute top-1 left-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-black/30 text-[7px] font-bold text-white">
            <FaBalanceScale size={7} />
            {tile.metadata.biasIndicator}
          </span>
        )}

        {/* Sponsored badge */}
        {tile.isSponsored && !hasBias && (
          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[7px] font-bold text-white bg-black/30">
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

        {/* Sub-links trigger */}
        {hasSubLinks && !isEditMode && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowSubLinks(!showSubLinks)
            }}
            className="absolute bottom-1 right-1 p-1 text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaChevronDown size={9} />
          </button>
        )}

        {/* Info panel trigger */}
        {hasInfoPanel && !isEditMode && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowInfo(!showInfo)
            }}
            className="absolute bottom-1 left-1 p-1 text-white/40 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaInfoCircle size={9} />
          </button>
        )}

        {/* Edit mode indicator */}
        {isEditMode && (
          <div className="absolute inset-0 rounded-2xl bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-[10px] font-bold bg-black/40 px-2 py-1 rounded">Click to edit</span>
          </div>
        )}
      </div>

      {/* Info Panel Popup */}
      {showInfo && hasInfoPanel && (
        <div
          ref={infoRef}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 p-3 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 text-left"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs font-semibold text-gray-800 mb-1">{tile.title}</p>
          <p className="text-[11px] text-gray-600 leading-relaxed">{tile.metadata.infoPanel}</p>
          {hasBias && (
            <p className="text-[10px] text-brand-purple mt-2 font-medium">
              <FaBalanceScale className="inline mr-1" size={9} />
              {tile.metadata.biasIndicator}
            </p>
          )}
        </div>
      )}

      {/* Sub-links Dropdown */}
      {showSubLinks && hasSubLinks && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {tile.metadata.subLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FaExternalLinkAlt size={9} className="text-gray-300" />
              {link.title}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tile
