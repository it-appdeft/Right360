function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface rounded-card shadow-card p-4 ${hover ? 'hover:shadow-tile-hover transition-shadow cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
