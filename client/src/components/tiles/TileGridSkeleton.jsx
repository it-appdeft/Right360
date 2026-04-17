function TileGridSkeleton() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5 sm:gap-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-2xl animate-pulse"
          style={{
            backgroundColor: `hsl(${(i * 37) % 360}, 60%, 75%)`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  )
}

export default TileGridSkeleton
