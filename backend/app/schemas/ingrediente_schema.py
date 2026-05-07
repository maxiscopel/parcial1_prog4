from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime


class IngredienteCreate(SQLModel):
    nombre: str
    descripcion: Optional[str] = None
    es_alergeno: bool = False


class IngredienteRead(SQLModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    es_alergeno: bool
    created_at: datetime
    updated_at: datetime