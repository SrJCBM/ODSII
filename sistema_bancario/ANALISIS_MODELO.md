ANÁLISIS DEL MODELO DE DATOS: SISTEMA BANCARIO BANCO PICHINCHA

1\. INTRODUCCIÓN

El presente documento describe la estructura y arquitectura del modelo de datos implementado para el sistema bancario del Banco Pichincha. Este modelo relacional fue diseñado siguiendo principios de normalización y encapsula las entidades fundamentales de una institución financiera moderna, proporcionando soporte tanto para clientes individuales como corporativos.

2\. ARQUITECTURA DEL MODELO

2.1. Estrategia de Diseño

El modelo emplea un patrón de herencia por especialización, implementado mediante relaciones 1:1 con tablas especializadas. Esta aproximación permite mantener la integridad referencial mientras se optimiza el almacenamiento de atributos específicos por tipo de entidad.

2.2. Esquema de Normalización

Primera Forma Normal (1NF): Todas las tablas presentan atomicidad en sus atributos

Segunda Forma Normal (2NF): Se eliminan dependencias parciales mediante llaves primarias compuestas donde corresponde

Tercera Forma Normal (3NF): Se eliminan dependencias transitivas, separando entidades por responsabilidad

3\. ANÁLISIS DETALLADO DE ENTIDADES

3.1. JERARQUÍA DE CLIENTES

3.1.1. Entidad Base: PERSONA

Función: Superclase abstracta que encapsula atributos comunes

Cardinalidad: 1:1 con especializaciones

Atributos Notables:

- PATRIMONIO: Tipo FLOAT15, representando valor económico del cliente
- CORREO: CHAR(20), con restricción de longitud fija
- CELULAR: VARCHAR(20), formato internacional compatible

3.1.2. Especialización: PERSONA_NATURAL

Discriminador: Clientes físicos con identificación civil

Llave Primaria Compuesta: (ID, CEDULA)

Atributos Demográficos:

- FECHA_NACIMIENTO: DATE para validación de mayoría de edad
- GENERO: VARCHAR(10), soporte para diversidad de género
- ESTADO_CIVIL: VARCHAR(20), relevante para productos crediticios

3.1.3. Especialización: PERSONA_JURIDICA

Discriminador: Entidades legales con registro mercantil

Llave Primaria Compuesta: (ID, RUC)

Atributos Corporativos:

- RAZON_SOCIAL: Denominación legal completa
- TIPO_EMPRESA: Clasificación según marco legal ecuatoriano
- FECHA_CONSTITUCION: Antigüedad empresarial

3.2. JERARQUÍA DE PRODUCTOS BANCARIOS

3.2.1. Entidad Base: CUENTA

Relación Externa: Clave foránea a PERSONA (propietario)

Atributos Transaccionales:

- LIMITE_OPERACIONES_DIARIAS: Control de riesgo operacional
- COMISION_MENSUAL: DECIMAL(18,2), alta precisión monetaria
- ESTADO: Máquina de estados (Activa/Inactiva/Suspendida)

3.2.2. Especialización: CUENTA_AHORROS

Propósito: Producto de captación con rendimiento

Parámetros Financieros:

- TAZA_INTERES: DECIMAL(18,2), tasa anual nominal
- MINIMO_PARA_MANTENER: Saldo mínimo obligatorio
- TIPO_CUENTA_AHORROS: Segmentación por perfil de cliente

3.2.3. Especialización: CUENTA_CORRIENTE

Propósito: Producto transaccional con sobregiro

Mecanismos de Control:

- LIMITE_OPERACIONAL_DIARIO: Control de riesgo de liquidez
- REGLAS_REGISTRADAS: VARCHAR(200), políticas personalizadas
- FECHA_VENCIMIENTO: Ciclo de renovación contractual

3.3. JERARQUÍA DE MEDIOS DE PAGO

3.3.1. Entidad Base: TARJETA

Seguridad: PIN_HASH VARCHAR(256), almacenamiento criptográfico

Vigencia: Doble control temporal (emisión/expiración)

Internacionalización: PAIS_EMISION para tarjetas extranjeras

3.3.2. Especialización: TARJETA_DEBITO

Vinculación: Relación directa con cuenta asociada

Controles Operativos:

LIMITE_DIARIO_RETIRO: Control de efectivo

SALDO_DISPONIBLE: Reflejo en tiempo real del saldo cuenta

3.3.3. Especialización: TARJETA_CREDITO

Estructura Crediticia:

CUPO_TOTAL_APROBADO: Límite crediticio asignado

TASA_INTERES: DECIMAL(5,2), precisión para cálculo financiero

Ciclo de Pago: FECHA_CORTE y FECHA_PAGO para gestión de cartera

3.4. INFRAESTRUCTURA FÍSICA

3.4.1. Entidad: CAJERO

Georreferenciación: LATITUD y LONGITUD DECIMAL(8,2)

Operatividad:

ACTIVO: BOOLEAN para control de mantenimiento

DEPOSITOS: BOOLEAN, funcionalidad diferenciada

Horarios: HORA_APERTURA y HORA_CIERRE tipo TIME

Restricción: DIAS CHAR(1), sistema de codificación de días

3.5. REGISTRO TRANSACCIONAL

3.5.1. Entidad: TRANSACCIONES

Relaciones: Dependencia de CAJERO y TARJETA

Auditoría:

FECHA_TRANS: TIME, registro horario preciso

ESTADO_TRANS: Máquina de estados transaccional

Mecanismos: Incorpora atributos de DEPOSITOS como entidad débil

3.5.2. Entidad Débil: DEPOSITOS

Propósito: Catálogo de métodos de depósito

Normalización: Eliminación de redundancia transaccional

4\. ANÁLISIS DE INTEGRIDAD REFERENCIAL

4.1. Restricciones de Dominio

Monetarias: Uso de DECIMAL con precisión adecuada al contexto

Temporales: DATE para fechas, TIME para horarios

Geográficas: Coordenadas con precisión de 6 decimales (~10cm)

4.2. Claves Foráneas

Todas las relaciones implementan ON DELETE RESTRICT ON UPDATE RESTRICT, garantizando:

- Conservación de historial transaccional
- Prevención de orfandad de registros
- Consistencia temporal de datos

4.3. Unicidad

- Implementación mediante índices únicos en:
- Identificadores primarios
- Números de cuenta (N_CUENTA)
- Números de tarjeta (NUMERO_TARJETA)

5\. CONSIDERACIONES DE IMPLEMENTACIÓN

5.1. Decisiones de Diseño

- Herencia por Tablas Especializadas: Favorece consultas específicas pero requiere UNION para consultas generales
- Precisión Decimal Variable: Adaptada al contexto (cuentas vs. cajeros)
- Longitud de Campos: Balance entre normalización y usabilidad práctica

5.2. Limitaciones Identificadas

- CORREO CHAR(20): Insuficiente para direcciones de correo modernas
- DIAS CHAR(1): Restrictivo para horarios complejos
- Ausencia de historial de movimientos detallado

5.3. Escalabilidad

El modelo soporta:

- Crecimiento Vertical: Aumento en volumen de transacciones
- Crecimiento Horizontal: Adición de nuevos productos bancarios
- Expansión Geográfica: Estructura preparada para múltiples ubicaciones

6\. CONCLUSIONES

El modelo presentado constituye una base sólida para un sistema bancario core, implementando mejores prácticas de diseño de bases de datos relacionales. La estructura modular permite evoluciones futuras manteniendo la integridad de datos, mientras que las restricciones de dominio aseguran la calidad de la información almacenada.

Recomendación Principal: Considerar la migración de campos de longitud fija (CHAR) a longitud variable (VARCHAR) para adaptarse a estándares actuales de datos de contacto y descripciones extensibles.