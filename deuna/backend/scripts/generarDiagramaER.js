// Script para generar diagrama ER del modelo de datos
const fs = require('fs');
const path = require('path');

function generarDiagramaER() {
  const mermaidDiagram = `
# DIAGRAMA ENTIDAD-RELACIÓN - DEUNA

\`\`\`mermaid
erDiagram
    USUARIO ||--o{ CUENTA : "tiene"
    USUARIO ||--o{ TARJETA : "posee"
    USUARIO ||--o{ TRANSACCION : "emite"
    USUARIO ||--o{ TRANSACCION : "recibe"
    USUARIO ||--o{ AUDITORIA : "registra"
    CUENTA ||--o{ TARJETA : "vincula"
    TRANSACCION ||--o| TRANSACCION : "reversa"

    USUARIO {
        ObjectId _id PK
        string nombre
        string apellido
        string ci
        string correo UK
        string password
        string telefono UK
        string numero_cuenta UK
        string qr_code UK
        number saldo_deuna
        number saldo_bp
        string estado
        object direccion
        date createdAt
        date updatedAt
    }

    CUENTA {
        ObjectId _id PK
        ObjectId usuario_id FK
        string numero_cuenta UK
        string tipo_cuenta
        string banco
        number saldo
        string estado
        number limite_diario
        date fecha_apertura
        date createdAt
        date updatedAt
    }

    TARJETA {
        ObjectId _id PK
        ObjectId cuenta_id FK
        ObjectId usuario_id FK
        string numero_tarjeta UK
        string tipo
        string marca
        string cvv_hash
        string fecha_expiracion
        number limite_credito
        string estado
        date createdAt
        date updatedAt
    }

    TRANSACCION {
        ObjectId _id PK
        ObjectId emisor_id FK
        ObjectId receptor_id FK
        string tipo
        number monto
        number comision
        number monto_total
        string estado
        string fuente
        string descripcion
        string numero_transaccion UK
        string referencia
        date expira_en
        ObjectId transaccion_original_id FK
        string motivo_reverso
        date createdAt
        date updatedAt
    }

    AUDITORIA {
        ObjectId _id PK
        ObjectId usuario_id FK
        string accion
        string entidad
        string descripcion
        object datos_anteriores
        object datos_nuevos
        string ip_origen
        string estado
        date createdAt
    }
\`\`\`

## 📊 DESCRIPCIÓN DE ENTIDADES

### 👤 USUARIO (Cliente del Banco)
**Propósito:** Representa a los clientes del sistema bancario.

**Campos clave:**
- \`saldo_deuna\`: Balance en billetera Deuna (decimal, default: 0)
- \`saldo_bp\`: Balance en Banco Pichincha (decimal, default: 500)
- \`numero_cuenta\`: Número único de 10 dígitos
- \`qr_code\`: Código QR único para cobros (formato: DEUNA-XXXXXX)
- \`estado\`: activo, inactivo, suspendido

**Índices:**
- correo (unique)
- telefono (unique)
- numero_cuenta (unique)
- qr_code (unique)

---

### 🏦 CUENTA
**Propósito:** Cuentas bancarias asociadas a usuarios (Deuna y BP).

**Campos clave:**
- \`banco\`: 'DEUNA' | 'BP' (Banco Pichincha)
- \`tipo_cuenta\`: billetera_virtual, cuenta_corriente, cuenta_ahorros
- \`limite_diario\`: Límite de transferencias por día (default: 1000)
- \`estado\`: activa, bloqueada, cerrada

**Relaciones:**
- Cada usuario tiene 2 cuentas: una Deuna y una BP

**Índices:**
- numero_cuenta (unique)
- usuario_id + banco (compound)

---

### 💳 TARJETA
**Propósito:** Tarjetas de débito/crédito vinculadas a cuentas.

**Campos clave:**
- \`tipo\`: debito, credito
- \`marca\`: visa, mastercard, discover, amex
- \`numero_tarjeta\`: 16 dígitos (encriptado)
- \`cvv_hash\`: CVV hasheado (bcrypt)
- \`limite_credito\`: Solo para tarjetas de crédito

**Seguridad:**
- CVV nunca se almacena en texto plano
- Número de tarjeta se puede encriptar

**Índices:**
- numero_tarjeta (unique)
- usuario_id
- cuenta_id

---

### 💸 TRANSACCION
**Propósito:** Registro de todos los movimientos financieros.

**Tipos:**
- \`pago_qr\`: Pago mediante código QR
- \`transferencia\`: Transferencia entre usuarios
- \`recarga\`: Recarga desde BP a Deuna
- \`reverso\`: Cancelación de transacción

**Estados:**
- \`pendiente\`: Creada pero no procesada
- \`completada\`: Procesada exitosamente
- \`fallida\`: Error en el procesamiento
- \`reversada\`: Cancelada por usuario
- \`expirada\`: Tiempo de validez agotado

**Campos clave:**
- \`comision\`: 0.5% del monto (mín $0.10, máx $5.00)
- \`numero_transaccion\`: Código único (formato: TX-XXXXXX-XXXXXX)
- \`expira_en\`: Timestamp de expiración (24 horas)
- \`transaccion_original_id\`: Referencia para reversos

**Lógica de negocio:**
- Comisión se calcula automáticamente
- Se valida saldo antes de procesar
- Si saldo Deuna < monto, recarga automática desde BP
- Reverso solo permitido dentro de 24 horas

**Índices:**
- numero_transaccion (unique)
- emisor_id + createdAt (compound)
- receptor_id + createdAt (compound)
- estado + tipo (compound)

---

### 📋 AUDITORIA
**Propósito:** Trazabilidad completa de todas las operaciones.

**Campos clave:**
- \`accion\`: CREAR, MODIFICAR, ELIMINAR, LOGIN, LOGOUT, etc.
- \`entidad\`: Usuario, Transaccion, Cuenta, etc.
- \`datos_anteriores\`: Estado previo (JSON)
- \`datos_nuevos\`: Estado posterior (JSON)
- \`ip_origen\`: IP del cliente (opcional)

**Casos de uso:**
- Investigación de fraudes
- Cumplimiento normativo
- Debugging de problemas
- Reportes de auditoría

**Índices:**
- usuario_id + createdAt (compound)
- entidad + accion (compound)
- createdAt (para consultas temporales)

---

## 🔗 RELACIONES

### 1. Usuario → Cuenta (1:N)
- Un usuario tiene múltiples cuentas (mínimo 2: Deuna + BP)
- Cada cuenta pertenece a un solo usuario
- **FK:** \`Cuenta.usuario_id → Usuario._id\`

### 2. Usuario → Tarjeta (1:N)
- Un usuario puede tener múltiples tarjetas
- Cada tarjeta pertenece a un usuario
- **FK:** \`Tarjeta.usuario_id → Usuario._id\`

### 3. Cuenta → Tarjeta (1:N)
- Una cuenta puede tener múltiples tarjetas
- Cada tarjeta está vinculada a una cuenta
- **FK:** \`Tarjeta.cuenta_id → Cuenta._id\`

### 4. Usuario → Transacción (1:N como emisor)
- Un usuario puede hacer múltiples transacciones
- **FK:** \`Transaccion.emisor_id → Usuario._id\`

### 5. Usuario → Transacción (1:N como receptor)
- Un usuario puede recibir múltiples transacciones
- **FK:** \`Transaccion.receptor_id → Usuario._id\`

### 6. Transacción → Transacción (1:1 reverso)
- Una transacción puede revertir otra transacción
- **FK:** \`Transaccion.transaccion_original_id → Transaccion._id\`

### 7. Usuario → Auditoría (1:N)
- Un usuario genera múltiples registros de auditoría
- **FK:** \`Auditoria.usuario_id → Usuario._id\`

---

## 🔍 CONSULTAS COMUNES (con populate/JOIN)

### 1. Transacciones con datos de emisor y receptor
\`\`\`javascript
await Transaccion.find({ estado: 'completada' })
  .populate('emisor_id', 'nombre apellido correo')
  .populate('receptor_id', 'nombre apellido correo')
  .sort({ createdAt: -1 });
\`\`\`

### 2. Cuentas de un usuario con sus tarjetas
\`\`\`javascript
await Cuenta.find({ usuario_id })
  .populate({
    path: 'tarjetas',
    match: { estado: 'activa' }
  });
\`\`\`

### 3. Usuario completo con todas sus relaciones
\`\`\`javascript
await Usuario.findById(userId)
  .populate('cuentas')
  .populate('tarjetas')
  .populate({
    path: 'transacciones_emitidas',
    options: { limit: 10, sort: { createdAt: -1 } }
  });
\`\`\`

### 4. Auditoría de una transacción específica
\`\`\`javascript
await Auditoria.find({
  entidad: 'Transaccion',
  'datos_nuevos.numero_transaccion': numeroTX
}).populate('usuario_id', 'nombre correo');
\`\`\`

---

## 📈 ESTADÍSTICAS

### Registros actuales (seed):
- 👥 **Usuarios:** 12
- 🏦 **Cuentas:** 20 (10 Deuna + 10 BP)
- 💳 **Tarjetas:** 12
- 💸 **Transacciones:** 15+
- 📋 **Auditorías:** Variable (se registra cada acción)

### Integridad referencial:
- ✅ Todos los FK tienen índices para optimizar JOINs
- ✅ Validaciones a nivel de Mongoose
- ✅ Cascada para eliminaciones (implementada en middleware)
- ✅ Restricciones de unicidad en índices

---

## 🛠️ HERRAMIENTAS PARA VISUALIZAR

### 1. MongoDB Compass (Recomendado)
- Descarga: https://www.mongodb.com/products/compass
- Conecta con tu MONGODB_URI
- Ve a la pestaña "Schema" de cada colección
- Muestra tipos de datos, distribución, índices

### 2. Este diagrama
- Copia el código Mermaid
- Pégalo en: https://mermaid.live
- O usa extensiones de VS Code: "Markdown Preview Mermaid Support"

### 3. Exportar esquema desde Mongoose
\`\`\`bash
node backend/scripts/exportarEsquema.js
\`\`\`

---

**Generado:** ${new Date().toLocaleString()}  
**Versión del modelo:** 1.0
`;

  // Guardar en archivo markdown
  const outputPath = path.join(__dirname, '..', '..', 'DIAGRAMA-ER.md');
  fs.writeFileSync(outputPath, mermaidDiagram.trim());

  console.log('');
  console.log('✅ Diagrama ER generado exitosamente!');
  console.log('');
  console.log('📁 Archivo: DIAGRAMA-ER.md');
  console.log('');
  console.log('🔗 Opciones para visualizar:');
  console.log('');
  console.log('1. MERMAID LIVE EDITOR:');
  console.log('   - Abre: https://mermaid.live');
  console.log('   - Copia el código del diagrama de DIAGRAMA-ER.md');
  console.log('   - Pégalo en el editor');
  console.log('');
  console.log('2. VS CODE (con extensión):');
  console.log('   - Instala: "Markdown Preview Mermaid Support"');
  console.log('   - Abre DIAGRAMA-ER.md');
  console.log('   - Presiona Ctrl+Shift+V (preview)');
  console.log('');
  console.log('3. MONGODB COMPASS:');
  console.log('   - Abre MongoDB Compass');
  console.log('   - Conecta a tu base de datos');
  console.log('   - Selecciona colección → Tab "Schema"');
  console.log('   - Ver estructura real de documentos');
  console.log('');
  console.log('4. GITHUB/GITLAB:');
  console.log('   - Sube DIAGRAMA-ER.md a tu repo');
  console.log('   - GitHub renderiza Mermaid automáticamente');
  console.log('');
}

// Ejecutar
generarDiagramaER();
