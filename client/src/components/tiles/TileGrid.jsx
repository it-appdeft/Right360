import { useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import Tile from './Tile'
import TileGridSkeleton from './TileGridSkeleton'
import EditToolbar from './EditToolbar'
import useTileStore from '../../store/useTileStore'

function TileGrid({ categoryId }) {
  const { tiles, isLoading, isEditMode, fetchTiles, reorderTiles, clearTiles } = useTileStore()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  useEffect(() => {
    if (categoryId) {
      fetchTiles(categoryId)
    }
    return () => clearTiles()
  }, [categoryId, fetchTiles, clearTiles])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = tiles.findIndex((t) => t._id === active.id)
    const newIndex = tiles.findIndex((t) => t._id === over.id)
    const newTiles = arrayMove(tiles, oldIndex, newIndex)
    reorderTiles(newTiles)
  }

  if (isLoading) return <TileGridSkeleton />

  if (tiles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-white/70 text-sm">No tiles in this category yet.</p>
      </div>
    )
  }

  return (
    <div>
      <EditToolbar />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tiles.map((t) => t._id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5 sm:gap-3">
            {tiles.map((tile) => (
              <Tile key={tile._id} tile={tile} isEditMode={isEditMode} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default TileGrid
