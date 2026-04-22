import api from './index'
import type { Categoria, CategoriaCreate } from '../types'

export const getCategorias = () => api.get<Categoria[]>('/categorias/').then(r => r.data)
export const getCategoria = (id: number) => api.get<Categoria>(`/categorias/${id}`).then(r => r.data)
export const createCategoria = (data: CategoriaCreate) => api.post<Categoria>('/categorias/', data).then(r => r.data)
export const updateCategoria = (id: number, data: CategoriaCreate) => api.put<Categoria>(`/categorias/${id}`, data).then(r => r.data)
export const deleteCategoria = (id: number) => api.delete(`/categorias/${id}`).then(r => r.data)