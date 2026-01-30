from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Cajero
from app.schemas import CajeroResponse

router = APIRouter(prefix="/api/cajeros", tags=["Cajeros"])

@router.get("/", response_model=List[CajeroResponse])
def listar_cajeros(db: Session = Depends(get_db)):
    """
    Lista todos los cajeros activos que permiten depósitos
    """
    cajeros = db.query(Cajero).filter(
        Cajero.activo == True,
        Cajero.depositos_enabled == True
    ).all()
    return cajeros

@router.get("/{id_cajero}", response_model=CajeroResponse)
def obtener_cajero(id_cajero: int, db: Session = Depends(get_db)):
    """
    Obtiene un cajero por ID
    """
    cajero = db.query(Cajero).filter(Cajero.id_cajero == id_cajero).first()
    if not cajero:
        raise HTTPException(status_code=404, detail="Cajero no encontrado")
    return cajero
