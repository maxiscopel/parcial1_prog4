import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProductos, createProducto, updateProducto, deleteProducto, getProducto } from '../api/productos'
import { getCategorias } from '../api/categorias'
import { getIngredientes } from '../api/ingredientes'
import type { Producto, ProductoCreate } from '../types/producto'
import { useNavigate } from 'react-router-dom'
import ProductoModal from '../components/ProductoModal'

export default function Productos() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Producto | null>(null)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precioBase, setPrecioBase] = useState('')
  const [stockCantidad, setStockCantidad] = useState('')
  const [disponible, setDisponible] = useState(true)
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

  const abrirModalNuevo = () => {
    setEditando(null); setNombre(''); setDescripcion(''); setPrecioBase('')
    setStockCantidad(''); setDisponible(true); setCategoriaIds([]); setIngredienteIds([])
    setModalAbierto(true)
  }

  const abrirModalEditar = async (producto: Producto) => {
    const detalle = await getProducto(producto.id)
    setEditando(producto)
    setNombre(producto.nombre)
    setDescripcion(producto.descripcion ?? '')
    setPrecioBase(producto.precio_base.toString())
    setStockCantidad(producto.stock_cantidad.toString())
    setDisponible(producto.disponible)
    setCategoriaIds(detalle.categorias.map(c => c.id))
    setIngredienteIds(detalle.ingredientes.map(i => i.id))
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false); setEditando(null); setNombre(''); setDescripcion('')
    setPrecioBase(''); setStockCantidad(''); setDisponible(true); setCategoriaIds([]); setIngredienteIds([])
  }

  const toggleCategoria = (id: number) => setCategoriaIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  const toggleIngrediente = (id: number) => setIngredienteIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const handleSubmit = () => {
    if (!nombre.trim() || !precioBase) return
    const data: ProductoCreate = {
      nombre, descripcion, precio_base: parseFloat(precioBase),
      stock_cantidad: parseInt(stockCantidad) || 0,
      disponible, categoria_ids: categoriaIds, ingrediente_ids: ingredienteIds
    }
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
        <table className="w-full hidden md:table">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Disponible</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {productos?.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">No hay productos todavía. ¡Creá el primero!</td></tr>
            )}
            {productos?.map(prod => (
              <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-400 text-sm">#{prod.id}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{prod.nombre}</td>
                <td className="px-6 py-4 text-gray-600">${prod.precio_base.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-600">{prod.stock_cantidad}</td>
                <td className="px-6 py-4">
                  {prod.disponible
                    ? <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-xs font-medium">Sí</span>
                    : <span className="bg-red-100 text-red-500 px-2 py-0.5 rounded text-xs font-medium">No</span>}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => navigate(`/productos/${prod.id}`)} className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-100 font-medium">Ver</button>
                  <button onClick={() => abrirModalEditar(prod)} className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-sm hover:bg-amber-100 font-medium">Editar</button>
                  <button onClick={() => eliminarMutation.mutate(prod.id)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm hover:bg-red-100 font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="md:hidden divide-y divide-gray-100">
          {productos?.length === 0 && <p className="px-6 py-10 text-center text-gray-400">No hay productos todavía. ¡Creá el primero!</p>}
          {productos?.map(prod => (
            <div key={prod.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-gray-400">#{prod.id}</p>
                  <p className="font-medium text-gray-800">{prod.nombre}</p>
                  <p className="text-gray-600 text-sm">${prod.precio_base.toLocaleString()}</p>
                </div>
                {prod.disponible
                  ? <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-xs font-medium">Disponible</span>
                  : <span className="bg-red-100 text-red-500 px-2 py-0.5 rounded text-xs font-medium">No disponible</span>}
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
        <ProductoModal
          editando={editando}
          nombre={nombre}
          descripcion={descripcion}
          precioBase={precioBase}
          stockCantidad={stockCantidad}
          disponible={disponible}
          categoriaIds={categoriaIds}
          ingredienteIds={ingredienteIds}
          categorias={categorias ?? []}
          ingredientes={ingredientes ?? []}
          onNombreChange={setNombre}
          onDescripcionChange={setDescripcion}
          onPrecioBaseChange={setPrecioBase}
          onStockChange={setStockCantidad}
          onDisponibleChange={setDisponible}
          onToggleCategoria={toggleCategoria}
          onToggleIngrediente={toggleIngrediente}
          onSubmit={handleSubmit}
          onClose={cerrarModal}
        />
      )}
    </div>
  )
}