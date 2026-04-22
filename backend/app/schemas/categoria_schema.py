from sqlmodel import SQLModel

class CategoriaCreate(SQLModel):
    nombre: str

class CategoriaRead(SQLModel):
    id: int
    nombre: str