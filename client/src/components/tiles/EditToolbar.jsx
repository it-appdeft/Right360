import { FaEdit, FaCheck, FaPlus, FaSave } from 'react-icons/fa'
import useTileStore from '../../store/useTileStore'
import { toast } from '../common/Toast'

function EditToolbar({ onAddTile, categoryId }) {
  const { isEditMode, toggleEditMode, saveLayout } = useTileStore()

  const handleToggle = async () => {
    if (isEditMode && categoryId) {
      // Save layout when exiting edit mode
      await saveLayout(categoryId)
      toast.success('Layout saved!')
    }
    toggleEditMode()
  }

  return (
    <div className="flex items-center justify-end gap-2 mb-3">
      {isEditMode && (
        <>
          <button
            onClick={onAddTile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/20 text-white hover:bg-white/30 transition-all backdrop-blur-sm"
          >
            <FaPlus size={10} />
            Add Tile
          </button>
        </>
      )}
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all backdrop-blur-sm ${
          isEditMode
            ? 'bg-success text-white shadow-lg'
            : 'bg-white/20 text-white/80 hover:bg-white/30 hover:text-white'
        }`}
      >
        {isEditMode ? (
          <><FaCheck size={11} /> Save & Done</>
        ) : (
          <><FaEdit size={11} /> Edit</>
        )}
      </button>
    </div>
  )
}

export default EditToolbar
