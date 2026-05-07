# Parcial 1 - Programación IV

Aplicación Fullstack desarrollada con **FastAPI + React** para la materia Programación IV de la Tecnicatura Universitaria en Programación (UTN).

## Descripción

Sistema de gestión de productos con categorías e ingredientes. Permite crear, editar, eliminar y visualizar productos con sus relaciones N:N. El backend implementa el patrón Repository + Unit of Work para el acceso a datos. Los modelos incluyen borrado lógico y relación reflexiva en Categoría.

## Tecnologías

**Backend:**
- Python + FastAPI
- SQLModel + PostgreSQL
- Pydantic para validaciones con field_validator
- Patrón Repository + Unit of Work
- Services para lógica de negocio
- Borrado lógico con deleted_at

**Frontend:**
- React + TypeScript
- TanStack Query (useQuery / useMutation)
- React Router DOM con rutas dinámicas
- Tailwind CSS 4
- Componentes de modal separados

## Estructura del Proyecto

├── backend/
│   └── app/
│       ├── models/
│       ├── routers/
│       ├── schemas/
│       ├── repositories/
│       ├── services/
│       ├── uow/
│       ├── database.py
│       └── main.py


└── frontend/
      └── src/
      ├── api/
      ├── components/
      ├── pages/
      └── types/


      
## Cómo correr el proyecto

**Backend:**
bash
cd backend
"python -m uvicorn app.main:app --reload"


**Frontend:**
bash
cd frontend
"npm run dev"



link video: https://www.youtube.com/watch?v=7SCEQs3PVH8
