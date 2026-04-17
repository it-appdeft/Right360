function Loader({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span
        className={`animate-spin rounded-full border-primary border-t-transparent ${sizes[size]}`}
      />
    </div>
  )
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader size="lg" />
    </div>
  )
}

function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-border/50 rounded-card ${className}`} />
  )
}

export { Loader, PageLoader, Skeleton }
export default Loader
