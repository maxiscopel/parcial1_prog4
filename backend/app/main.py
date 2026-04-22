from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db
from app import models
from app.routers.categoria_router import router as categoria_router
from app.routers.ingrediente_router import router as ingrediente_router
from app.routers.producto_router import router as producto_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db()

app.include_router(categoria_router)
app.include_router(ingrediente_router)
app.include_router(producto_router)

@app.get("/")
def root():
    return {"mensaje": "API funcionando"}