import type { Categoria } from './categoria'
import type { Ingrediente } from './ingrediente'

export interface Producto {
  id: number
  nombre: string
  descripcion?: string
  precio_base: number
  stock_cantidad: number
  disponible: boolean
  created_at: string
  updated_at: string
}

export interface ProductoCreate {
  nombre: string
  descripcion?: string
  precio_base: number
  stock_cantidad: number
  disponible: boolean
  categoria_ids: number[]
  ingrediente_ids: number[]
}

export interface ProductoDetalle {
  id: number
  nombre: string
  descripcion?: string
  precio_base: number
  stock_cantidad: number
  disponible: boolean
  created_at: string
  updated_at: string
  categorias: Categoria[]
  ingredientes: Ingrediente[]
}