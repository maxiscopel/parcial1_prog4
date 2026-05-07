import type { Ingrediente, IngredienteCreate } from '../types/ingrediente'

interface Props {
  editando: Ingrediente | null
  nombre: string
  descripcion: string
  esAlergeno: boolean
  onNombreChange: (v: string) => void
  onDescripcionChange: (v: string) => void
  onEsAlergenoChange: (v: boolean) => void
  onSubmit: () => void
  onClose: () => void
}

export default function IngredienteModal({ editando, nombre, descripcion, esAlergeno, onNombreChange, onDescripcionChange, onEsAlergenoChange, onSubmit, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editando ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
        </h2>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            placeholder="Ej: Tomate, Queso..."
            value={nombre}
            onChange={e => onNombreChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input
            type="text"
            placeholder="Ej: Tomate fresco..."
            value={descripcion}
            onChange={e => onDescripcionChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={esAlergeno}
              onChange={e => onEsAlergenoChange(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">Es alérgeno</span>
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={!nombre.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editando ? 'Guardar cambios' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  )
}