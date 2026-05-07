from typing import Optional
from datetime import datetime
from app.models.producto import Producto
from app.schemas.producto_schema import ProductoCreate
from app.uow.uow import UnitOfWork


class ProductoService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def crear(self, datos: ProductoCreate) -> Producto:
        producto = Producto(
            nombre=datos.nombre,
            descripcion=datos.descripcion,
            precio_base=datos.precio_base,
            stock_cantidad=datos.stock_cantidad,
            disponible=datos.disponible,
        )
        creado = self.uow.productos.crear(producto)
        self._asignar_relaciones(creado.id, datos.categoria_ids, datos.ingrediente_ids)
        return creado

    def listar(self, nombre=None, precio_max=None, solo_activos=True, limit=100, offset=0):
        return self.uow.productos.listar(
            nombre=nombre, precio_max=precio_max,
            solo_activos=solo_activos, limit=limit, offset=offset
        )

    def obtener_por_id(self, producto_id: int) -> Optional[Producto]:
        return self.uow.productos.obtener_por_id(producto_id)

    def actualizar(self, producto: Producto, datos: ProductoCreate) -> Producto:
        producto.nombre = datos.nombre
        producto.descripcion = datos.descripcion
        producto.precio_base = datos.precio_base
        producto.stock_cantidad = datos.stock_cantidad
        producto.disponible = datos.disponible
        producto.updated_at = datetime.utcnow()
        self.uow.productos.eliminar_categorias(producto.id)
        self.uow.productos.eliminar_ingredientes(producto.id)
        self.uow.commit()
        self._asignar_relaciones(producto.id, datos.categoria_ids, datos.ingrediente_ids)
        return producto

    def eliminar(self, producto: Producto):
        producto.deleted_at = datetime.utcnow()
        producto.updated_at = datetime.utcnow()

    def _asignar_relaciones(self, producto_id, categoria_ids, ingrediente_ids):
        for cat_id in categoria_ids:
            self.uow.productos.agregar_categoria(producto_id, cat_id)
        for ing_id in ingrediente_ids:
            self.uow.productos.agregar_ingrediente(producto_id, ing_id)