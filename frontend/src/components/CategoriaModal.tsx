import type { Categoria, CategoriaCreate } from '../types/categoria'

interface Props {
  editando: Categoria | null
  nombre: string
  onNombreChange: (v: string) => void
  onSubmit: () => void
  onClose: () => void
}

export default function CategoriaModal({ editando, nombre, onNombreChange, onSubmit, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editando ? 'Editar Categoría' : 'Nueva Categoría'}
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            placeholder="Ej: Pizzas, Bebidas..."
            value={nombre}
            onChange={e => onNombreChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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