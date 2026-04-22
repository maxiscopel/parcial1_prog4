from typing import List, Optional
from sqlmodel import Session, select
from app.models.producto import Producto
from app.models.categoria import Categoria
from app.models.ingrediente import Ingrediente
from app.models.producto_categoria import ProductoCategoria
from app.models.producto_ingrediente import ProductoIngrediente


class ProductoRepository:
    def __init__(self, session: Session):
        self.session = session

    def crear(self, producto: Producto) -> Producto:
        self.session.add(producto)
        self.session.flush()
        self.session.refresh(producto)
        return producto

    def listar(self, nombre: Optional[str] = None, precio_max: Optional[float] = None, limit: int = 10, offset: int = 0) -> List[Producto]:
        query = select(Producto)
        if nombre:
            query = query.where(Producto.nombre.contains(nombre))
        if precio_max:
            query = query.where(Producto.precio <= precio_max)
        return self.session.exec(query.offset(offset).limit(limit)).all()

    def obtener_por_id(self, producto_id: int) -> Optional[Producto]:
        return self.session.get(Producto, producto_id)

    def obtener_categorias(self, producto_id: int) -> List[Categoria]:
        return self.session.exec(
            select(Categoria)
            .join(ProductoCategoria)
            .where(ProductoCategoria.producto_id == producto_id)
        ).all()

    def obtener_ingredientes(self, producto_id: int) -> List[Ingrediente]:
        return self.session.exec(
            select(Ingrediente)
            .join(ProductoIngrediente)
            .where(ProductoIngrediente.producto_id == producto_id)
        ).all()

    def agregar_categoria(self, producto_id: int, categoria_id: int):
        self.session.add(ProductoCategoria(producto_id=producto_id, categoria_id=categoria_id))

    def agregar_ingrediente(self, producto_id: int, ingrediente_id: int):
        self.session.add(ProductoIngrediente(producto_id=producto_id, ingrediente_id=ingrediente_id))

    def eliminar_categorias(self, producto_id: int):
        rels = self.session.exec(
            select(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id)
        ).all()
        for r in rels:
            self.session.delete(r)

    def eliminar_ingredientes(self, producto_id: int):
        rels = self.session.exec(
            select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
        ).all()
        for r in rels:
            self.session.delete(r)

    def eliminar(self, producto: Producto):
        self.session.delete(producto)