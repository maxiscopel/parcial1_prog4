from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.categoria_schema import CategoriaCreate, CategoriaRead
from app.uow.uow import UnitOfWork
from app.services.categoria_service import CategoriaService

router = APIRouter(prefix="/categorias", tags=["Categorias"])


@router.post("/", response_model=CategoriaRead, status_code=201)
def crear_categoria(datos: CategoriaCreate):
    with UnitOfWork() as uow:
        service = CategoriaService(uow)
        categoria = service.crear(datos)
        uow.commit()
        return CategoriaRead(
            id=categoria.id,
            nombre=categoria.nombre,
            descripcion=categoria.descripcion,
            imagen_url=categoria.imagen_url,
            parent_id=categoria.parent_id,
            created_at=categoria.created_at,
            updated_at=categoria.updated_at,
        )


@router.get("/", response_model=List[CategoriaRead])
def listar_categorias(
    nombre: Optional[str] = Query(default=None),
    limit: int = Query(default=100, le=100),
    offset: int = 0
):
    with UnitOfWork() as uow:
        service = CategoriaService(uow)
        return service.listar(nombre=nombre, limit=limit, offset=offset)


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(categoria_id: int):
    with UnitOfWork() as uow:
        service = CategoriaService(uow)
        categoria = service.obtener_por_id(categoria_id)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoria no encontrada")
        return categoria


@router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(categoria_id: int, datos: CategoriaCreate):
    with UnitOfWork() as uow:
        service = CategoriaService(uow)
        categoria = service.obtener_por_id(categoria_id)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoria no encontrada")
        categoria = service.actualizar(categoria, datos)
        uow.commit()
        return CategoriaRead(
            id=categoria.id,
            nombre=categoria.nombre,
            descripcion=categoria.descripcion,
            imagen_url=categoria.imagen_url,
            parent_id=categoria.parent_id,
            created_at=categoria.created_at,
            updated_at=categoria.updated_at,
        )


@router.delete("/{categoria_id}", status_code=204)
def eliminar_categoria(categoria_id: int):
    with UnitOfWork() as uow:
        service = CategoriaService(uow)
        categoria = service.obtener_por_id(categoria_id)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoria no encontrada")
        service.eliminar(categoria)
        uow.commit()