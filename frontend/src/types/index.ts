export interface Categoria {
  id: number
  nombre: string
}

export interface CategoriaCreate {
  nombre: string
}

export interface Ingrediente {
  id: number
  nombre: string
}

export interface IngredienteCreate {
  nombre: string
}

export interface Producto {
  id: number
  nombre: string
  precio: number
}

export interface ProductoCreate {
  nombre: string
  precio: number
  categoria_ids: number[]
  ingrediente_ids: number[]
}

export interface ProductoDetalle {
  id: number
  nombre: string
  precio: number
  categorias: Categoria[]
  ingredientes: Ingrediente[]
}