import type { Categoria } from '../types/categoria'
import type { Ingrediente } from '../types/ingrediente'
import type { Producto, ProductoCreate } from '../types/producto'

interface Props {
  editando: Producto | null
  nombre: string
  descripcion: string
  precioBase: string
  stockCantidad: string
  disponible: boolean
  categoriaIds: number[]
  ingredienteIds: number[]
  categorias: Categoria[]
  ingredientes: Ingrediente[]
  onNombreChange: (v: string) => void
  onDescripcionChange: (v: string) => void
  onPrecioBaseChange: (v: string) => void
  onStockChange: (v: string) => void
  onDisponibleChange: (v: boolean) => void
  onToggleCategoria: (id: number) => void
  onToggleIngrediente: (id: number) => void
  onSubmit: () => void
  onClose: () => void
}

export default function ProductoModal({
  editando, nombre, descripcion, precioBase, stockCantidad, disponible,
  categoriaIds, ingredienteIds, categorias, ingredientes,
  onNombreChange, onDescripcionChange, onPrecioBaseChange, onStockChange,
  onDisponibleChange, onToggleCategoria, onToggleIngrediente, onSubmit, onClose
}: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editando ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input type="text" placeholder="Ej: Pizza Napolitana" value={nombre} onChange={e => onNombreChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input type="text" placeholder="Ej: Pizza con tomate..." value={descripcion} onChange={e => onDescripcionChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio base</label>
          <input type="number" placeholder="Ej: 1500" value={precioBase} onChange={e => onPrecioBaseChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input type="number" placeholder="Ej: 10" value={stockCantidad} onChange={e => onStockChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={disponible} onChange={e => onDisponibleChange(e.target.checked)} className="rounded" />
            <span className="text-sm font-medium text-gray-700">Disponible</span>
          </label>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Categorías</label>
          <div className="border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
            {categorias.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 mb-1 cursor-pointer">
                <input type="checkbox" checked={categoriaIds.includes(cat.id)} onChange={() => onToggleCategoria(cat.id)} className="rounded" />
                <span className="text-sm text-gray-700">{cat.nombre}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ingredientes</label>
          <div className="border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
            {ingredientes.map(ing => (
              <label key={ing.id} className="flex items-center gap-2 mb-1 cursor-pointer">
                <input type="checkbox" checked={ingredienteIds.includes(ing.id)} onChange={() => onToggleIngrediente(ing.id)} className="rounded" />
                <span className="text-sm text-gray-700">{ing.nombre}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">Cancelar</button>
          <button onClick={onSubmit} disabled={!nombre.trim() || !precioBase}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            {editando ? 'Guardar cambios' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  )
}