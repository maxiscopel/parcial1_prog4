import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProducto } from '../api/productos'

export default function ProductoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: producto, isLoading, isError } = useQuery({
    queryKey: ['producto', id],
    queryFn: () => getProducto(Number(id)),
    enabled: !!id,
  })

  if (isLoading) return <p className="text-gray-500">Cargando...</p>
  if (isError || !producto) return <p className="text-red-500">Producto no encontrado</p>

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={() => navigate('/productos')}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Volver a Productos
      </button>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{producto.nombre}</h1>
        {producto.descripcion && (
          <p className="text-gray-500 mb-3">{producto.descripcion}</p>
        )}
        <p className="mb-2 text-lg">
          <span className="font-semibold">Precio:</span> ${producto.precio_base.toLocaleString()}
        </p>
        <p className="mb-3">
          <span className="font-semibold">Stock:</span> {producto.stock_cantidad} unidades —{' '}
          {producto.disponible
            ? <span className="text-green-600 font-medium">Disponible</span>
            : <span className="text-red-500 font-medium">No disponible</span>}
        </p>
        <div className="mb-3">
          <p className="font-semibold mb-1">Categorías:</p>
          {producto.categorias.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {producto.categorias.map(c => (
                <span key={c.id} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {c.nombre}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Sin categorías</p>
          )}
        </div>
        <div>
          <p className="font-semibold mb-1">Ingredientes:</p>
          {producto.ingredientes.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {producto.ingredientes.map(i => (
                <span key={i.id} className={`px-3 py-1 rounded-full text-sm ${i.es_alergeno ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {i.nombre}{i.es_alergeno ? ' ⚠️' : ''}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Sin ingredientes</p>
          )}
        </div>
      </div>
    </div>
  )
}