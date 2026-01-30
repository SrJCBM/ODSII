# PROPUESTA DE REDISEÑO: MÓDULO DE DEPÓSITOS

## 1. PROBLEMA ACTUAL

La tabla `DEPOSITOS` actual es insuficiente para operar como entidad transaccional:

```sql
-- Estructura actual (problemática)
CREATE TABLE DEPOSITOS (
   CANAL_DEPOSITO       VARCHAR(100)         NOT NULL,
   TIPO_DEPOSITO        VARCHAR(100)         NOT NULL,
   REFERENCIA           VARCHAR(100)         NULL
);
```

### Deficiencias identificadas:
- ❌ Sin llave primaria (no se puede identificar un depósito específico)
- ❌ Sin relación con CUENTA (no sabemos a qué cuenta va el depósito)
- ❌ Sin monto (no registra cuánto se deposita)
- ❌ Sin fecha/hora (no hay trazabilidad temporal)
- ❌ Sin estado (no se puede controlar el ciclo de vida)
- ❌ Sin relación con PERSONA (no sabemos quién deposita)

---

## 2. PROPUESTA DE REDISEÑO

### 2.1 Nueva estructura de tabla DEPOSITOS

```sql
CREATE TABLE DEPOSITOS (
   ID_DEPOSITO          SERIAL               NOT NULL,
   ID_CUENTA_DESTINO    INT4                 NOT NULL,  -- FK a CUENTA
   ID_CAJERO            INT4                 NULL,      -- FK a CAJERO (si es en cajero)
   ID_PERSONA_DEPOSITA  INT4                 NULL,      -- FK a PERSONA (quien deposita)
   
   -- Información del depósito
   MONTO                DECIMAL(18,2)        NOT NULL,
   MONEDA               VARCHAR(3)           NOT NULL DEFAULT 'USD',
   
   -- Clasificación
   CANAL_DEPOSITO       VARCHAR(50)          NOT NULL,  -- 'CAJERO', 'VENTANILLA', 'TRANSFERENCIA', 'APP_MOVIL'
   TIPO_DEPOSITO        VARCHAR(50)          NOT NULL,  -- 'EFECTIVO', 'CHEQUE', 'TRANSFERENCIA'
   
   -- Trazabilidad
   FECHA_DEPOSITO       TIMESTAMP            NOT NULL DEFAULT CURRENT_TIMESTAMP,
   FECHA_PROCESAMIENTO  TIMESTAMP            NULL,
   
   -- Control
   ESTADO               VARCHAR(20)          NOT NULL DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'PROCESADO', 'RECHAZADO', 'ANULADO'
   REFERENCIA           VARCHAR(100)         NULL,      -- Número de cheque, referencia externa, etc.
   NUMERO_COMPROBANTE   VARCHAR(50)          NOT NULL,  -- Comprobante generado por el sistema
   
   -- Información adicional para cheques
   BANCO_ORIGEN         VARCHAR(100)         NULL,      -- Si es cheque, de qué banco
   NUMERO_CHEQUE        VARCHAR(50)          NULL,
   
   -- Auditoría
   OBSERVACIONES        VARCHAR(500)         NULL,
   USUARIO_REGISTRO     VARCHAR(50)          NOT NULL,
   IP_ORIGEN            VARCHAR(45)          NULL,      -- IPv4 o IPv6
   
   CONSTRAINT PK_DEPOSITOS PRIMARY KEY (ID_DEPOSITO),
   CONSTRAINT CHK_MONTO_POSITIVO CHECK (MONTO > 0),
   CONSTRAINT CHK_CANAL_VALIDO CHECK (CANAL_DEPOSITO IN ('CAJERO', 'VENTANILLA', 'TRANSFERENCIA', 'APP_MOVIL', 'BANCA_WEB')),
   CONSTRAINT CHK_TIPO_VALIDO CHECK (TIPO_DEPOSITO IN ('EFECTIVO', 'CHEQUE', 'TRANSFERENCIA')),
   CONSTRAINT CHK_ESTADO_VALIDO CHECK (ESTADO IN ('PENDIENTE', 'PROCESADO', 'RECHAZADO', 'ANULADO'))
);
```

### 2.2 Índices recomendados

```sql
-- Índice primario
CREATE UNIQUE INDEX DEPOSITOS_PK ON DEPOSITOS (ID_DEPOSITO);

-- Índices para búsquedas frecuentes
CREATE INDEX IDX_DEPOSITOS_CUENTA ON DEPOSITOS (ID_CUENTA_DESTINO);
CREATE INDEX IDX_DEPOSITOS_FECHA ON DEPOSITOS (FECHA_DEPOSITO);
CREATE INDEX IDX_DEPOSITOS_ESTADO ON DEPOSITOS (ESTADO);
CREATE INDEX IDX_DEPOSITOS_COMPROBANTE ON DEPOSITOS (NUMERO_COMPROBANTE);

-- Índice compuesto para reportes
CREATE INDEX IDX_DEPOSITOS_CUENTA_FECHA ON DEPOSITOS (ID_CUENTA_DESTINO, FECHA_DEPOSITO);
```

### 2.3 Relaciones (Foreign Keys)

```sql
-- Relación con CUENTA (obligatoria)
ALTER TABLE DEPOSITOS
   ADD CONSTRAINT FK_DEPOSITOS_CUENTA FOREIGN KEY (ID_CUENTA_DESTINO)
      REFERENCES CUENTA (ID_CUENTA)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Relación con CAJERO (opcional, solo si es depósito en cajero)
ALTER TABLE DEPOSITOS
   ADD CONSTRAINT FK_DEPOSITOS_CAJERO FOREIGN KEY (ID_CAJERO)
      REFERENCES CAJERO (ID_CAJERO)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Relación con PERSONA (opcional, quien realiza el depósito)
ALTER TABLE DEPOSITOS
   ADD CONSTRAINT FK_DEPOSITOS_PERSONA FOREIGN KEY (ID_PERSONA_DEPOSITA)
      REFERENCES PERSONA (ID)
      ON DELETE RESTRICT ON UPDATE RESTRICT;
```

---

## 3. DIAGRAMA ENTIDAD-RELACIÓN (Textual)

```
                    ┌─────────────┐
                    │   PERSONA   │
                    │     (ID)    │
                    └──────┬──────┘
                           │ 0..1
                           │
                           ▼ *
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   CAJERO    │◄─────│  DEPOSITOS  │─────►│   CUENTA    │
│ (ID_CAJERO) │ 0..1 │(ID_DEPOSITO)│  1   │ (ID_CUENTA) │
└─────────────┘      └─────────────┘      └─────────────┘
                           │
                           │ (genera)
                           ▼
                    ┌─────────────┐
                    │TRANSACCIONES│
                    └─────────────┘
```

### Cardinalidades:
- **CUENTA → DEPOSITOS**: 1 a muchos (una cuenta puede recibir muchos depósitos)
- **CAJERO → DEPOSITOS**: 0..1 a muchos (un cajero puede procesar muchos depósitos, pero un depósito puede no ser en cajero)
- **PERSONA → DEPOSITOS**: 0..1 a muchos (una persona puede hacer muchos depósitos, el depositante puede ser anónimo)

---

## 4. CATÁLOGO DE DATOS

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| ID_DEPOSITO | SERIAL | Sí | Identificador único autogenerado |
| ID_CUENTA_DESTINO | INT4 | Sí | Cuenta que recibe el depósito |
| ID_CAJERO | INT4 | No | Cajero donde se realizó (si aplica) |
| ID_PERSONA_DEPOSITA | INT4 | No | Persona que realiza el depósito |
| MONTO | DECIMAL(18,2) | Sí | Cantidad depositada (> 0) |
| MONEDA | VARCHAR(3) | Sí | Código ISO de moneda (USD, EUR) |
| CANAL_DEPOSITO | VARCHAR(50) | Sí | Canal por donde ingresa el depósito |
| TIPO_DEPOSITO | VARCHAR(50) | Sí | Forma del depósito |
| FECHA_DEPOSITO | TIMESTAMP | Sí | Fecha/hora del depósito |
| FECHA_PROCESAMIENTO | TIMESTAMP | No | Fecha/hora de procesamiento efectivo |
| ESTADO | VARCHAR(20) | Sí | Estado actual del depósito |
| REFERENCIA | VARCHAR(100) | No | Referencia externa |
| NUMERO_COMPROBANTE | VARCHAR(50) | Sí | Comprobante del sistema |
| BANCO_ORIGEN | VARCHAR(100) | No | Banco emisor (para cheques) |
| NUMERO_CHEQUE | VARCHAR(50) | No | Número de cheque (si aplica) |
| OBSERVACIONES | VARCHAR(500) | No | Notas adicionales |
| USUARIO_REGISTRO | VARCHAR(50) | Sí | Usuario que registró |
| IP_ORIGEN | VARCHAR(45) | No | IP desde donde se registró |

---

## 5. VALORES PERMITIDOS

### CANAL_DEPOSITO
| Valor | Descripción |
|-------|-------------|
| CAJERO | Depósito en cajero automático |
| VENTANILLA | Depósito en ventanilla de agencia |
| TRANSFERENCIA | Depósito vía transferencia bancaria |
| APP_MOVIL | Depósito desde aplicación móvil |
| BANCA_WEB | Depósito desde banca en línea |

### TIPO_DEPOSITO
| Valor | Descripción |
|-------|-------------|
| EFECTIVO | Depósito en billetes/monedas |
| CHEQUE | Depósito con cheque |
| TRANSFERENCIA | Depósito por transferencia electrónica |

### ESTADO
| Valor | Descripción |
|-------|-------------|
| PENDIENTE | Depósito registrado, pendiente de procesar |
| PROCESADO | Depósito completado exitosamente |
| RECHAZADO | Depósito rechazado (cheque sin fondos, etc.) |
| ANULADO | Depósito anulado por el usuario/sistema |

---

## 6. REGLAS DE NEGOCIO

1. **RN-DEP-001**: Todo depósito debe tener un monto mayor a cero.
2. **RN-DEP-002**: La cuenta destino debe existir y estar en estado ACTIVA.
3. **RN-DEP-003**: Los depósitos en cheque inician en estado PENDIENTE hasta verificación.
4. **RN-DEP-004**: Los depósitos en efectivo se procesan inmediatamente (estado PROCESADO).
5. **RN-DEP-005**: Al procesar un depósito, se debe actualizar el SALDO_ACTUAL de la cuenta.
6. **RN-DEP-006**: Todo depósito debe generar un registro en TRANSACCIONES.
7. **RN-DEP-007**: Los depósitos en cajero requieren ID_CAJERO obligatorio.
8. **RN-DEP-008**: El número de comprobante debe ser único en el sistema.

---

## 7. SECUENCIA DE GENERACIÓN DE COMPROBANTE

Formato: `DEP-YYYYMMDD-NNNNNN`

Ejemplo: `DEP-20260128-000001`

```sql
-- Función para generar número de comprobante
CREATE OR REPLACE FUNCTION generar_comprobante_deposito()
RETURNS VARCHAR(50) AS $$
DECLARE
    v_fecha VARCHAR(8);
    v_secuencia INT;
    v_comprobante VARCHAR(50);
BEGIN
    v_fecha := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
    
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(NUMERO_COMPROBANTE FROM 14 FOR 6) AS INT)
    ), 0) + 1
    INTO v_secuencia
    FROM DEPOSITOS
    WHERE NUMERO_COMPROBANTE LIKE 'DEP-' || v_fecha || '%';
    
    v_comprobante := 'DEP-' || v_fecha || '-' || LPAD(v_secuencia::TEXT, 6, '0');
    
    RETURN v_comprobante;
END;
$$ LANGUAGE plpgsql;
```

---

## 8. INTEGRACIÓN CON TRANSACCIONES

Cuando un depósito es procesado, debe crear un registro en TRANSACCIONES:

```sql
-- Trigger para registrar en transacciones
CREATE OR REPLACE FUNCTION registrar_transaccion_deposito()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ESTADO = 'PROCESADO' AND (OLD.ESTADO IS NULL OR OLD.ESTADO != 'PROCESADO') THEN
        INSERT INTO TRANSACCIONES (
            ID_TRANSACCIONES,
            ID_TARJETA,
            ID_CAJERO,
            CANAL_DEPOSITO,
            TIPO_DEPOSITO,
            REFERENCIA,
            FECHA_TRANS,
            ESTADO_TRANS,
            MONTO
        ) VALUES (
            NEXTVAL('seq_transacciones'),
            NULL,
            NEW.ID_CAJERO,
            NEW.CANAL_DEPOSITO,
            NEW.TIPO_DEPOSITO,
            NEW.NUMERO_COMPROBANTE,
            CURRENT_TIME,
            'COMPLETADA',
            NEW.MONTO
        );
        
        -- Actualizar saldo de la cuenta
        UPDATE CUENTA
        SET SALDO_ACTUAL = SALDO_ACTUAL + NEW.MONTO,
            FECHA_ACTUALIZACION = CURRENT_DATE
        WHERE ID_CUENTA = NEW.ID_CUENTA_DESTINO;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deposito_procesado
AFTER INSERT OR UPDATE ON DEPOSITOS
FOR EACH ROW
EXECUTE FUNCTION registrar_transaccion_deposito();
```

---

## 9. SCRIPT DDL COMPLETO PARA IMPLEMENTACIÓN

Ver archivo: `depositos_ddl.sql` (a crear después de aprobar el modelo)

---

## 10. PRÓXIMOS PASOS

1. ✅ Revisar y aprobar este diseño
2. ⬜ Actualizar modelo conceptual en herramienta de modelado
3. ⬜ Generar modelo lógico actualizado
4. ⬜ Implementar DDL en base de datos
5. ⬜ Insertar datos de prueba (30 registros)
6. ⬜ Desarrollar API REST para el módulo
7. ⬜ Desarrollar interfaz de usuario
