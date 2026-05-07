from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

class Ingrediente(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=100)
    descripcion: Optional[str] = None
    es_alergeno: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    productos: List["ProductoIngrediente"] = Relationship(back_populates="ingrediente")