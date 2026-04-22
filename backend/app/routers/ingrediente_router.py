from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models.ingrediente import Ingrediente
from app.schemas.ingrediente_schema import IngredienteCreate, IngredienteRead
from app.uow.uow import UnitOfWork

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])


@router.post("/", response_model=IngredienteRead, status_code=201)
def crear_ingrediente(datos: IngredienteCreate):
    with UnitOfWork() as uow:
        ingrediente = uow.ingredientes.crear(Ingrediente(nombre=datos.nombre))
        uow.commit()
        return IngredienteRead(id=ingrediente.id, nombre=ingrediente.nombre)

@router.get("/", response_model=List[IngredienteRead])
def listar_ingredientes(
    nombre: Optional[str] = Query(default=None),
   limit: int = Query(default=100, le=100),
    offset: int = 0
):
    with UnitOfWork() as uow:
        return uow.ingredientes.listar(nombre=nombre, limit=limit, offset=offset)


@router.get("/{ingrediente_id}", response_model=IngredienteRead)
def obtener_ingrediente(ingrediente_id: int):
    with UnitOfWork() as uow:
        ingrediente = uow.ingredientes.obtener_por_id(ingrediente_id)
        if not ingrediente:
            raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
        return ingrediente


@router.put("/{ingrediente_id}", response_model=IngredienteRead)
def actualizar_ingrediente(ingrediente_id: int, datos: IngredienteCreate):
    with UnitOfWork() as uow:
        ingrediente = uow.ingredientes.obtener_por_id(ingrediente_id)
        if not ingrediente:
            raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
        ingrediente.nombre = datos.nombre
        uow.commit()
        return IngredienteRead(id=ingrediente.id, nombre=ingrediente.nombre)


@router.delete("/{ingrediente_id}", status_code=204)
def eliminar_ingrediente(ingrediente_id: int):
    with UnitOfWork() as uow:
        ingrediente = uow.ingredientes.obtener_por_id(ingrediente_id)
        if not ingrediente:
            raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
        uow.ingredientes.eliminar_relaciones(ingrediente_id)
        uow.ingredientes.eliminar(ingrediente)
        uow.commit()