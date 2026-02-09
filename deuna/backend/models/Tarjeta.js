const mongoose = require('mongoose');

/**
 * Modelo de Tarjeta
 * Representa una tarjeta de débito/crédito asociada a una cuenta
 */
const tarjetaSchema = new mongoose.Schema({
  cuenta_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cuenta',
    required: true
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  numero_tarjeta: {
    type: String,
    required: true,
    unique: true
  },
  numero_masked: {
    type: String // **** **** **** 1234
  },
  tipo: {
    type: String,
    enum: ['debito', 'credito'],
    default: 'debito'
  },
  marca: {
    type: String,
    enum: ['visa', 'mastercard'],
    default: 'visa'
  },
  cvv_hash: {
    type: String,
    required: true
  },
  fecha_expiracion: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['activa', 'inactiva', 'bloqueada', 'expirada'],
    default: 'activa'
  },
  limite_credito: {
    type: Number,
    default: 0 // Solo aplica para tarjetas de crédito
  },
  saldo_usado: {
    type: Number,
    default: 0 // Saldo utilizado en tarjetas de crédito
  }
}, {
  timestamps: true
});

// Generar número de tarjeta (16 dígitos)
tarjetaSchema.statics.generarNumeroTarjeta = function(marca) {
  // Visa empieza con 4, Mastercard con 5
  const prefijo = marca === 'visa' ? '4' : '5';
  let numero = prefijo;
  for (let i = 0; i < 15; i++) {
    numero += Math.floor(Math.random() * 10);
  }
  return numero;
};

// Enmascarar número de tarjeta
tarjetaSchema.pre('save', function(next) {
  if (this.numero_tarjeta && !this.numero_masked) {
    this.numero_masked = '**** **** **** ' + this.numero_tarjeta.slice(-4);
  }
  next();
});

// Verificar si está expirada
tarjetaSchema.methods.estaExpirada = function() {
  return new Date() > this.fecha_expiracion;
};

// Verificar disponibilidad para crédito
tarjetaSchema.methods.disponibleCredito = function() {
  if (this.tipo !== 'credito') return 0;
  return this.limite_credito - this.saldo_usado;
};

module.exports = mongoose.model('Tarjeta', tarjetaSchema);
