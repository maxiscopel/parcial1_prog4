from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional

class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str

    productos: List["ProductoCategoria"] = Relationship(back_populates="categoria")