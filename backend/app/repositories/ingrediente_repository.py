from typing import List, Optional
from sqlmodel import Session, select
from app.models.ingrediente import Ingrediente
from app.models.producto_ingrediente import ProductoIngrediente


class IngredienteRepository:
    def __init__(self, session: Session):
        self.session = session

    def crear(self, ingrediente: Ingrediente) -> Ingrediente:
        self.session.add(ingrediente)
        self.session.flush()
        self.session.refresh(ingrediente)
        return ingrediente

    def listar(self, nombre: Optional[str] = None, limit: int = 10, offset: int = 0) -> List[Ingrediente]:
        query = select(Ingrediente)
        if nombre:
            query = query.where(Ingrediente.nombre.contains(nombre))
        return self.session.exec(query.offset(offset).limit(limit)).all()

    def obtener_por_id(self, ingrediente_id: int) -> Optional[Ingrediente]:
        return self.session.get(Ingrediente, ingrediente_id)

    def eliminar_relaciones(self, ingrediente_id: int):
        rels = self.session.exec(
            select(ProductoIngrediente).where(ProductoIngrediente.ingrediente_id == ingrediente_id)
        ).all()
        for r in rels:
            self.session.delete(r)

    def eliminar(self, ingrediente: Ingrediente):
        self.session.delete(ingrediente)