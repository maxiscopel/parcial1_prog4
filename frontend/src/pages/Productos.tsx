import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProductos, createProducto, updateProducto, deleteProducto, getProducto } from '../api/productos'
import { getCategorias } from '../api/categorias'
import { getIngredientes } from '../api/ingredientes'
import type { Producto, ProductoCreate } from '../types'
import { useNavigate } from 'react-router-dom'

export default function Productos() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Producto | null>(null)
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoriaIds, setCategoriaIds] = useState<number[]>([])
  const [ingredienteIds, setIngredienteIds] = useState<number[]>([])

  const { data: productos, isLoading, isError } = useQuery({
    queryKey: ['productos'],
    queryFn: getProductos,
    staleTime: 0,
  })

  const { data: categorias } = useQuery({ queryKey: ['categorias'], queryFn: getCategorias })
  const { data: ingredientes } = useQuery({ queryKey: ['ingredientes'], queryFn: getIngredientes })

  const crearMutation = useMutation({
    mutationFn: (data: ProductoCreate) => createProducto(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); cerrarModal() },
  })

  const editarMutation = useMutation({
    mutationFn: (data: ProductoCreate) => updateProducto(editando!.id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); cerrarModal() },
  })

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => deleteProducto(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData(['productos'], (old: Producto[] | undefined) =>
        old ? old.filter(p => p.id !== id) : []
      )
    },
    onError: (error) => { console.error('Error:', error) },
  })

  const abrirModalNuevo = () => { setEditando(null); setNombre(''); setPrecio(''); setCategoriaIds([]); setIngredienteIds([]); setModalAbierto(true) }

  const abrirModalEditar = async (producto: Producto) => {
    const detalle = await getProducto(producto.id)
    setEditando(producto)
    setNombre(producto.nombre)
    setPrecio(producto.precio.toString())
    setCategoriaIds(detalle.categorias.map(c => c.id))
    setIngredienteIds(detalle.ingredientes.map(i => i.id))
    setModalAbierto(true)
  }

  const cerrarModal = () => { setModalAbierto(false); setEditando(null); setNombre(''); setPrecio(''); setCategoriaIds([]); setIngredienteIds([]) }

  const toggleId = (id: number, lista: number[], setLista: (l: number[]) => void) => {
    lista.includes(id) ? setLista(lista.filter(i => i !== id)) : setLista([...lista, id])
  }

  const handleSubmit = () => {
    if (!nombre.trim() || !precio) return
    const data: ProductoCreate = { nombre, precio: parseFloat(precio), categoria_ids: categoriaIds, ingrediente_ids: ingredienteIds }
    editando ? editarMutation.mutate(data) : crearMutation.mutate(data)
  }

  if (isLoading) return <div className="flex justify-center items-center h-40"><p className="text-gray-400 text-lg">Cargando productos...</p></div>
  if (isError) return <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600">Error al cargar productos</p></div>

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
          <p className="text-gray-500 mt-1">{productos?.length} productos registrados</p>
        </div>
        <button onClick={abrirModalNuevo} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow transition-colors w-full sm:w-auto">
          + Nuevo Producto
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        {/* Tabla desktop */}
        <table className="w-full hidden md:table">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {productos?.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400">No hay productos todavía. ¡Creá el primero!</td></tr>
            )}
            {productos?.map(prod => (
              <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-400 text-sm">#{prod.id}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{prod.nombre}</td>
                <td className="px-6 py-4 text-gray-600">${prod.precio.toLocaleString()}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => navigate(`/productos/${prod.id}`)} className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-100 font-medium">Ver</button>
                  <button onClick={() => abrirModalEditar(prod)} className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-sm hover:bg-amber-100 font-medium">Editar</button>
                  <button onClick={() => eliminarMutation.mutate(prod.id)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm hover:bg-red-100 font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tarjetas mobile */}
        <div className="md:hidden divide-y divide-gray-100">
          {productos?.length === 0 && <p className="px-6 py-10 text-center text-gray-400">No hay productos todavía. ¡Creá el primero!</p>}
          {productos?.map(prod => (
            <div key={prod.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-gray-400">#{prod.id}</p>
                  <p className="font-medium text-gray-800">{prod.nombre}</p>
                  <p className="text-gray-600 text-sm">${prod.precio.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => navigate(`/productos/${prod.id}`)} className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-100 font-medium">Ver</button>
                <button onClick={() => abrirModalEditar(prod)} className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-sm hover:bg-amber-100 font-medium">Editar</button>
                <button onClick={() => eliminarMutation.mutate(prod.id)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm hover:bg-red-100 font-medium">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" placeholder="Ej: Pizza Napolitana" value={nombre} onChange={e => setNombre(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input type="number" placeholder="Ej: 1500" value={precio} onChange={e => setPrecio(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Categorías</label>
              <div className="border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                {categorias?.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 mb-1 cursor-pointer">
                    <input type="checkbox" checked={categoriaIds.includes(cat.id)} onChange={() => toggleId(cat.id, categoriaIds, setCategoriaIds)} className="rounded" />
                    <span className="text-sm text-gray-700">{cat.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ingredientes</label>
              <div className="border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                {ingredientes?.map(ing => (
                  <label key={ing.id} className="flex items-center gap-2 mb-1 cursor-pointer">
                    <input type="checkbox" checked={ingredienteIds.includes(ing.id)} onChange={() => toggleId(ing.id, ingredienteIds, setIngredienteIds)} className="rounded" />
                    <span className="text-sm text-gray-700">{ing.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={cerrarModal} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">Cancelar</button>
              <button onClick={handleSubmit} disabled={!nombre.trim() || !precio} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {editando ? 'Guardar cambios' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}