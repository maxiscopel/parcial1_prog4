from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional

class Ingrediente(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str

    productos: List["ProductoIngrediente"] = Relationship(back_populates="ingrediente")