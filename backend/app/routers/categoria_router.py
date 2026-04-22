from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models.categoria import Categoria
from app.schemas.categoria_schema import CategoriaCreate, CategoriaRead
from app.uow.uow import UnitOfWork

router = APIRouter(prefix="/categorias", tags=["Categorias"])


@router.post("/", response_model=CategoriaRead, status_code=201)
def crear_categoria(datos: CategoriaCreate):
    with UnitOfWork() as uow:
        categoria = uow.categorias.crear(Categoria(nombre=datos.nombre))
        uow.commit()
        return CategoriaRead(id=categoria.id, nombre=categoria.nombre)


@router.get("/", response_model=List[CategoriaRead])
def listar_categorias(
    nombre: Optional[str] = Query(default=None),
    limit: int = Query(default=100, le=100),
    offset: int = 0
):
    with UnitOfWork() as uow:
        return uow.categorias.listar(nombre=nombre, limit=limit, offset=offset)


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(categoria_id: int):
    with UnitOfWork() as uow:
        categoria = uow.categorias.obtener_por_id(categoria_id)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoria no encontrada")
        return categoria


@router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(categoria_id: int, datos: CategoriaCreate):
    with UnitOfWork() as uow:
        categoria = uow.categorias.obtener_por_id(categoria_id)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoria no encontrada")
        categoria.nombre = datos.nombre
        uow.commit()
        return CategoriaRead(id=categoria.id, nombre=categoria.nombre)


@router.delete("/{categoria_id}", status_code=204)
def eliminar_categoria(categoria_id: int):
    with UnitOfWork() as uow:
        categoria = uow.categorias.obtener_por_id(categoria_id)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoria no encontrada")
        uow.categorias.eliminar_relaciones(categoria_id)
        uow.categorias.eliminar(categoria)
        uow.commit()