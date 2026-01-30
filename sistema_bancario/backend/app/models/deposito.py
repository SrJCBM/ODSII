from sqlalchemy import Column, Integer, String, Numeric, TIMESTAMP, BigInteger, ForeignKey, Date, Boolean, Time
from sqlalchemy.orm import relationship
from app.database import Base

class Deposito(Base):
    __tablename__ = "depositos"
    
    id_deposito = Column(Integer, primary_key=True, index=True)
    id_cuenta_destino = Column(Integer, ForeignKey("cuenta.id_cuenta"), nullable=False)
    id_cajero = Column(Integer, ForeignKey("cajero.id_cajero"), nullable=True)
    id_persona_deposita = Column(Integer, ForeignKey("persona.id"), nullable=False)
    monto = Column(Numeric(15, 2), nullable=False)
    moneda = Column(String(3), nullable=False, default="USD")
    canal_deposito = Column(String(50), nullable=False)
    tipo_deposito = Column(String(50), nullable=False)
    fecha_deposito = Column(TIMESTAMP, nullable=False)
    fecha_procesamiento = Column(TIMESTAMP, nullable=True)
    estado = Column(String(20), nullable=False, default="PENDIENTE")
    referencia = Column(String(100), nullable=True)
    numero_comprobante = Column(String(50), nullable=False)
    banco_origen = Column(String(100), nullable=True)
    numero_cheque = Column(String(50), nullable=True)
    observaciones = Column(String(500), nullable=True)
    usuario_registro = Column(String(50), nullable=False)
    ip_origen = Column(String(45), nullable=True)
    
    # Relationships
    cuenta = relationship("Cuenta", back_populates="depositos")
    cajero = relationship("Cajero", back_populates="depositos")
    persona = relationship("Persona", back_populates="depositos")


class Cuenta(Base):
    __tablename__ = "cuenta"
    
    id_cuenta = Column(Integer, primary_key=True, index=True)
    id = Column(Integer, ForeignKey("persona.id"))
    n_cuenta = Column(BigInteger, nullable=False, unique=True)
    tipo_cuenta = Column(String(128), nullable=False)
    estado = Column(String(64), nullable=False)
    fecha_creacion = Column(Date, nullable=False)
    fecha_actualizacion = Column(Date, nullable=False)
    fecha_cierre = Column(Date, nullable=False)
    saldo_actual = Column(Numeric(18, 2), nullable=False)
    comision_mensual = Column(Numeric(18, 2), nullable=False)
    limite_operaciones_diarias = Column(Integer, nullable=False)
    
    # Relationships
    persona = relationship("Persona", back_populates="cuentas")
    depositos = relationship("Deposito", back_populates="cuenta")


class Cajero(Base):
    __tablename__ = "cajero"
    
    id_cajero = Column(Integer, primary_key=True, index=True)
    latitud = Column(Numeric(10, 6))
    longitud = Column(Numeric(10, 6))
    activo = Column(Boolean, nullable=False, default=True)
    saldo = Column(Numeric(18, 2))
    depositos_enabled = Column("depositos", Boolean, nullable=False, default=True)
    nombre = Column(String(200), nullable=False)
    ciudad = Column(String(100))
    provincia = Column(String(100))
    direccion = Column(String(500))
    hora_apertura = Column(Time)
    hora_cierre = Column(Time)
    dias = Column(String(20))
    
    # Relationships
    depositos = relationship("Deposito", back_populates="cajero")


class Persona(Base):
    __tablename__ = "persona"
    
    id = Column(Integer, primary_key=True, index=True)
    celular = Column(String(20), nullable=False)
    correo = Column(String(100), nullable=False)
    patrimonio = Column(Numeric(15, 2), nullable=False)
    
    # Relationships
    cuentas = relationship("Cuenta", back_populates="persona")
    depositos = relationship("Deposito", back_populates="persona")
    persona_natural = relationship("PersonaNatural", back_populates="persona", uselist=False)


class PersonaNatural(Base):
    __tablename__ = "persona_natural"
    
    id = Column(Integer, ForeignKey("persona.id"), primary_key=True)
    cedula = Column(String(10), nullable=False, unique=True)
    celular = Column(String(20), nullable=False)
    correo = Column(String(100), nullable=False)
    patrimonio = Column(Numeric(15, 2), nullable=False)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50), nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    genero = Column(String(20), nullable=False)
    estado_civil = Column(String(20), nullable=False)
    ocupacion = Column(String(50), nullable=False)
    nacionalidad = Column(String(50), nullable=False)
    
    # Relationships
    persona = relationship("Persona", back_populates="persona_natural")
