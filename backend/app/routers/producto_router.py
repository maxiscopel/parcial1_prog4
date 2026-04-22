from fastapi import APIRouter, HTTPException, Query
from typing import Annotated, List, Optional
from app.models.producto import Producto
from app.schemas.producto_schema import ProductoCreate, ProductoRead, ProductoReadDetalle
from app.schemas.categoria_schema import CategoriaRead
from app.schemas.ingrediente_schema import IngredienteRead
from app.uow.uow import UnitOfWork

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.post("/", response_model=ProductoRead, status_code=201)
def crear_producto(datos: ProductoCreate):
    with UnitOfWork() as uow:
        producto = uow.productos.crear(Producto(nombre=datos.nombre, precio=datos.precio))

        for cat_id in datos.categoria_ids:
            if not uow.categorias.obtener_por_id(cat_id):
                raise HTTPException(status_code=404, detail=f"Categoria {cat_id} no encontrada")
            uow.productos.agregar_categoria(producto.id, cat_id)

        for ing_id in datos.ingrediente_ids:
            if not uow.ingredientes.obtener_por_id(ing_id):
                raise HTTPException(status_code=404, detail=f"Ingrediente {ing_id} no encontrado")
            uow.productos.agregar_ingrediente(producto.id, ing_id)

        uow.commit()
        uow.session.refresh(producto)
        return producto


@router.get("/", response_model=List[ProductoRead])
def listar_productos(
    nombre: Annotated[Optional[str], Query(description="Filtrar por nombre")] = None,
    precio_max: Annotated[Optional[float], Query(description="Precio máximo", gt=0)] = None,
   limit: Annotated[int, Query(description="Cantidad de resultados", le=100)] = 100,
    offset: Annotated[int, Query(description="Desplazamiento")] = 0
):
    with UnitOfWork() as uow:
        return uow.productos.listar(nombre=nombre, precio_max=precio_max, limit=limit, offset=offset)


@router.get("/{producto_id}", response_model=ProductoReadDetalle)
def obtener_producto(producto_id: int):
    with UnitOfWork() as uow:
        producto = uow.productos.obtener_por_id(producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        categorias = uow.productos.obtener_categorias(producto_id)
        ingredientes = uow.productos.obtener_ingredientes(producto_id)

        return ProductoReadDetalle(
            id=producto.id,
            nombre=producto.nombre,
            precio=producto.precio,
            categorias=[CategoriaRead(id=c.id, nombre=c.nombre) for c in categorias],
            ingredientes=[IngredienteRead(id=i.id, nombre=i.nombre) for i in ingredientes]
        )


@router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(producto_id: int, datos: ProductoCreate):
    with UnitOfWork() as uow:
        producto = uow.productos.obtener_por_id(producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        producto.nombre = datos.nombre
        producto.precio = datos.precio

        uow.productos.eliminar_categorias(producto_id)
        uow.productos.eliminar_ingredientes(producto_id)
        uow.commit()

        for cat_id in datos.categoria_ids:
            if not uow.categorias.obtener_por_id(cat_id):
                raise HTTPException(status_code=404, detail=f"Categoria {cat_id} no encontrada")
            uow.productos.agregar_categoria(producto_id, cat_id)

        for ing_id in datos.ingrediente_ids:
            if not uow.ingredientes.obtener_por_id(ing_id):
                raise HTTPException(status_code=404, detail=f"Ingrediente {ing_id} no encontrado")
            uow.productos.agregar_ingrediente(producto_id, ing_id)

        uow.commit()
        uow.session.refresh(producto)
        return producto


@router.delete("/{producto_id}", status_code=204)
def eliminar_producto(producto_id: int):
    with UnitOfWork() as uow:
        producto = uow.productos.obtener_por_id(producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        uow.productos.eliminar_categorias(producto_id)
        uow.productos.eliminar_ingredientes(producto_id)
        uow.commit()
        uow.productos.eliminar(producto)
        uow.commit()