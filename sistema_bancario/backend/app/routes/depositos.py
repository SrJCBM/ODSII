from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import datetime, date
from app.database import get_db
from app.models import Deposito, Cuenta, Cajero, Persona, PersonaNatural
from app.schemas import (
    DepositoCreate, 
    DepositoUpdate, 
    DepositoResponse, 
    DepositoCompleto,
    ResumenDepositos,
    EstadisticasCanal,
    EstadisticasEstado
)

router = APIRouter(prefix="/api/depositos", tags=["Depósitos"])


# ========== ESTADÍSTICAS (debe ir ANTES de /{id_deposito}) ==========
@router.get("/estadisticas/resumen", response_model=ResumenDepositos)
def obtener_estadisticas(
    fecha_desde: Optional[date] = None,
    fecha_hasta: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene estadísticas generales de depósitos
    """
    query = db.query(Deposito)
    
    if fecha_desde:
        query = query.filter(func.date(Deposito.fecha_deposito) >= fecha_desde)
    if fecha_hasta:
        query = query.filter(func.date(Deposito.fecha_deposito) <= fecha_hasta)
    
    # Estadísticas generales
    total_depositos = query.count()
    total_monto = query.with_entities(func.sum(Deposito.monto)).scalar() or 0
    promedio_monto = query.with_entities(func.avg(Deposito.monto)).scalar() or 0
    
    # Por canal
    por_canal = db.query(
        Deposito.canal_deposito,
        func.count(Deposito.id_deposito).label('cantidad'),
        func.sum(Deposito.monto).label('total_monto')
    ).group_by(Deposito.canal_deposito).all()
    
    # Por estado
    por_estado = db.query(
        Deposito.estado,
        func.count(Deposito.id_deposito).label('cantidad'),
        func.sum(Deposito.monto).label('total_monto')
    ).group_by(Deposito.estado).all()
    
    return {
        'total_depositos': total_depositos,
        'monto_total': float(total_monto),
        'promedio_deposito': float(promedio_monto),
        'por_canal': [
            {'canal': canal, 'cantidad': cant, 'monto_total': float(monto) if monto else 0}
            for canal, cant, monto in por_canal
        ],
        'por_estado': [
            {'estado': estado, 'cantidad': cant, 'monto_total': float(monto) if monto else 0}
            for estado, cant, monto in por_estado
        ]
    }


# ========== CRUD DEPOSITOS ==========
@router.post("/", response_model=DepositoResponse, status_code=status.HTTP_201_CREATED)
def crear_deposito(deposito: DepositoCreate, db: Session = Depends(get_db)):
    """
    Crea un nuevo depósito con validaciones de negocio
    """
    # Validar que la cuenta existe y está activa
    cuenta = db.query(Cuenta).filter(Cuenta.id_cuenta == deposito.id_cuenta).first()
    if not cuenta:
        raise HTTPException(status_code=404, detail="Cuenta no encontrada")
    if cuenta.estado != "Activa":
        raise HTTPException(status_code=400, detail="La cuenta no está activa")
    
    # REGLA DE NEGOCIO: Validar monto mínimo según tipo de depósito
    if deposito.tipo_deposito == "EFECTIVO" and deposito.monto < 1:
        raise HTTPException(status_code=400, detail="El monto mínimo para depósito en efectivo es $1.00")
    if deposito.tipo_deposito == "CHEQUE" and deposito.monto < 10:
        raise HTTPException(status_code=400, detail="El monto mínimo para depósito con cheque es $10.00")
    
    # REGLA DE NEGOCIO: Límite diario por canal
    hoy = date.today()
    depositos_hoy = db.query(func.sum(Deposito.monto)).filter(
        Deposito.id_cuenta_destino == deposito.id_cuenta,
        func.date(Deposito.fecha_deposito) == hoy,
        Deposito.canal_deposito == deposito.canal_deposito
    ).scalar() or 0
    
    limites_canal = {
        "CAJERO_AUTOMATICO": 5000,
        "APP_MOVIL": 10000,
        "BANCA_WEB": 20000,
        "VENTANILLA": 50000,
        "CORRESPONSAL": 3000
    }
    limite = limites_canal.get(deposito.canal_deposito, 50000)
    
    if depositos_hoy + float(deposito.monto) > limite:
        raise HTTPException(
            status_code=400, 
            detail=f"Límite diario excedido para {deposito.canal_deposito}. Límite: ${limite:,.2f}, Acumulado hoy: ${depositos_hoy:,.2f}"
        )
    
    # Validar cajero si aplica
    if deposito.canal_deposito == "CAJERO_AUTOMATICO":
        if not deposito.id_cajero:
            raise HTTPException(status_code=400, detail="Debe especificar un cajero para depósitos en cajero automático")
        cajero = db.query(Cajero).filter(Cajero.id_cajero == deposito.id_cajero).first()
        if not cajero:
            raise HTTPException(status_code=404, detail="Cajero no encontrado")
        if not cajero.activo:
            raise HTTPException(status_code=400, detail="El cajero no está activo")
    
    # Generar número de comprobante
    fecha_actual = datetime.now()
    ultimo_deposito = db.query(Deposito).order_by(Deposito.id_deposito.desc()).first()
    numero_secuencial = (ultimo_deposito.id_deposito + 1) if ultimo_deposito else 1
    numero_comprobante = f"DEP-{fecha_actual.strftime('%Y%m%d')}-{numero_secuencial:06d}"
    
    # Crear depósito
    db_deposito = Deposito(
        id_cuenta_destino=deposito.id_cuenta,
        id_persona_deposita=cuenta.id,  # FK a persona en el modelo Cuenta
        id_cajero=deposito.id_cajero,
        monto=deposito.monto,
        canal_deposito=deposito.canal_deposito,
        tipo_deposito=deposito.tipo_deposito,
        fecha_deposito=fecha_actual,
        estado="PENDIENTE",
        numero_comprobante=numero_comprobante,
        observaciones=deposito.observaciones,
        usuario_registro="SISTEMA",
        ip_origen="0.0.0.0"
    )
    
    db.add(db_deposito)
    db.commit()
    db.refresh(db_deposito)
    
    return db_deposito


@router.get("/", response_model=List[DepositoCompleto])
def listar_depositos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    canal_deposito: Optional[str] = None,
    estado: Optional[str] = None,
    fecha_desde: Optional[date] = None,
    fecha_hasta: Optional[date] = None,
    id_cuenta: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Lista todos los depósitos con filtros opcionales
    """
    query = db.query(
        Deposito,
        Cuenta.n_cuenta.label('cuenta_numero'),
        PersonaNatural.nombre.label('persona_nombre'),
        PersonaNatural.apellido.label('persona_apellido'),
        Cajero.nombre.label('cajero_nombre')
    ).join(
        Cuenta, Deposito.id_cuenta_destino == Cuenta.id_cuenta
    ).join(
        Persona, Deposito.id_persona_deposita == Persona.id
    ).outerjoin(
        PersonaNatural, Persona.id == PersonaNatural.id
    ).outerjoin(
        Cajero, Deposito.id_cajero == Cajero.id_cajero
    )
    
    # Aplicar filtros
    if canal_deposito:
        query = query.filter(Deposito.canal_deposito == canal_deposito)
    if estado:
        query = query.filter(Deposito.estado == estado)
    if fecha_desde:
        query = query.filter(func.date(Deposito.fecha_deposito) >= fecha_desde)
    if fecha_hasta:
        query = query.filter(func.date(Deposito.fecha_deposito) <= fecha_hasta)
    if id_cuenta:
        query = query.filter(Deposito.id_cuenta_destino == id_cuenta)
    
    resultados = query.order_by(Deposito.fecha_deposito.desc()).offset(skip).limit(limit).all()
    
    # Transformar resultados
    depositos = []
    for deposito, cuenta_numero, persona_nombre, persona_apellido, cajero_nombre in resultados:
        nombre_completo = f"{persona_nombre or ''} {persona_apellido or ''}".strip()
        deposito_dict = {
            **deposito.__dict__,
            'cuenta_numero': str(cuenta_numero),
            'persona_nombre': nombre_completo if nombre_completo else "Sin nombre",
            'cajero_nombre': cajero_nombre
        }
        depositos.append(deposito_dict)
    
    return depositos


@router.get("/{id_deposito}", response_model=DepositoCompleto)
def obtener_deposito(id_deposito: int, db: Session = Depends(get_db)):
    """
    Obtiene un depósito específico por ID
    """
    resultado = db.query(
        Deposito,
        Cuenta.n_cuenta.label('cuenta_numero'),
        PersonaNatural.nombre.label('persona_nombre'),
        PersonaNatural.apellido.label('persona_apellido'),
        Cajero.nombre.label('cajero_nombre')
    ).join(
        Cuenta, Deposito.id_cuenta_destino == Cuenta.id_cuenta
    ).join(
        Persona, Deposito.id_persona_deposita == Persona.id
    ).outerjoin(
        PersonaNatural, Persona.id == PersonaNatural.id
    ).outerjoin(
        Cajero, Deposito.id_cajero == Cajero.id_cajero
    ).filter(
        Deposito.id_deposito == id_deposito
    ).first()
    
    if not resultado:
        raise HTTPException(status_code=404, detail="Depósito no encontrado")
    
    deposito, cuenta_numero, persona_nombre, persona_apellido, cajero_nombre = resultado
    nombre_completo = f"{persona_nombre or ''} {persona_apellido or ''}".strip()
    
    return {
        **deposito.__dict__,
        'cuenta_numero': str(cuenta_numero),
        'persona_nombre': nombre_completo if nombre_completo else "Sin nombre",
        'cajero_nombre': cajero_nombre
    }


@router.put("/{id_deposito}", response_model=DepositoResponse)
def actualizar_deposito(
    id_deposito: int, 
    deposito_update: DepositoUpdate, 
    db: Session = Depends(get_db)
):
    """
    Actualiza el estado de un depósito (PROCESADO, RECHAZADO)
    """
    db_deposito = db.query(Deposito).filter(Deposito.id_deposito == id_deposito).first()
    
    if not db_deposito:
        raise HTTPException(status_code=404, detail="Depósito no encontrado")
    
    # REGLA DE NEGOCIO: Solo se pueden procesar depósitos pendientes
    if db_deposito.estado != "PENDIENTE":
        raise HTTPException(
            status_code=400, 
            detail=f"Solo se pueden actualizar depósitos en estado PENDIENTE. Estado actual: {db_deposito.estado}"
        )
    
    # Actualizar campos
    update_data = deposito_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_deposito, key, value)
    
    # Si se marca como PROCESADO, registrar fecha de procesamiento
    if deposito_update.estado == "PROCESADO":
        db_deposito.fecha_procesamiento = datetime.now()
    
    db.commit()
    db.refresh(db_deposito)
    
    return db_deposito


@router.delete("/{id_deposito}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_deposito(id_deposito: int, db: Session = Depends(get_db)):
    """
    Elimina un depósito (solo si está en estado PENDIENTE)
    """
    db_deposito = db.query(Deposito).filter(Deposito.id_deposito == id_deposito).first()
    
    if not db_deposito:
        raise HTTPException(status_code=404, detail="Depósito no encontrado")
    
    if db_deposito.estado != "PENDIENTE":
        raise HTTPException(
            status_code=400, 
            detail="Solo se pueden eliminar depósitos en estado PENDIENTE"
        )
    
    db.delete(db_deposito)
    db.commit()
    
    return None
