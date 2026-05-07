from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship


class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    parent_id: Optional[int] = Field(default=None, foreign_key="categoria.id")
    nombre: str = Field(max_length=100)
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = Field(default=None)

    productos: List["ProductoCategoria"] = Relationship(back_populates="categoria")