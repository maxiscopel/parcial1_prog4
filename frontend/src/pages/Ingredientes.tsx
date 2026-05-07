import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getIngredientes, createIngrediente, updateIngrediente, deleteIngrediente } from '../api/ingredientes'
import type { Ingrediente, IngredienteCreate } from '../types/ingrediente'
import IngredienteModal from '../components/IngredienteModal'

export default function Ingredientes() {
  const queryClient = useQueryClient()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Ingrediente | null>(null)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [esAlergeno, setEsAlergeno] = useState(false)

  const { data: ingredientes, isLoading, isError } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: getIngredientes,
  })

  const crearMutation = useMutation({
    mutationFn: (data: IngredienteCreate) => createIngrediente(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); cerrarModal() },
  })

  const editarMutation = useMutation({
    mutationFn: (data: IngredienteCreate) => updateIngrediente(editando!.id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); cerrarModal() },
  })

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => deleteIngrediente(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ingredientes'] }) },
  })

  const abrirModalNuevo = () => { setEditando(null); setNombre(''); setDescripcion(''); setEsAlergeno(false); setModalAbierto(true) }
  const abrirModalEditar = (i: Ingrediente) => {
    setEditando(i); setNombre(i.nombre)
    setDescripcion(i.descripcion ?? '')
    setEsAlergeno(i.es_alergeno)
    setModalAbierto(true)
  }
  const cerrarModal = () => { setModalAbierto(false); setEditando(null); setNombre(''); setDescripcion(''); setEsAlergeno(false) }
  const handleSubmit = () => {
    if (!nombre.trim()) return
    const data: IngredienteCreate = { nombre, descripcion, es_alergeno: esAlergeno }
    editando ? editarMutation.mutate(data) : crearMutation.mutate(data)
  }

  if (isLoading) return <div className="flex justify-center items-center h-40"><p className="text-gray-400 text-lg">Cargando ingredientes...</p></div>
  if (isError) return <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600">Error al cargar ingredientes</p></div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ingredientes</h1>
          <p className="text-gray-500 mt-1">{ingredientes?.length} ingredientes registrados</p>
        </div>
        <button onClick={abrirModalNuevo} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow transition-colors w-full sm:w-auto">
          + Nuevo Ingrediente
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <table className="w-full hidden md:table">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Alérgeno</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ingredientes?.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400">No hay ingredientes todavía. ¡Creá el primero!</td></tr>
            )}
            {ingredientes?.map(ing => (
              <tr key={ing.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-400 text-sm">#{ing.id}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{ing.nombre}</td>
                <td className="px-6 py-4">
                  {ing.es_alergeno
                    ? <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-medium">Sí</span>
                    : <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs">No</span>}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => abrirModalEditar(ing)} className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-sm hover:bg-amber-100 font-medium">Editar</button>
                  <button onClick={() => eliminarMutation.mutate(ing.id)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm hover:bg-red-100 font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="md:hidden divide-y divide-gray-100">
          {ingredientes?.length === 0 && <p className="px-6 py-10 text-center text-gray-400">No hay ingredientes todavía. ¡Creá el primero!</p>}
          {ingredientes?.map(ing => (
            <div key={ing.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">#{ing.id}</p>
                <p className="font-medium text-gray-800">{ing.nombre}</p>
                {ing.es_alergeno && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-medium">Alérgeno</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => abrirModalEditar(ing)} className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-sm hover:bg-amber-100 font-medium">Editar</button>
                <button onClick={() => eliminarMutation.mutate(ing.id)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm hover:bg-red-100 font-medium">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalAbierto && (
        <IngredienteModal
          editando={editando}
          nombre={nombre}
          descripcion={descripcion}
          esAlergeno={esAlergeno}
          onNombreChange={setNombre}
          onDescripcionChange={setDescripcion}
          onEsAlergenoChange={setEsAlergeno}
          onSubmit={handleSubmit}
          onClose={cerrarModal}
        />
      )}
    </div>
  )
}