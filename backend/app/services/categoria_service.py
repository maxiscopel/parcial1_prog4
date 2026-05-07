from typing import Optional
from datetime import datetime
from app.models.categoria import Categoria
from app.schemas.categoria_schema import CategoriaCreate
from app.uow.uow import UnitOfWork


class CategoriaService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def crear(self, datos: CategoriaCreate) -> Categoria:
        categoria = Categoria(
            nombre=datos.nombre,
            descripcion=datos.descripcion,
            imagen_url=datos.imagen_url,
            parent_id=datos.parent_id,
        )
        return self.uow.categorias.crear(categoria)

    def listar(self, nombre=None, solo_activas=True, limit=100, offset=0):
        return self.uow.categorias.listar(
            nombre=nombre, solo_activas=solo_activas, limit=limit, offset=offset
        )

    def obtener_por_id(self, categoria_id: int) -> Optional[Categoria]:
        return self.uow.categorias.obtener_por_id(categoria_id)

    def actualizar(self, categoria: Categoria, datos: CategoriaCreate) -> Categoria:
        categoria.nombre = datos.nombre
        categoria.descripcion = datos.descripcion
        categoria.imagen_url = datos.imagen_url
        categoria.parent_id = datos.parent_id
        categoria.updated_at = datetime.utcnow()
        return categoria

    def eliminar(self, categoria: Categoria):
        categoria.deleted_at = datetime.utcnow()
        categoria.updated_at = datetime.utcnow()