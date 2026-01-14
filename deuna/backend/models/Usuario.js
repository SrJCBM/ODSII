const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true
  },
  ci: {
    type: String,
    required: [true, 'La cédula es requerida'],
    unique: true,
    trim: true
  },
  correo: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: 6
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    trim: true
  },
  saldo_bp: {
    type: Number,
    default: 1500.00 // Saldo inicial simulado de Banco Pichincha
  },
  saldo_deuna: {
    type: Number,
    default: 0.00 // Saldo inicial de billetera Deuna
  },
  numero_cuenta: {
    type: String,
    unique: true
  },
  qr_code: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generar número de cuenta aleatorio de 10 dígitos
const generarNumeroCuenta = () => {
  let numero = '';
  for (let i = 0; i < 10; i++) {
    numero += Math.floor(Math.random() * 10);
  }
  return numero;
};

// Middleware pre-save: encriptar password y generar códigos únicos
usuarioSchema.pre('save', async function(next) {
  // Encriptar password solo si fue modificada
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  // Generar numero_cuenta si no existe
  if (!this.numero_cuenta) {
    this.numero_cuenta = generarNumeroCuenta();
  }
  
  // Generar qr_code (UUID) si no existe
  if (!this.qr_code) {
    this.qr_code = uuidv4();
  }
  
  next();
});

// Método para comparar passwords
usuarioSchema.methods.compararPassword = async function(passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

// Método para obtener datos públicos (sin password ni datos sensibles)
usuarioSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    apellido: this.apellido,
    correo: this.correo,
    telefono: this.telefono,
    saldo_bp: this.saldo_bp,
    saldo_deuna: this.saldo_deuna,
    numero_cuenta: this.numero_cuenta,
    qr_code: this.qr_code
  };
};

// Método para obtener datos mínimos (para mostrar al receptor)
usuarioSchema.methods.toMinimalJSON = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    apellido: this.apellido,
    numero_cuenta_masked: '******' + this.numero_cuenta.slice(-4)
  };
};

module.exports = mongoose.model('Usuario', usuarioSchema);
