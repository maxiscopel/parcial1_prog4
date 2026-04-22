import api from './index'
import type { Ingrediente, IngredienteCreate } from '../types'

export const getIngredientes = () => api.get<Ingrediente[]>('/ingredientes/').then(r => r.data)
export const getIngrediente = (id: number) => api.get<Ingrediente>(`/ingredientes/${id}`).then(r => r.data)
export const createIngrediente = (data: IngredienteCreate) => api.post<Ingrediente>('/ingredientes/', data).then(r => r.data)
export const updateIngrediente = (id: number, data: IngredienteCreate) => api.put<Ingrediente>(`/ingredientes/${id}`, data).then(r => r.data)
export const deleteIngrediente = (id: number) => api.delete(`/ingredientes/${id}`).then(r => r.data)