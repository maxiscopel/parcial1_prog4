from sqlmodel import SQLModel

class IngredienteCreate(SQLModel):
    nombre: str

class IngredienteRead(SQLModel):
    id: int
    nombre: str