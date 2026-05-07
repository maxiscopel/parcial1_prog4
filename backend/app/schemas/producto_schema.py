from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel
from pydantic import field_validator


class ProductoCreate(SQLModel):
    nombre: str
    descripcion: Optional[str] = None
    precio_base: float
    stock_cantidad: int = 0
    disponible: bool = True
    categoria_ids: List[int] = []
    ingrediente_ids: List[int] = []

    @field_validator('nombre')
    def nombre_no_vacio(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('El nombre debe tener al menos 2 caracteres')
        return v

    @field_validator('precio_base')
    def precio_positivo(cls, v):
        if v <= 0:
            raise ValueError('El precio debe ser mayor a 0')
        return v


class ProductoRead(SQLModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    precio_base: float
    stock_cantidad: int
    disponible: bool
    created_at: datetime
    updated_at: datetime


class ProductoReadDetalle(SQLModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    precio_base: float
    stock_cantidad: int
    disponible: bool
    created_at: datetime
    updated_at: datetime
    categorias: List["CategoriaRead"] = []
    ingredientes: List["IngredienteRead"] = []


from app.schemas.categoria_schema import CategoriaRead
from app.schemas.ingrediente_schema import IngredienteRead
ProductoReadDetalle.model_rebuild()