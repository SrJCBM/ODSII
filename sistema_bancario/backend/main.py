from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import depositos, cuentas, cajeros
from app.config import settings

app = FastAPI(
    title="Banco Pichincha - API Depósitos",
    description="API REST para el módulo de depósitos del sistema bancario",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS para permitir requests desde el frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar el dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(depositos.router)
app.include_router(cuentas.router)
app.include_router(cajeros.router)

@app.get("/")
def root():
    return {
        "message": "Banco Pichincha - API Depósitos",
        "version": "1.0.0",
        "docs": "/docs",
        "grupo": "Grupo 2 - Depósitos"
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API funcionando correctamente"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )
