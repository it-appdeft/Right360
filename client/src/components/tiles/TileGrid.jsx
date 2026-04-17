import { useEffect, useState, useCallback } from 'react'
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
import { FaPlus } from 'react-icons/fa'
import Tile from './Tile'
import TileGridSkeleton from './TileGridSkeleton'
import EditToolbar from './EditToolbar'
import TileEditor from './TileEditor'
import TileContextMenu from './TileContextMenu'
import useTileStore from '../../store/useTileStore'
import { toast } from '../common/Toast'

function TileGrid({ categoryId }) {
  const { tiles, isLoading, isEditMode, fetchTiles, reorderTiles, clearTiles, addTile, removeTile } = useTileStore()
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingTile, setEditingTile] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  useEffect(() => {
    if (categoryId) fetchTiles(categoryId)
    return () => clearTiles()
  }, [categoryId, fetchTiles, clearTiles])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = tiles.findIndex((t) => t._id === active.id)
    const newIndex = tiles.findIndex((t) => t._id === over.id)
    reorderTiles(arrayMove(tiles, oldIndex, newIndex))
  }

  const handleContextMenu = useCallback((e, tile) => {
    setContextMenu({ x: e.clientX, y: e.clientY, tile })
  }, [])

  const handleEditTile = useCallback((tile) => {
    setEditingTile(tile)
    setEditorOpen(true)
  }, [])

  const handleAddTile = () => {
    setEditingTile(null)
    setEditorOpen(true)
  }

  const handleSaveTile = async (tileData) => {
    try {
      if (editingTile) {
        // Update existing tile via API
        await api.put(`/tiles/${editingTile._id}`, tileData)
        // Refresh tiles
        fetchTiles(categoryId)
        toast.success('Tile updated!')
      } else {
        await addTile({ ...tileData, categoryId })
        toast.success('Tile added!')
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save tile')
    }
  }

  const handleDeleteTile = async (tileId) => {
    try {
      await removeTile(tileId)
      toast.success('Tile removed')
    } catch (err) {
      toast.error(err.message || 'Failed to delete tile')
    }
  }

  if (isLoading) return <TileGridSkeleton />

  return (
    <div>
      <EditToolbar onAddTile={handleAddTile} categoryId={categoryId} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tiles.map((t) => t._id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5 sm:gap-3">
            {tiles.map((tile) => (
              <Tile
                key={tile._id}
                tile={tile}
                isEditMode={isEditMode}
                onContextMenu={handleContextMenu}
                onEdit={handleEditTile}
              />
            ))}

            {/* Add tile button */}
            {isEditMode && (
              <button
                onClick={handleAddTile}
                className="aspect-square rounded-2xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center gap-1.5 text-white/50 hover:text-white hover:border-white/60 hover:bg-white/10 transition-all"
              >
                <FaPlus size={18} />
                <span className="text-[10px] font-medium">Add Tile</span>
              </button>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Empty state */}
      {tiles.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="text-white/70 text-sm mb-3">No tiles in this category yet.</p>
          <button
            onClick={handleAddTile}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition-colors"
          >
            <FaPlus size={12} /> Add your first tile
          </button>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <TileContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          tile={contextMenu.tile}
          onClose={() => setContextMenu(null)}
          onEdit={handleEditTile}
          onDelete={handleDeleteTile}
          onOpenUrl={(url) => window.open(url, '_blank')}
        />
      )}

      {/* Tile Editor Modal */}
      <TileEditor
        isOpen={editorOpen}
        onClose={() => { setEditorOpen(false); setEditingTile(null) }}
        tile={editingTile}
        onSave={handleSaveTile}
        onDelete={handleDeleteTile}
        categoryId={categoryId}
      />
    </div>
  )
}

export default TileGrid
