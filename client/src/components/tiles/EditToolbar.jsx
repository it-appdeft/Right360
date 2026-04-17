import { FaEdit, FaCheck } from 'react-icons/fa'
import useTileStore from '../../store/useTileStore'

function EditToolbar() {
  const { isEditMode, toggleEditMode } = useTileStore()

  return (
    <div className="flex items-center justify-end mb-3">
      <button
        onClick={toggleEditMode}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all backdrop-blur-sm ${
          isEditMode
            ? 'bg-success text-white shadow-lg'
            : 'bg-white/20 text-white/80 hover:bg-white/30 hover:text-white'
        }`}
      >
        {isEditMode ? (
          <>
            <FaCheck size={11} />
            Done
          </>
        ) : (
          <>
            <FaEdit size={11} />
            Edit
          </>
        )}
      </button>
    </div>
  )
}

export default EditToolbar
