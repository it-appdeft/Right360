import { FaEdit, FaTrash, FaExternalLinkAlt, FaCopy, FaExpand, FaInfoCircle } from 'react-icons/fa'

function TileContextMenu({ x, y, tile, onClose, onEdit, onDelete, onOpenUrl }) {
  return (
    <>
      <div className="fixed inset-0 z-[150]" onClick={onClose} />
      <div
        className="fixed z-[151] w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 animate-in"
        style={{ top: y, left: x }}
      >
        <button
          onClick={() => { onOpenUrl(tile.url); onClose() }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FaExternalLinkAlt size={12} className="text-gray-400" />
          Open Link
        </button>
        <button
          onClick={() => { navigator.clipboard.writeText(tile.url); onClose() }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FaCopy size={12} className="text-gray-400" />
          Copy URL
        </button>
        <div className="h-px bg-gray-100 mx-2 my-1" />
        <button
          onClick={() => { onEdit(tile); onClose() }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FaEdit size={12} className="text-gray-400" />
          Edit Tile
        </button>
        <button
          onClick={() => { onDelete(tile._id); onClose() }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
        >
          <FaTrash size={12} />
          Delete Tile
        </button>
      </div>
    </>
  )
}

export default TileContextMenu
