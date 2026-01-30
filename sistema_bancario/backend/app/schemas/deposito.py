from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from decimal import Decimal
from typing import Optional


# ==================== CONSTANTES ====================
class CanalDeposito:
    """Canales válidos para depósitos"""
    CAJERO = "CAJERO"
    VENTANILLA = "VENTANILLA"
    TRANSFERENCIA = "TRANSFERENCIA"
    APP_MOVIL = "APP_MOVIL"
    BANCA_WEB = "BANCA_WEB"
    CORRESPONSAL = "CORRESPONSAL"
    
    @classmethod
    def valores_validos(cls) -> list[str]:
        return [cls.CAJERO, cls.VENTANILLA, cls.TRANSFERENCIA, 
                cls.APP_MOVIL, cls.BANCA_WEB, cls.CORRESPONSAL]


class TipoDeposito:
    """Tipos válidos de depósito"""
    EFECTIVO = "EFECTIVO"
    CHEQUE = "CHEQUE"
    TRANSFERENCIA = "TRANSFERENCIA"
    
    @classmethod
    def valores_validos(cls) -> list[str]:
        return [cls.EFECTIVO, cls.CHEQUE, cls.TRANSFERENCIA]


class EstadoDeposito:
    """Estados del depósito"""
    PENDIENTE = "PENDIENTE"
    PROCESADO = "PROCESADO"
    RECHAZADO = "RECHAZADO"


# ==================== SCHEMAS DEPÓSITO ====================
class DepositoBase(BaseModel):
    """Schema base para depósitos"""
    monto: Decimal = Field(..., gt=0, description="Monto a depositar")
    canal_deposito: str = Field(..., description="Canal del depósito")
    tipo_deposito: str = Field(..., description="Tipo de depósito")
    observaciones: Optional[str] = Field(None, max_length=500)
    
    @field_validator('canal_deposito')
    @classmethod
    def validar_canal(cls, valor: str) -> str:
        canales = CanalDeposito.valores_validos()
        if valor not in canales:
            raise ValueError(f'Canal inválido. Opciones: {", ".join(canales)}')
        return valor
    
    @field_validator('tipo_deposito')
    @classmethod
    def validar_tipo(cls, valor: str) -> str:
        tipos = TipoDeposito.valores_validos()
        if valor not in tipos:
            raise ValueError(f'Tipo inválido. Opciones: {", ".join(tipos)}')
        return valor


class DepositoCreate(BaseModel):
    """Schema para crear un depósito"""
    id_cuenta: int = Field(..., description="ID de la cuenta destino")
    id_cajero: Optional[int] = Field(None, description="ID del cajero (si aplica)")
    monto: Decimal = Field(..., gt=0, description="Monto a depositar")
    canal_deposito: str = Field(..., description="Canal del depósito")
    tipo_deposito: str = Field(..., description="Tipo de depósito")
    observaciones: Optional[str] = Field(None, max_length=500)
    
    @field_validator('canal_deposito')
    @classmethod
    def validar_canal(cls, valor: str) -> str:
        canales = CanalDeposito.valores_validos()
        if valor not in canales:
            raise ValueError(f'Canal inválido. Opciones: {", ".join(canales)}')
        return valor
    
    @field_validator('tipo_deposito')
    @classmethod
    def validar_tipo(cls, valor: str) -> str:
        tipos = TipoDeposito.valores_validos()
        if valor not in tipos:
            raise ValueError(f'Tipo inválido. Opciones: {", ".join(tipos)}')
        return valor


class DepositoUpdate(BaseModel):
    """Schema para actualizar un depósito"""
    estado: Optional[str] = Field(None, description="Nuevo estado")
    fecha_procesamiento: Optional[datetime] = None
    observaciones: Optional[str] = Field(None, max_length=500)


class DepositoResponse(BaseModel):
    """Schema de respuesta para depósito"""
    id_deposito: int
    id_cuenta_destino: int
    id_cajero: Optional[int]
    id_persona_deposita: int
    monto: Decimal
    moneda: str
    canal_deposito: str
    tipo_deposito: str
    fecha_deposito: datetime
    fecha_procesamiento: Optional[datetime]
    estado: str
    numero_comprobante: str
    observaciones: Optional[str]
    usuario_registro: str
    ip_origen: Optional[str]
    
    class Config:
        from_attributes = True


class DepositoCompleto(DepositoResponse):
    """Schema con información completa (incluyendo joins)"""
    cuenta_numero: Optional[str] = None
    persona_nombre: Optional[str] = None
    cajero_nombre: Optional[str] = None


# ==================== SCHEMAS CUENTA ====================
class CuentaResponse(BaseModel):
    """Schema de respuesta para cuenta"""
    id_cuenta: int
    n_cuenta: int
    tipo_cuenta: str
    estado: str
    saldo_actual: Decimal
    
    class Config:
        from_attributes = True


class CuentaValidacionResponse(BaseModel):
    """
    Schema para validación de cuenta destino.
    Incluye información enmascarada del titular por seguridad.
    """
    id_cuenta: int
    n_cuenta: int
    tipo_cuenta: str
    estado: str
    titular_nombre: str = Field(..., description="Nombre del titular enmascarado")
    titular_cedula: Optional[str] = Field(None, description="Cédula enmascarada")
    titular_correo: Optional[str] = Field(None, description="Correo enmascarado")
    puede_recibir_depositos: bool = Field(..., description="Si la cuenta puede recibir depósitos")
    mensaje: str = Field(..., description="Mensaje de validación")
    
    class Config:
        from_attributes = True


# ==================== SCHEMAS CAJERO ====================
class CajeroResponse(BaseModel):
    """Schema de respuesta para cajero"""
    id_cajero: int
    nombre: str
    ciudad: Optional[str]
    provincia: Optional[str]
    direccion: Optional[str]
    activo: bool
    depositos_enabled: bool
    
    class Config:
        from_attributes = True


# ==================== SCHEMAS ESTADÍSTICAS ====================
class EstadisticasCanal(BaseModel):
    """Estadísticas por canal de depósito"""
    canal: str
    cantidad: int
    monto_total: float


class EstadisticasEstado(BaseModel):
    """Estadísticas por estado de depósito"""
    estado: str
    cantidad: int
    monto_total: float


class ResumenDepositos(BaseModel):
    """Resumen general de depósitos"""
    total_depositos: int
    monto_total: float
    promedio_deposito: float
    por_canal: list[EstadisticasCanal]
    por_estado: list[EstadisticasEstado]
