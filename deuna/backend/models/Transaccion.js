const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
  numero_transaccion: {
    type: String,
    unique: true,
    required: true
  },
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

// Generar número de transacción único antes de guardar
transaccionSchema.pre('save', async function(next) {
  if (!this.numero_transaccion) {
    // Formato: TXYYYYMMDD-NNNNNNNN (TX + fecha + 8 dígitos random)
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    let numeroUnico;
    let existe = true;

    // Generar hasta encontrar uno único
    while (existe) {
      const random = Math.floor(10000000 + Math.random() * 90000000); // 8 dígitos
      numeroUnico = `TX${fecha}-${random}`;
      existe = await mongoose.models.Transaccion.findOne({ numero_transaccion: numeroUnico });
    }

    this.numero_transaccion = numeroUnico;
  }
  next();
});

// Método para formato de respuesta
transaccionSchema.methods.toJSON = function() {
  return {
    id: this._id,
    numero_transaccion: this.numero_transaccion,
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
