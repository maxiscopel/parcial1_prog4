# Parcial 1 - Programación IV

Aplicación Fullstack desarrollada con FastAPI + React para la materia Programación IV de la Tecnicatura Universitaria en Programación (UTN).

## Descripción

Sistema de gestión de productos con categorías e ingredientes. Permite crear, editar, eliminar y visualizar productos con sus relaciones N:N. El backend implementa el patrón Repository + Unit of Work para el acceso a datos.

## Tecnologías

*Backend:
- Python + FastAPI
- SQLModel + PostgreSQL
- Pydantic para validaciones con field_validator
- Patrón Repository + Unit of Work

*Frontend:
- React + TypeScript
- TanStack Query (useQuery / useMutation)
- React Router DOM con rutas dinámicas
- Tailwind CSS 4

## Estructura del Proyecto

├── backend/
│   └── app/
│       ├── models/
│       ├── routers/
│       ├── schemas/
│       ├── repositories/
│       ├── uow/
│       ├── database.py
│       └── main.py
└── frontend/
└── src/
├── api/
├── pages/
└── types/


link video: https://www.youtube.com/watch?v=7SCEQs3PVH8