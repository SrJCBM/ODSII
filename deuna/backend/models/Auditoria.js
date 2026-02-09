const mongoose = require('mongoose');

/**
 * Modelo de Auditoría
 * Registra todas las acciones del sistema para trazabilidad
 */
const auditoriaSchema = new mongoose.Schema({
  // Quién realizó la acción
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  // Tipo de acción
  accion: {
    type: String,
    enum: [
      'login',
      'logout',
      'registro',
      'transferencia',
      'recarga',
      'pago_qr',
      'consulta_saldo',
      'cambio_password',
      'bloqueo_cuenta',
      'reverso',
      'expiracion'
    ],
    required: true
  },
  // Entidad afectada
  entidad: {
    type: String,
    enum: ['usuario', 'cuenta', 'tarjeta', 'transaccion'],
    required: true
  },
  entidad_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  // Detalles de la acción
  descripcion: {
    type: String,
    required: true
  },
  // Datos antes del cambio (para reversos)
  datos_anteriores: {
    type: mongoose.Schema.Types.Mixed
  },
  // Datos después del cambio
  datos_nuevos: {
    type: mongoose.Schema.Types.Mixed
  },
  // Información de la solicitud
  ip_origen: {
    type: String
  },
  user_agent: {
    type: String
  },
  // Estado de la acción
  estado: {
    type: String,
    enum: ['exitoso', 'fallido', 'pendiente'],
    default: 'exitoso'
  },
  // Mensaje de error si falló
  error: {
    type: String
  },
  // Monto involucrado (si aplica)
  monto: {
    type: Number
  }
}, {
  timestamps: true
});

// Índices para consultas rápidas
auditoriaSchema.index({ usuario_id: 1, createdAt: -1 });
auditoriaSchema.index({ accion: 1, createdAt: -1 });
auditoriaSchema.index({ entidad: 1, entidad_id: 1 });

// Método estático para registrar auditoría
auditoriaSchema.statics.registrar = async function(datos) {
  try {
    return await this.create(datos);
  } catch (error) {
    console.error('Error al registrar auditoría:', error);
    // No lanzar error para no afectar la operación principal
  }
};

module.exports = mongoose.model('Auditoria', auditoriaSchema);
