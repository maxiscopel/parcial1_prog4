import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../api/categorias'
import type { Categoria, CategoriaCreate } from '../types'

export default function Categorias() {
  const queryClient = useQueryClient()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [nombre, setNombre] = useState('')

  const { data: categorias, isLoading, isError } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
  })

  const crearMutation = useMutation({
    mutationFn: (data: CategoriaCreate) => createCategoria(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categorias'] }); cerrarModal() },
  })

  const editarMutation = useMutation({
    mutationFn: (data: CategoriaCreate) => updateCategoria(editando!.id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categorias'] }); cerrarModal() },
  })

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => deleteCategoria(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categorias'] }) },
  })

  const abrirModalNuevo = () => { setEditando(null); setNombre(''); setModalAbierto(true) }
  const abrirModalEditar = (c: Categoria) => { setEditando(c); setNombre(c.nombre); setModalAbierto(true) }
  const cerrarModal = () => { setModalAbierto(false); setEditando(null); setNombre('') }
  const handleSubmit = () => {
    if (!nombre.trim()) return
    editando ? editarMutation.mutate({ nombre }) : crearMutation.mutate({ nombre })
  }

  if (isLoading) return <div className="flex justify-center items-center h-40"><p className="text-gray-400 text-lg">Cargando categorías...</p></div>
  if (isError) return <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600">Error al cargar categorías</p></div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Categorías</h1>
          <p className="text-gray-500 mt-1">{categorias?.length} categorías registradas</p>
        </div>
        <button onClick={abrirModalNuevo} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow transition-colors w-full sm:w-auto">
          + Nueva Categoría
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        {/* Tabla desktop */}
        <table className="w-full hidden md:table">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categorias?.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-10 text-center text-gray-400">No hay categorías todavía. ¡Creá la primera!</td></tr>
            )}
            {categorias?.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-400 text-sm">#{cat.id}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{cat.nombre}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => abrirModalEditar(cat)} className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-sm hover:bg-amber-100 font-medium">Editar</button>
                  <button onClick={() => eliminarMutation.mutate(cat.id)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm hover:bg-red-100 font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tarjetas mobile */}
        <div className="md:hidden divide-y divide-gray-100">
          {categorias?.length === 0 && <p className="px-6 py-10 text-center text-gray-400">No hay categorías todavía. ¡Creá la primera!</p>}
          {categorias?.map(cat => (
            <div key={cat.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">#{cat.id}</p>
                <p className="font-medium text-gray-800">{cat.nombre}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => abrirModalEditar(cat)} className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-sm hover:bg-amber-100 font-medium">Editar</button>
                <button onClick={() => eliminarMutation.mutate(cat.id)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm hover:bg-red-100 font-medium">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{editando ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" placeholder="Ej: Pizzas, Bebidas..." value={nombre} onChange={e => setNombre(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={cerrarModal} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">Cancelar</button>
              <button onClick={handleSubmit} disabled={!nombre.trim()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {editando ? 'Guardar cambios' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}