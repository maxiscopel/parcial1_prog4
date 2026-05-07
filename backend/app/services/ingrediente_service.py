from typing import Optional
from datetime import datetime
from app.models.ingrediente import Ingrediente
from app.schemas.ingrediente_schema import IngredienteCreate
from app.uow.uow import UnitOfWork


class IngredienteService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def crear(self, datos: IngredienteCreate) -> Ingrediente:
        ingrediente = Ingrediente(
            nombre=datos.nombre,
            descripcion=datos.descripcion,
            es_alergeno=datos.es_alergeno,
        )
        return self.uow.ingredientes.crear(ingrediente)

    def listar(self, nombre=None, limit=100, offset=0):
        return self.uow.ingredientes.listar(nombre=nombre, limit=limit, offset=offset)

    def obtener_por_id(self, ingrediente_id: int) -> Optional[Ingrediente]:
        return self.uow.ingredientes.obtener_por_id(ingrediente_id)

    def actualizar(self, ingrediente: Ingrediente, datos: IngredienteCreate) -> Ingrediente:
        ingrediente.nombre = datos.nombre
        ingrediente.descripcion = datos.descripcion
        ingrediente.es_alergeno = datos.es_alergeno
        ingrediente.updated_at = datetime.utcnow()
        return ingrediente

    def eliminar(self, ingrediente: Ingrediente):
        self.uow.ingredientes.eliminar_relaciones(ingrediente.id)
        self.uow.ingredientes.eliminar(ingrediente)