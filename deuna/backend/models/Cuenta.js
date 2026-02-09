const mongoose = require('mongoose');

/**
 * Modelo de Cuenta Bancaria
 * Representa una cuenta asociada a un usuario
 */
const cuentaSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  numero_cuenta: {
    type: String,
    unique: true,
    required: true
  },
  tipo_cuenta: {
    type: String,
    enum: ['ahorro', 'corriente'],
    default: 'ahorro'
  },
  banco: {
    type: String,
    enum: ['pichincha', 'deuna'],
    required: true
  },
  saldo: {
    type: Number,
    default: 0.00,
    min: 0
  },
  estado: {
    type: String,
    enum: ['activa', 'inactiva', 'bloqueada'],
    default: 'activa'
  },
  limite_diario: {
    type: Number,
    default: 5000.00 // Límite de transferencia diaria
  },
  monto_transferido_hoy: {
    type: Number,
    default: 0
  },
  fecha_ultimo_reset: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Método para verificar límite diario
cuentaSchema.methods.verificarLimite = function(monto) {
  // Resetear si es un nuevo día
  const hoy = new Date().toDateString();
  const ultimoReset = new Date(this.fecha_ultimo_reset).toDateString();
  
  if (hoy !== ultimoReset) {
    this.monto_transferido_hoy = 0;
    this.fecha_ultimo_reset = new Date();
  }
  
  return (this.monto_transferido_hoy + monto) <= this.limite_diario;
};

// Generar número de cuenta
cuentaSchema.statics.generarNumeroCuenta = function(banco) {
  const prefijo = banco === 'pichincha' ? '22' : '99';
  let numero = prefijo;
  for (let i = 0; i < 8; i++) {
    numero += Math.floor(Math.random() * 10);
  }
  return numero;
};

module.exports = mongoose.model('Cuenta', cuentaSchema);
