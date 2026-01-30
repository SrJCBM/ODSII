/*==============================================================*/
/* DBMS name:      PostgreSQL 8                                 */
/* Created on:     27/1/2026 21:13:21                           */
/* Updated:        28/1/2026 - Módulo Depósitos (Grupo 2)      */
/*==============================================================*/


DROP INDEX IF EXISTS CAJERO_PK;

DROP TABLE IF EXISTS CAJERO CASCADE;

DROP INDEX IF EXISTS RELATIONSHIP_1_FK;

DROP INDEX IF EXISTS CUENTA_PK;

DROP TABLE IF EXISTS CUENTA CASCADE;

DROP INDEX IF EXISTS INHERITANCE_4_FK;

DROP INDEX IF EXISTS CUENTA_AHORROS_PK;

DROP TABLE IF EXISTS CUENTA_AHORROS CASCADE;

DROP INDEX IF EXISTS INHERITANCE_3_FK;

DROP INDEX IF EXISTS CUENTA_CORRIENTE_PK;

DROP TABLE IF EXISTS CUENTA_CORRIENTE CASCADE;

DROP INDEX IF EXISTS DEPOSITOS_PK;
DROP INDEX IF EXISTS IDX_DEPOSITOS_CUENTA;
DROP INDEX IF EXISTS IDX_DEPOSITOS_FECHA;
DROP INDEX IF EXISTS IDX_DEPOSITOS_ESTADO;
DROP INDEX IF EXISTS IDX_DEPOSITOS_COMPROBANTE;
DROP INDEX IF EXISTS IDX_DEPOSITOS_CUENTA_FECHA;

DROP TABLE IF EXISTS DEPOSITOS CASCADE;

DROP SEQUENCE IF EXISTS seq_depositos;

DROP INDEX IF EXISTS PERSONA_PK;

DROP TABLE IF EXISTS PERSONA CASCADE;

DROP INDEX IF EXISTS INHERITANCE_2_FK;

DROP INDEX IF EXISTS PERSONA_JURIDICA_PK;

DROP TABLE IF EXISTS PERSONA_JURIDICA CASCADE;

DROP INDEX IF EXISTS INHERITANCE_1_FK;

DROP INDEX IF EXISTS PERSONA_NATURAL_PK;

DROP TABLE IF EXISTS PERSONA_NATURAL CASCADE;

DROP INDEX IF EXISTS RELATIONSHIP_2_FK;

DROP INDEX IF EXISTS TARJETA_PK;

DROP TABLE IF EXISTS TARJETA CASCADE;

DROP INDEX IF EXISTS TARJETA_CREDITO_PK;

DROP TABLE IF EXISTS TARJETA_CREDITO CASCADE;

DROP INDEX IF EXISTS TARJETA_DEBITO_PK;

DROP TABLE IF EXISTS TARJETA_DEBITO CASCADE;

DROP INDEX IF EXISTS RELATIONSHIP_4_FK;

DROP INDEX IF EXISTS RELATIONSHIP_3_FK;

DROP INDEX IF EXISTS TRANSACCIONES_PK;

DROP TABLE IF EXISTS TRANSACCIONES CASCADE;

/*==============================================================*/
/* Table: CAJERO                                                */
/*==============================================================*/
CREATE TABLE CAJERO (
   ID_CAJERO            INT4                 NOT NULL,
   LATITUD              DECIMAL(8,2)         NOT NULL,
   LONGITUD             DECIMAL(8,2)         NOT NULL,
   ACTIVO               BOOL                 NOT NULL,
   SALDO                DECIMAL(8,2)         NOT NULL,
   DEPOSITOS            BOOL                 NOT NULL,
   NOMBRE               VARCHAR(20)          NOT NULL,
   CIUDAD               VARCHAR(32)          NOT NULL,
   PROVINCIA            VARCHAR(32)          NOT NULL,
   DIRECCION            VARCHAR(128)         NOT NULL,
   HORA_APERTURA        TIME                 NOT NULL,
   HORA_CIERRE          TIME                 NOT NULL,
   DIAS                 CHAR(1)              NOT NULL,
   CONSTRAINT PK_CAJERO PRIMARY KEY (ID_CAJERO)
);

/*==============================================================*/
/* Index: CAJERO_PK                                             */
/*==============================================================*/
CREATE UNIQUE INDEX CAJERO_PK ON CAJERO (
ID_CAJERO
);

/*==============================================================*/
/* Table: CUENTA                                                */
/*==============================================================*/
CREATE TABLE CUENTA (
   ID_CUENTA            INT4                 NOT NULL,
   ID                   INT4                 NULL,
   N_CUENTA             BIGINT               NOT NULL,
   TIPO_CUENTA          VARCHAR(128)         NOT NULL,
   ESTADO               VARCHAR(64)          NOT NULL,
   FECHA_CREACION       DATE                 NOT NULL,
   FECHA_ACTUALIZACION  DATE                 NOT NULL,
   FECHA_CIERRE         DATE                 NOT NULL,
   SALDO_ACTUAL         DECIMAL(18,2)        NOT NULL,
   COMISION_MENSUAL     DECIMAL(18,2)        NOT NULL,
   LIMITE_OPERACIONES_DIARIAS INT4                 NOT NULL,
   CONSTRAINT PK_CUENTA PRIMARY KEY (ID_CUENTA)
);

/*==============================================================*/
/* Index: CUENTA_PK                                             */
/*==============================================================*/
CREATE UNIQUE INDEX CUENTA_PK ON CUENTA (
ID_CUENTA
);

/*==============================================================*/
/* Index: RELATIONSHIP_1_FK                                     */
/*==============================================================*/
CREATE  INDEX RELATIONSHIP_1_FK ON CUENTA (
ID
);

/*==============================================================*/
/* Table: CUENTA_AHORROS                                        */
/*==============================================================*/
CREATE TABLE CUENTA_AHORROS (
   ID_CUENTA            INT4                 NOT NULL,
   ID_TIPO_CUENTA       INT4                 NOT NULL,
   ID                   INT4                 NULL,
   N_CUENTA             BIGINT               NOT NULL,
   TIPO_CUENTA          VARCHAR(128)         NOT NULL,
   ESTADO               VARCHAR(64)          NOT NULL,
   FECHA_CREACION       DATE                 NOT NULL,
   FECHA_ACTUALIZACION  DATE                 NOT NULL,
   FECHA_CIERRE         DATE                 NOT NULL,
   SALDO_ACTUAL         DECIMAL(18,2)        NOT NULL,
   COMISION_MENSUAL     DECIMAL(18,2)        NOT NULL,
   LIMITE_OPERACIONES_DIARIAS INT4                 NOT NULL,
   TIPO_CUENTA_AHORROS  VARCHAR(200)         NOT NULL,
   TAZA_INTERES         DECIMAL(18,2)        NOT NULL,
   MINIMO_PARA_MANTENER DECIMAL(18,2)        NOT NULL,
   COMISION_MANTENIMIENTO DECIMAL(18,2)        NOT NULL,
   FECHA_APERTURA       DATE                 NOT NULL,
   CONSTRAINT PK_CUENTA_AHORROS PRIMARY KEY (ID_CUENTA, ID_TIPO_CUENTA)
);

/*==============================================================*/
/* Index: CUENTA_AHORROS_PK                                     */
/*==============================================================*/
CREATE UNIQUE INDEX CUENTA_AHORROS_PK ON CUENTA_AHORROS (
ID_CUENTA,
ID_TIPO_CUENTA
);

/*==============================================================*/
/* Index: INHERITANCE_4_FK                                      */
/*==============================================================*/
CREATE  INDEX INHERITANCE_4_FK ON CUENTA_AHORROS (
ID_CUENTA
);

/*==============================================================*/
/* Table: CUENTA_CORRIENTE                                      */
/*==============================================================*/
CREATE TABLE CUENTA_CORRIENTE (
   ID_CUENTA            INT4                 NOT NULL,
   CUENTA_CREDITO       INT4                 NOT NULL,
   ID                   INT4                 NULL,
   N_CUENTA             BIGINT               NOT NULL,
   TIPO_CUENTA          VARCHAR(128)         NOT NULL,
   ESTADO               VARCHAR(64)          NOT NULL,
   FECHA_CREACION       DATE                 NOT NULL,
   FECHA_ACTUALIZACION  DATE                 NOT NULL,
   FECHA_CIERRE         DATE                 NOT NULL,
   SALDO_ACTUAL         DECIMAL(18,2)        NOT NULL,
   CUE_COMISION_MENSUAL DECIMAL(18,2)        NOT NULL,
   LIMITE_OPERACIONES_DIARIAS INT4                 NOT NULL,
   FECHA_VENCIMIENTO    DATE                 NOT NULL,
   LIMITE_OPERACIONAL_DIARIO INT4                 NOT NULL,
   REGLAS_REGISTRADAS   VARCHAR(200)         NOT NULL,
   COMISION_MENSUAL     DECIMAL(18,2)        NOT NULL,
   CONSTRAINT PK_CUENTA_CORRIENTE PRIMARY KEY (ID_CUENTA, CUENTA_CREDITO)
);

/*==============================================================*/
/* Index: CUENTA_CORRIENTE_PK                                   */
/*==============================================================*/
CREATE UNIQUE INDEX CUENTA_CORRIENTE_PK ON CUENTA_CORRIENTE (
ID_CUENTA,
CUENTA_CREDITO
);

/*==============================================================*/
/* Index: INHERITANCE_3_FK                                      */
/*==============================================================*/
CREATE  INDEX INHERITANCE_3_FK ON CUENTA_CORRIENTE (
ID_CUENTA
);

/*==============================================================*/
/* Sequence: seq_depositos                                      */
/*==============================================================*/
CREATE SEQUENCE seq_depositos START WITH 1 INCREMENT BY 1;

/*==============================================================*/
/* Table: DEPOSITOS                                             */
/*==============================================================*/
CREATE TABLE DEPOSITOS (
   ID_DEPOSITO          INT4                 NOT NULL DEFAULT NEXTVAL('seq_depositos'),
   ID_CUENTA_DESTINO    INT4                 NOT NULL,
   ID_CAJERO            INT4                 NULL,
   ID_PERSONA_DEPOSITA  INT4                 NULL,
   MONTO                DECIMAL(18,2)        NOT NULL,
   MONEDA               VARCHAR(3)           NOT NULL DEFAULT 'USD',
   CANAL_DEPOSITO       VARCHAR(50)          NOT NULL,
   TIPO_DEPOSITO        VARCHAR(50)          NOT NULL,
   FECHA_DEPOSITO       TIMESTAMP            NOT NULL DEFAULT CURRENT_TIMESTAMP,
   FECHA_PROCESAMIENTO  TIMESTAMP            NULL,
   ESTADO               VARCHAR(20)          NOT NULL DEFAULT 'PENDIENTE',
   REFERENCIA           VARCHAR(100)         NULL,
   NUMERO_COMPROBANTE   VARCHAR(50)          NOT NULL,
   BANCO_ORIGEN         VARCHAR(100)         NULL,
   NUMERO_CHEQUE        VARCHAR(50)          NULL,
   OBSERVACIONES        VARCHAR(500)         NULL,
   USUARIO_REGISTRO     VARCHAR(50)          NOT NULL,
   IP_ORIGEN            VARCHAR(45)          NULL,
   CONSTRAINT PK_DEPOSITOS PRIMARY KEY (ID_DEPOSITO),
   CONSTRAINT CHK_MONTO_POSITIVO CHECK (MONTO > 0),
   CONSTRAINT CHK_CANAL_VALIDO CHECK (CANAL_DEPOSITO IN ('CAJERO', 'VENTANILLA', 'TRANSFERENCIA', 'APP_MOVIL', 'BANCA_WEB')),
   CONSTRAINT CHK_TIPO_VALIDO CHECK (TIPO_DEPOSITO IN ('EFECTIVO', 'CHEQUE', 'TRANSFERENCIA')),
   CONSTRAINT CHK_ESTADO_VALIDO CHECK (ESTADO IN ('PENDIENTE', 'PROCESADO', 'RECHAZADO', 'ANULADO'))
);

/*==============================================================*/
/* Index: DEPOSITOS_PK                                          */
/*==============================================================*/
CREATE UNIQUE INDEX DEPOSITOS_PK ON DEPOSITOS (
ID_DEPOSITO
);

/*==============================================================*/
/* Index: IDX_DEPOSITOS_CUENTA                                  */
/*==============================================================*/
CREATE INDEX IDX_DEPOSITOS_CUENTA ON DEPOSITOS (
ID_CUENTA_DESTINO
);

/*==============================================================*/
/* Index: IDX_DEPOSITOS_FECHA                                   */
/*==============================================================*/
CREATE INDEX IDX_DEPOSITOS_FECHA ON DEPOSITOS (
FECHA_DEPOSITO
);

/*==============================================================*/
/* Index: IDX_DEPOSITOS_ESTADO                                  */
/*==============================================================*/
CREATE INDEX IDX_DEPOSITOS_ESTADO ON DEPOSITOS (
ESTADO
);

/*==============================================================*/
/* Index: IDX_DEPOSITOS_COMPROBANTE                             */
/*==============================================================*/
CREATE UNIQUE INDEX IDX_DEPOSITOS_COMPROBANTE ON DEPOSITOS (
NUMERO_COMPROBANTE
);

/*==============================================================*/
/* Index: IDX_DEPOSITOS_CUENTA_FECHA                            */
/*==============================================================*/
CREATE INDEX IDX_DEPOSITOS_CUENTA_FECHA ON DEPOSITOS (
ID_CUENTA_DESTINO,
FECHA_DEPOSITO
);

/*==============================================================*/
/* Table: PERSONA                                               */
/*==============================================================*/
CREATE TABLE PERSONA (
   ID                   INT4                 NOT NULL,
   CELULAR              VARCHAR(20)          NOT NULL,
   CORREO               VARCHAR(100)         NOT NULL,
   PATRIMONIO           NUMERIC(15,2)        NOT NULL,
   CONSTRAINT PK_PERSONA PRIMARY KEY (ID)
);

/*==============================================================*/
/* Index: PERSONA_PK                                            */
/*==============================================================*/
CREATE UNIQUE INDEX PERSONA_PK ON PERSONA (
ID
);

/*==============================================================*/
/* Table: PERSONA_JURIDICA                                      */
/*==============================================================*/
CREATE TABLE PERSONA_JURIDICA (
   ID                   INT4                 NOT NULL,
   RUC                  CHAR(13)             NOT NULL,
   CELULAR              VARCHAR(20)          NOT NULL,
   CORREO               VARCHAR(100)         NOT NULL,
   PATRIMONIO           NUMERIC(15,2)        NOT NULL,
   RAZON_SOCIAL         VARCHAR(100)         NOT NULL,
   NOMBRE_COMERCIAL     VARCHAR(100)         NOT NULL,
   FECHA_CONSTITUCION   DATE                 NOT NULL,
   TIPO_EMPRESA         VARCHAR(50)          NOT NULL,
   CONSTRAINT PK_PERSONA_JURIDICA PRIMARY KEY (ID, RUC)
);

/*==============================================================*/
/* Index: PERSONA_JURIDICA_PK                                   */
/*==============================================================*/
CREATE UNIQUE INDEX PERSONA_JURIDICA_PK ON PERSONA_JURIDICA (
ID,
RUC
);

/*==============================================================*/
/* Index: INHERITANCE_2_FK                                      */
/*==============================================================*/
CREATE  INDEX INHERITANCE_2_FK ON PERSONA_JURIDICA (
ID
);

/*==============================================================*/
/* Table: PERSONA_NATURAL                                       */
/*==============================================================*/
CREATE TABLE PERSONA_NATURAL (
   ID                   INT4                 NOT NULL,
   CEDULA               VARCHAR(20)          NOT NULL,
   CELULAR              VARCHAR(20)          NOT NULL,
   CORREO               VARCHAR(100)         NOT NULL,
   PATRIMONIO           NUMERIC(15,2)        NOT NULL,
   NOMBRE               VARCHAR(50)          NOT NULL,
   APELLIDO             VARCHAR(50)          NOT NULL,
   FECHA_NACIMIENTO     DATE                 NOT NULL,
   GENERO               VARCHAR(10)          NOT NULL,
   ESTADO_CIVIL         VARCHAR(20)          NOT NULL,
   OCUPACION            VARCHAR(50)          NOT NULL,
   NACIONALIDAD         VARCHAR(20)          NOT NULL,
   CONSTRAINT PK_PERSONA_NATURAL PRIMARY KEY (ID, CEDULA)
);

/*==============================================================*/
/* Index: PERSONA_NATURAL_PK                                    */
/*==============================================================*/
CREATE UNIQUE INDEX PERSONA_NATURAL_PK ON PERSONA_NATURAL (
ID,
CEDULA
);

/*==============================================================*/
/* Index: INHERITANCE_1_FK                                      */
/*==============================================================*/
CREATE  INDEX INHERITANCE_1_FK ON PERSONA_NATURAL (
ID
);

/*==============================================================*/
/* Table: TARJETA                                               */
/*==============================================================*/
CREATE TABLE TARJETA (
   ID_TARJETA           VARCHAR(16)          NOT NULL,
   ID_CUENTA            INT4                 NULL,
   NUMERO_TARJETA       VARCHAR(16)          NOT NULL,
   NOMBRE_TITULAR       VARCHAR(100)         NOT NULL,
   FECHA_EMISION        DATE                 NOT NULL,
   FECHA_EXPIRACION     DATE                 NOT NULL,
   ESTADO_TARJETA       VARCHAR(20)          NOT NULL,
   TIPO_TARJETA         VARCHAR(10)          NOT NULL,
   PIN_HASH             VARCHAR(256)         NOT NULL,
   PAIS_EMISION         VARCHAR(50)          NOT NULL,
   CONSTRAINT PK_TARJETA PRIMARY KEY (ID_TARJETA)
);

/*==============================================================*/
/* Index: TARJETA_PK                                            */
/*==============================================================*/
CREATE UNIQUE INDEX TARJETA_PK ON TARJETA (
ID_TARJETA
);

/*==============================================================*/
/* Index: RELATIONSHIP_2_FK                                     */
/*==============================================================*/
CREATE  INDEX RELATIONSHIP_2_FK ON TARJETA (
ID_CUENTA
);

/*==============================================================*/
/* Table: TARJETA_CREDITO                                       */
/*==============================================================*/
CREATE TABLE TARJETA_CREDITO (
   ID_TARJETA           VARCHAR(16)          NOT NULL,
   ID_CUENTA            INT4                 NULL,
   NUMERO_TARJETA       VARCHAR(16)          NOT NULL,
   NOMBRE_TITULAR       VARCHAR(100)         NOT NULL,
   FECHA_EMISION        DATE                 NOT NULL,
   FECHA_EXPIRACION     DATE                 NOT NULL,
   ESTADO_TARJETA       VARCHAR(20)          NOT NULL,
   TIPO_TARJETA         VARCHAR(10)          NOT NULL,
   PIN_HASH             VARCHAR(256)         NOT NULL,
   PAIS_EMISION         VARCHAR(50)          NOT NULL,
   CUPO_TOTAL_APROBADO  DECIMAL(12,2)        NOT NULL,
   CUPO_DISPONIBLE      DECIMAL(12,2)        NOT NULL,
   FECHA_CORTE          DATE                 NOT NULL,
   FECHA_PAGO           DATE                 NOT NULL,
   TASA_INTERES         DECIMAL(5,2)         NOT NULL,
   CONSTRAINT PK_TARJETA_CREDITO PRIMARY KEY (ID_TARJETA)
);

/*==============================================================*/
/* Index: TARJETA_CREDITO_PK                                    */
/*==============================================================*/
CREATE UNIQUE INDEX TARJETA_CREDITO_PK ON TARJETA_CREDITO (
ID_TARJETA
);

/*==============================================================*/
/* Table: TARJETA_DEBITO                                        */
/*==============================================================*/
CREATE TABLE TARJETA_DEBITO (
   ID_TARJETA           VARCHAR(16)          NOT NULL,
   ID_CUENTA            INT4                 NULL,
   NUMERO_TARJETA       VARCHAR(16)          NOT NULL,
   NOMBRE_TITULAR       VARCHAR(100)         NOT NULL,
   FECHA_EMISION        DATE                 NOT NULL,
   FECHA_EXPIRACION     DATE                 NOT NULL,
   ESTADO_TARJETA       VARCHAR(20)          NOT NULL,
   TIPO_TARJETA         VARCHAR(10)          NOT NULL,
   PIN_HASH             VARCHAR(256)         NOT NULL,
   PAIS_EMISION         VARCHAR(50)          NOT NULL,
   NUMERO_CUENTA_ASOCIADA VARCHAR(20)          NOT NULL,
   TIPO_CUENTA          VARCHAR(128)         NOT NULL,
   SALDO_DISPONIBLE     DECIMAL(12,2)        NOT NULL,
   LIMITE_DIARIO_RETIRO DECIMAL(10,2)        NOT NULL,
   CONSTRAINT PK_TARJETA_DEBITO PRIMARY KEY (ID_TARJETA)
);

/*==============================================================*/
/* Index: TARJETA_DEBITO_PK                                     */
/*==============================================================*/
CREATE UNIQUE INDEX TARJETA_DEBITO_PK ON TARJETA_DEBITO (
ID_TARJETA
);

/*==============================================================*/
/* Table: TRANSACCIONES                                         */
/*==============================================================*/
CREATE TABLE TRANSACCIONES (
   ID_TRANSACCIONES     INT4                 NOT NULL,
   ID_TARJETA           VARCHAR(16)          NULL,
   ID_CAJERO            INT4                 NULL,
   CANAL_DEPOSITO       VARCHAR(100)         NOT NULL,
   TIPO_DEPOSITO        VARCHAR(100)         NOT NULL,
   REFERENCIA           VARCHAR(100)         NULL,
   FECHA_TRANS          TIME                 NOT NULL,
   ESTADO_TRANS         VARCHAR(50)          NOT NULL,
   MONTO                DECIMAL(8,2)         NOT NULL,
   CONSTRAINT PK_TRANSACCIONES PRIMARY KEY (ID_TRANSACCIONES)
);

/*==============================================================*/
/* Index: TRANSACCIONES_PK                                      */
/*==============================================================*/
CREATE UNIQUE INDEX TRANSACCIONES_PK ON TRANSACCIONES (
ID_TRANSACCIONES
);

/*==============================================================*/
/* Index: RELATIONSHIP_3_FK                                     */
/*==============================================================*/
CREATE  INDEX RELATIONSHIP_3_FK ON TRANSACCIONES (
ID_CAJERO
);

/*==============================================================*/
/* Index: RELATIONSHIP_4_FK                                     */
/*==============================================================*/
CREATE  INDEX RELATIONSHIP_4_FK ON TRANSACCIONES (
ID_TARJETA
);

ALTER TABLE CUENTA
   ADD CONSTRAINT FK_CUENTA_RELATIONS_PERSONA FOREIGN KEY (ID)
      REFERENCES PERSONA (ID)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE CUENTA_AHORROS
   ADD CONSTRAINT FK_CUENTA_A_INHERITAN_CUENTA FOREIGN KEY (ID_CUENTA)
      REFERENCES CUENTA (ID_CUENTA)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE CUENTA_CORRIENTE
   ADD CONSTRAINT FK_CUENTA_C_INHERITAN_CUENTA FOREIGN KEY (ID_CUENTA)
      REFERENCES CUENTA (ID_CUENTA)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE PERSONA_JURIDICA
   ADD CONSTRAINT FK_PERSONA__INHERITAN_PERSONA FOREIGN KEY (ID)
      REFERENCES PERSONA (ID)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE PERSONA_NATURAL
   ADD CONSTRAINT FK_PERSONA__INHERITAN_PERSONA FOREIGN KEY (ID)
      REFERENCES PERSONA (ID)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TARJETA
   ADD CONSTRAINT FK_TARJETA_RELATIONS_CUENTA FOREIGN KEY (ID_CUENTA)
      REFERENCES CUENTA (ID_CUENTA)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TARJETA_CREDITO
   ADD CONSTRAINT FK_TARJETA__INHERITAN_TARJETA FOREIGN KEY (ID_TARJETA)
      REFERENCES TARJETA (ID_TARJETA)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TARJETA_DEBITO
   ADD CONSTRAINT FK_TARJETA__INHERITAN_TARJETA FOREIGN KEY (ID_TARJETA)
      REFERENCES TARJETA (ID_TARJETA)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TRANSACCIONES
   ADD CONSTRAINT FK_TRANSACC_RELATIONS_CAJERO FOREIGN KEY (ID_CAJERO)
      REFERENCES CAJERO (ID_CAJERO)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE TRANSACCIONES
   ADD CONSTRAINT FK_TRANSACC_RELATIONS_TARJETA FOREIGN KEY (ID_TARJETA)
      REFERENCES TARJETA (ID_TARJETA)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE DEPOSITOS
   ADD CONSTRAINT FK_DEPOSITOS_CUENTA FOREIGN KEY (ID_CUENTA_DESTINO)
      REFERENCES CUENTA (ID_CUENTA)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE DEPOSITOS
   ADD CONSTRAINT FK_DEPOSITOS_CAJERO FOREIGN KEY (ID_CAJERO)
      REFERENCES CAJERO (ID_CAJERO)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE DEPOSITOS
   ADD CONSTRAINT FK_DEPOSITOS_PERSONA FOREIGN KEY (ID_PERSONA_DEPOSITA)
      REFERENCES PERSONA (ID)
      ON DELETE RESTRICT ON UPDATE RESTRICT;

