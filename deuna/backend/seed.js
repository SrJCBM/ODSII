const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Usuario = require('./models/Usuario');

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    process.exit(1);
  }
};

// Datos de usuarios de prueba
const usuariosSeed = [
  {
    nombre: 'Julio Cesar',
    apellido: 'Blacio Machuca',
    ci: '0706499860',
    correo: 'jcblaciomachuca@gmail.com',
    password: 'Julio38_',
    telefono: '0987654321',
    saldo_bp: 274.00,
    saldo_deuna: 0.00,
    numero_cuenta: '2208910273'
    // qr_code se genera automáticamente (UUID)
  },
  {
    nombre: 'María',
    apellido: 'González Pérez',
    ci: '0102030405',
    correo: 'maria.gonzalez@ejemplo.com',
    password: 'Maria123!',
    telefono: '0991234567',
    saldo_bp: 1500.00,
    saldo_deuna: 250.00,
    numero_cuenta: '2256789123'
  },
  {
    nombre: 'Carlos',
    apellido: 'Ramírez Torres',
    ci: '0203040506',
    correo: 'carlos.ramirez@ejemplo.com',
    password: 'Carlos456!',
    telefono: '0992345678',
    saldo_bp: 800.00,
    saldo_deuna: 50.00,
    numero_cuenta: '2278912345'
  },
  {
    nombre: 'Ana',
    apellido: 'Martínez Silva',
    ci: '0304050607',
    correo: 'ana.martinez@ejemplo.com',
    password: 'Ana789!',
    telefono: '0993456789',
    saldo_bp: 2000.00,
    saldo_deuna: 500.00,
    numero_cuenta: '2212345678'
  },
  {
    nombre: 'Luis',
    apellido: 'Fernández Castro',
    ci: '0405060708',
    correo: 'luis.fernandez@ejemplo.com',
    password: 'Luis321!',
    telefono: '0994567890',
    saldo_bp: 350.00,
    saldo_deuna: 0.00,
    numero_cuenta: '2234567890'
  }
];

// Función para poblar la base de datos
const seedDB = async () => {
  try {
    // Limpiar colección de usuarios (opcional - comentar si quieres mantener datos existentes)
    console.log('🗑️  Limpiando usuarios existentes...');
    await Usuario.deleteMany({});

    // Insertar usuarios de prueba
    console.log('📝 Creando usuarios de prueba...');
    
    for (const userData of usuariosSeed) {
      const usuario = await Usuario.create(userData);
      console.log(`   ✅ ${usuario.nombre} ${usuario.apellido}`);
      console.log(`      📧 ${usuario.correo}`);
      console.log(`      🔢 Cuenta: ${usuario.numero_cuenta}`);
      console.log(`      🔐 QR Code: ${usuario.qr_code}`);
      console.log(`      💰 BP: $${usuario.saldo_bp} | Deuna: $${usuario.saldo_deuna}`);
      console.log('');
    }

    console.log('✨ Base de datos poblada exitosamente!');
    console.log('');
    console.log('📱 Usuarios creados:');
    console.log('==========================================');
    
    const usuarios = await Usuario.find({});
    usuarios.forEach(u => {
      console.log(`${u.nombre} ${u.apellido}`);
      console.log(`  Email: ${u.correo}`);
      console.log(`  Cuenta: ******${u.numero_cuenta.slice(-4)}`);
      console.log(`  QR: ${u.qr_code}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
  }
};

// Ejecutar seed
const run = async () => {
  await connectDB();
  await seedDB();
  mongoose.connection.close();
  console.log('🔌 Conexión cerrada');
};

run();
