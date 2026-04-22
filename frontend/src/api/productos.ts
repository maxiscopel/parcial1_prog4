import api from './index'
import type { Producto, ProductoCreate, ProductoDetalle } from '../types'

export const getProductos = () => api.get<Producto[]>('/productos/').then(r => r.data)
export const getProducto = (id: number) => api.get<ProductoDetalle>(`/productos/${id}`).then(r => r.data)
export const createProducto = (data: ProductoCreate) => api.post<Producto>('/productos/', data).then(r => r.data)
export const updateProducto = (id: number, data: ProductoCreate) => api.put<Producto>(`/productos/${id}`, data).then(r => r.data)
export const deleteProducto = (id: number) => api.delete(`/productos/${id}`)