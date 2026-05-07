from typing import List, Optional
from sqlmodel import Session, select
from app.models.categoria import Categoria
from app.models.producto_categoria import ProductoCategoria


class CategoriaRepository:
    def __init__(self, session: Session):
        self.session = session

    def crear(self, categoria: Categoria) -> Categoria:
        self.session.add(categoria)
        self.session.flush()
        self.session.refresh(categoria)
        return categoria

    def listar(self, nombre: Optional[str] = None, solo_activas: bool = True, limit: int = 100, offset: int = 0) -> List[Categoria]:
        query = select(Categoria)
        if solo_activas:
            query = query.where(Categoria.deleted_at == None)
        if nombre:
            query = query.where(Categoria.nombre.contains(nombre))
        return self.session.exec(query.offset(offset).limit(limit)).all()

    def obtener_por_id(self, categoria_id: int) -> Optional[Categoria]:
        return self.session.exec(
            select(Categoria).where(
                Categoria.id == categoria_id,
                Categoria.deleted_at == None
            )
        ).first()

    def eliminar_relaciones(self, categoria_id: int):
        rels = self.session.exec(
            select(ProductoCategoria).where(ProductoCategoria.categoria_id == categoria_id)
        ).all()
        for r in rels:
            self.session.delete(r)

    def eliminar(self, categoria: Categoria):
        self.session.delete(categoria)