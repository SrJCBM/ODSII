from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Cuenta, Persona, PersonaNatural
from app.schemas import CuentaResponse, CuentaValidacionResponse

router = APIRouter(prefix="/api/cuentas", tags=["Cuentas"])


# ==================== CONSTANTES ====================
class EstadoCuenta:
    """Estados válidos de cuenta"""
    ACTIVA = "Activa"
    INACTIVA = "Inactiva"
    BLOQUEADA = "Bloqueada"


# ==================== VALIDACIÓN DE CUENTA ====================
@router.get("/validar/{numero_cuenta}", response_model=CuentaValidacionResponse)
def validar_cuenta_por_numero(numero_cuenta: int, db: Session = Depends(get_db)):
    """
    Valida una cuenta por su número y retorna información del titular.
    Similar a la funcionalidad de "Validar cuenta" en transferencias.
    
    - Verifica que la cuenta exista
    - Verifica que esté activa
    - Retorna nombre del titular enmascarado por seguridad
    """
    resultado = db.query(
        Cuenta,
        PersonaNatural.nombre,
        PersonaNatural.apellido,
        PersonaNatural.cedula,
        Persona.correo
    ).join(
        Persona, Cuenta.id == Persona.id
    ).outerjoin(
        PersonaNatural, Persona.id == PersonaNatural.id
    ).filter(
        Cuenta.n_cuenta == numero_cuenta
    ).first()
    
    if not resultado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cuenta no encontrada. Verifique el número ingresado."
        )
    
    cuenta, nombre, apellido, cedula, correo = resultado
    
    if cuenta.estado != EstadoCuenta.ACTIVA:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"La cuenta no está disponible para recibir depósitos. Estado: {cuenta.estado}"
        )
    
    # Nombre completo sin enmascarar para verificación del usuario
    nombre_completo = f"{nombre or ''} {apellido or ''}".strip()
    if not nombre_completo:
        nombre_completo = "Titular no registrado"
    
    # Enmascarar solo datos sensibles (cédula y correo)
    cedula_enmascarada = _enmascarar_cedula(cedula) if cedula else None
    correo_enmascarado = _enmascarar_correo(correo) if correo else None
    
    return {
        "id_cuenta": cuenta.id_cuenta,
        "n_cuenta": cuenta.n_cuenta,
        "tipo_cuenta": cuenta.tipo_cuenta,
        "estado": cuenta.estado,
        "titular_nombre": nombre_completo,
        "titular_cedula": cedula_enmascarada,
        "titular_correo": correo_enmascarado,
        "puede_recibir_depositos": True,
        "mensaje": f"Cuenta válida. Titular: {nombre_completo}"
    }


# ==================== LISTAR Y OBTENER ====================
@router.get("/", response_model=List[CuentaResponse])
def listar_cuentas(
    estado: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Lista cuentas con filtro opcional por estado"""
    query = db.query(Cuenta)
    
    if estado:
        query = query.filter(Cuenta.estado == estado)
    else:
        query = query.filter(Cuenta.estado == EstadoCuenta.ACTIVA)
    
    return query.all()


@router.get("/{id_cuenta}", response_model=CuentaResponse)
def obtener_cuenta(id_cuenta: int, db: Session = Depends(get_db)):
    """Obtiene una cuenta por ID"""
    cuenta = db.query(Cuenta).filter(Cuenta.id_cuenta == id_cuenta).first()
    
    if not cuenta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cuenta no encontrada"
        )
    
    return cuenta


# ==================== FUNCIONES AUXILIARES ====================
def _enmascarar_nombre(nombre: str) -> str:
    """
    Enmascara el nombre para mostrar solo iniciales.
    Ejemplo: "Juan Carlos Pérez" -> "J*** C*** P***"
    """
    if not nombre:
        return "****"
    
    palabras = nombre.split()
    enmascaradas = []
    
    for palabra in palabras:
        if len(palabra) > 0:
            enmascaradas.append(f"{palabra[0]}{'*' * (len(palabra) - 1)}")
    
    return " ".join(enmascaradas)


def _enmascarar_cedula(cedula: str) -> str:
    """
    Enmascara la cédula mostrando solo últimos 4 dígitos.
    Ejemplo: "1234567890" -> "******7890"
    """
    if not cedula or len(cedula) < 4:
        return "****"
    
    return f"{'*' * (len(cedula) - 4)}{cedula[-4:]}"


def _enmascarar_correo(correo: str) -> str:
    """
    Enmascara el correo mostrando solo inicio y dominio.
    Ejemplo: "juan.perez@email.com" -> "j***@email.com"
    """
    if not correo or "@" not in correo:
        return "****@****.***"
    
    usuario, dominio = correo.split("@", 1)
    
    if len(usuario) > 1:
        usuario_enmascarado = f"{usuario[0]}{'*' * (len(usuario) - 1)}"
    else:
        usuario_enmascarado = "*"
    
    return f"{usuario_enmascarado}@{dominio}"
