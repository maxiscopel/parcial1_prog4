from fastapi import APIRouter, HTTPException, Query
from typing import Annotated, List, Optional
from app.schemas.producto_schema import ProductoCreate, ProductoRead, ProductoReadDetalle
from app.schemas.categoria_schema import CategoriaRead
from app.schemas.ingrediente_schema import IngredienteRead
from app.uow.uow import UnitOfWork
from app.services.producto_service import ProductoService

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.post("/", response_model=ProductoRead, status_code=201)
def crear_producto(datos: ProductoCreate):
    with UnitOfWork() as uow:
        service = ProductoService(uow)
        producto = service.crear(datos)
        uow.commit()
        uow.session.refresh(producto)
        return ProductoRead(
            id=producto.id,
            nombre=producto.nombre,
            descripcion=producto.descripcion,
            precio_base=producto.precio_base,
            stock_cantidad=producto.stock_cantidad,
            disponible=producto.disponible,
            created_at=producto.created_at,
            updated_at=producto.updated_at,
        )


@router.get("/", response_model=List[ProductoRead])
def listar_productos(
    nombre: Annotated[Optional[str], Query(description="Filtrar por nombre")] = None,
    precio_max: Annotated[Optional[float], Query(description="Precio máximo", gt=0)] = None,
    limit: Annotated[int, Query(description="Cantidad de resultados", le=100)] = 100,
    offset: Annotated[int, Query(description="Desplazamiento")] = 0
):
    with UnitOfWork() as uow:
        service = ProductoService(uow)
        return service.listar(
            nombre=nombre, precio_max=precio_max, limit=limit, offset=offset
        )


@router.get("/{producto_id}", response_model=ProductoReadDetalle)
def obtener_producto(producto_id: int):
    with UnitOfWork() as uow:
        service = ProductoService(uow)
        producto = service.obtener_por_id(producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        categorias = uow.productos.obtener_categorias(producto_id)
        ingredientes = uow.productos.obtener_ingredientes(producto_id)

        return ProductoReadDetalle(
            id=producto.id,
            nombre=producto.nombre,
            descripcion=producto.descripcion,
            precio_base=producto.precio_base,
            stock_cantidad=producto.stock_cantidad,
            disponible=producto.disponible,
            created_at=producto.created_at,
            updated_at=producto.updated_at,
            categorias=[CategoriaRead(
                id=c.id, nombre=c.nombre,
                created_at=c.created_at, updated_at=c.updated_at
            ) for c in categorias],
            ingredientes=[IngredienteRead(
                id=i.id, nombre=i.nombre,
                es_alergeno=i.es_alergeno,
                created_at=i.created_at, updated_at=i.updated_at
            ) for i in ingredientes]
        )


@router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(producto_id: int, datos: ProductoCreate):
    with UnitOfWork() as uow:
        service = ProductoService(uow)
        producto = service.obtener_por_id(producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        producto = service.actualizar(producto, datos)
        uow.commit()
        return ProductoRead(
            id=producto.id,
            nombre=producto.nombre,
            descripcion=producto.descripcion,
            precio_base=producto.precio_base,
            stock_cantidad=producto.stock_cantidad,
            disponible=producto.disponible,
            created_at=producto.created_at,
            updated_at=producto.updated_at,
        )


@router.delete("/{producto_id}", status_code=204)
def eliminar_producto(producto_id: int):
    with UnitOfWork() as uow:
        service = ProductoService(uow)
        producto = service.obtener_por_id(producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        service.eliminar(producto)
        uow.commit()