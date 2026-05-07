from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.ingrediente_schema import IngredienteCreate, IngredienteRead
from app.uow.uow import UnitOfWork
from app.services.ingrediente_service import IngredienteService

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])


@router.post("/", response_model=IngredienteRead, status_code=201)
def crear_ingrediente(datos: IngredienteCreate):
    with UnitOfWork() as uow:
        service = IngredienteService(uow)
        ingrediente = service.crear(datos)
        uow.commit()
        return IngredienteRead(
            id=ingrediente.id,
            nombre=ingrediente.nombre,
            descripcion=ingrediente.descripcion,
            es_alergeno=ingrediente.es_alergeno,
            created_at=ingrediente.created_at,
            updated_at=ingrediente.updated_at,
        )


@router.get("/", response_model=List[IngredienteRead])
def listar_ingredientes(
    nombre: Optional[str] = Query(default=None),
    limit: int = Query(default=100, le=100),
    offset: int = 0
):
    with UnitOfWork() as uow:
        service = IngredienteService(uow)
        return service.listar(nombre=nombre, limit=limit, offset=offset)


@router.get("/{ingrediente_id}", response_model=IngredienteRead)
def obtener_ingrediente(ingrediente_id: int):
    with UnitOfWork() as uow:
        service = IngredienteService(uow)
        ingrediente = service.obtener_por_id(ingrediente_id)
        if not ingrediente:
            raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
        return ingrediente


@router.put("/{ingrediente_id}", response_model=IngredienteRead)
def actualizar_ingrediente(ingrediente_id: int, datos: IngredienteCreate):
    with UnitOfWork() as uow:
        service = IngredienteService(uow)
        ingrediente = service.obtener_por_id(ingrediente_id)
        if not ingrediente:
            raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
        ingrediente = service.actualizar(ingrediente, datos)
        uow.commit()
        return IngredienteRead(
            id=ingrediente.id,
            nombre=ingrediente.nombre,
            descripcion=ingrediente.descripcion,
            es_alergeno=ingrediente.es_alergeno,
            created_at=ingrediente.created_at,
            updated_at=ingrediente.updated_at,
        )


@router.delete("/{ingrediente_id}", status_code=204)
def eliminar_ingrediente(ingrediente_id: int):
    with UnitOfWork() as uow:
        service = IngredienteService(uow)
        ingrediente = service.obtener_por_id(ingrediente_id)
        if not ingrediente:
            raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
        service.eliminar(ingrediente)
        uow.commit()