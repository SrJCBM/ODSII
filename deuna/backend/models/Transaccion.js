const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['pago_qr', 'recarga', 'transferencia'],
    required: true
  },
  emisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  receptor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  monto: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0.01, 'El monto mínimo es 0.01']
  },
  fuente: {
    type: String,
    enum: ['deuna', 'bp', 'mixto'], // mixto si usó ambas fuentes
    required: true
  },
  recarga_automatica: {
    type: Boolean,
    default: false
  },
  monto_recargado: {
    type: Number,
    default: 0 // Cuánto se recargó automáticamente desde BP
  },
  estado: {
    type: String,
    enum: ['completada', 'pendiente', 'fallida'],
    default: 'completada'
  },
  descripcion: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Método para formato de respuesta
transaccionSchema.methods.toJSON = function() {
  return {
    id: this._id,
    tipo: this.tipo,
    emisor_id: this.emisor_id,
    receptor_id: this.receptor_id,
    monto: this.monto,
    fuente: this.fuente,
    recarga_automatica: this.recarga_automatica,
    monto_recargado: this.monto_recargado,
    estado: this.estado,
    descripcion: this.descripcion,
    fecha: this.createdAt
  };
};

module.exports = mongoose.model('Transaccion', transaccionSchema);
