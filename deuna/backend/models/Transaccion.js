const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
  numero_transaccion: {
    type: String,
    unique: true,
    sparse: true // Permite null temporalmente durante creación
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
    const random = Math.floor(10000000 + Math.random() * 90000000); // 8 dígitos
    this.numero_transaccion = `TX${fecha}-${random}`;
  }
  next();
});

// Método estático para generar número único
transaccionSchema.statics.generarNumeroTransaccion = async function() {
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let numeroUnico;
  let existe = true;
  let intentos = 0;
  
  while (existe && intentos < 10) {
    const random = Math.floor(10000000 + Math.random() * 90000000);
    numeroUnico = `TX${fecha}-${random}`;
    existe = await this.findOne({ numero_transaccion: numeroUnico });
    intentos++;
  }
  
  return numeroUnico;
};

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
