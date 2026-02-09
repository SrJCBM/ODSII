const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Usuario = require('./models/Usuario');
const Cuenta = require('./models/Cuenta');
const Tarjeta = require('./models/Tarjeta');
const Transaccion = require('./models/Transaccion');

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

// Datos de usuarios de prueba (12 registros)
const usuariosSeed = [
  {
    nombre: 'Julio Cesar',
    apellido: 'Blacio Machuca',
    ci: '0706499860',
    correo: 'jcblaciomachuca@gmail.com',
    password: 'Julio38_',
    telefono: '0987654321',
    saldo_bp: 1000.00,
    saldo_deuna: 250.00,
    numero_cuenta: '2208910273'
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
    saldo_deuna: 100.00,
    numero_cuenta: '2234567890'
  },
  {
    nombre: 'Elena',
    apellido: 'Vargas Rojas',
    ci: '0506070809',
    correo: 'elena.vargas@ejemplo.com',
    password: 'Elena654!',
    telefono: '0995678901',
    saldo_bp: 3000.00,
    saldo_deuna: 750.00,
    numero_cuenta: '2245678901'
  },
  {
    nombre: 'Pedro',
    apellido: 'Sánchez López',
    ci: '0607080910',
    correo: 'pedro.sanchez@ejemplo.com',
    password: 'Pedro987!',
    telefono: '0996789012',
    saldo_bp: 450.00,
    saldo_deuna: 25.00,
    numero_cuenta: '2267890123'
  },
  {
    nombre: 'Sofía',
    apellido: 'Morales Díaz',
    ci: '0708091011',
    correo: 'sofia.morales@ejemplo.com',
    password: 'Sofia111!',
    telefono: '0997890123',
    saldo_bp: 1200.00,
    saldo_deuna: 300.00,
    numero_cuenta: '2289012345'
  },
  {
    nombre: 'Diego',
    apellido: 'Herrera Vega',
    ci: '0809101112',
    correo: 'diego.herrera@ejemplo.com',
    password: 'Diego222!',
    telefono: '0998901234',
    saldo_bp: 600.00,
    saldo_deuna: 150.00,
    numero_cuenta: '2201234567'
  },
  {
    nombre: 'Valentina',
    apellido: 'Cruz Mendoza',
    ci: '0910111213',
    correo: 'valentina.cruz@ejemplo.com',
    password: 'Vale333!',
    telefono: '0999012345',
    saldo_bp: 2500.00,
    saldo_deuna: 400.00,
    numero_cuenta: '2223456789'
  },
  {
    nombre: 'Andrés',
    apellido: 'Pacheco Ríos',
    ci: '1011121314',
    correo: 'andres.pacheco@ejemplo.com',
    password: 'Andres44!',
    telefono: '0990123456',
    saldo_bp: 175.00,
    saldo_deuna: 0.00,
    numero_cuenta: '2234567012'
  },
  {
    nombre: 'Camila',
    apellido: 'Ortiz Núñez',
    ci: '1112131415',
    correo: 'camila.ortiz@ejemplo.com',
    password: 'Camila55!',
    telefono: '0981234567',
    saldo_bp: 950.00,
    saldo_deuna: 200.00,
    numero_cuenta: '2245670123'
  }
];

// Función para generar número de tarjeta
const generarNumeroTarjeta = (marca) => {
  const prefijos = { visa: '4', mastercard: '5' };
  const prefijo = prefijos[marca] || '4';
  let numero = prefijo;
  for (let i = 0; i < 15; i++) {
    numero += Math.floor(Math.random() * 10);
  }
  return numero;
};

// Función para generar número de transacción
const generarNumeroTransaccion = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TX-${timestamp}-${random}`;
};

// Función para poblar la base de datos
const seedDB = async () => {
  try {
    // Limpiar colecciones
    console.log('🗑️  Limpiando colecciones existentes...');
    await Usuario.deleteMany({});
    await Cuenta.deleteMany({});
    await Tarjeta.deleteMany({});
    await Transaccion.deleteMany({});

    // =====================
    // CREAR USUARIOS (12)
    // =====================
    console.log('\n📝 Creando usuarios de prueba...');
    const usuariosCreados = [];
    
    for (const userData of usuariosSeed) {
      const usuario = await Usuario.create(userData);
      usuariosCreados.push(usuario);
      console.log(`   ✅ ${usuario.nombre} ${usuario.apellido} - ${usuario.correo}`);
    }
    console.log(`   📊 Total usuarios: ${usuariosCreados.length}`);

    // =====================
    // CREAR CUENTAS (18+)
    // =====================
    console.log('\n💳 Creando cuentas bancarias...');
    const cuentasCreadas = [];
    
    for (let i = 0; i < usuariosCreados.length; i++) {
      const usuario = usuariosCreados[i];
      
      // Cuenta Deuna para cada usuario
      const cuentaDeuna = await Cuenta.create({
        usuario_id: usuario._id,
        numero_cuenta: usuario.numero_cuenta,
        tipo_cuenta: 'ahorro',
        banco: 'deuna',
        saldo: usuario.saldo_deuna,
        estado: 'activa',
        limite_diario: 1000
      });
      cuentasCreadas.push(cuentaDeuna);
      
      // Cuenta BP para algunos usuarios (primeros 8)
      if (i < 8) {
        const cuentaBP = await Cuenta.create({
          usuario_id: usuario._id,
          numero_cuenta: `BP${usuario.numero_cuenta.slice(2)}`,
          tipo_cuenta: i % 2 === 0 ? 'ahorro' : 'corriente',
          banco: 'pichincha',
          saldo: usuario.saldo_bp,
          estado: 'activa',
          limite_diario: 2000
        });
        cuentasCreadas.push(cuentaBP);
        console.log(`   ✅ ${usuario.nombre}: Deuna + BP`);
      } else {
        console.log(`   ✅ ${usuario.nombre}: Deuna`);
      }
    }
    console.log(`   📊 Total cuentas: ${cuentasCreadas.length}`);

    // =====================
    // CREAR TARJETAS (12+)
    // =====================
    console.log('\n🎴 Creando tarjetas...');
    const tarjetasCreadas = [];
    const marcas = ['visa', 'mastercard'];
    const tipos = ['debito', 'credito'];
    
    for (let i = 0; i < Math.min(12, cuentasCreadas.length); i++) {
      const cuenta = cuentasCreadas[i];
      const marca = marcas[i % 2];
      const tipo = tipos[Math.floor(i / 4) % 2];
      
      const tarjeta = await Tarjeta.create({
        cuenta_id: cuenta._id,
        usuario_id: cuenta.usuario_id,
        numero_tarjeta: generarNumeroTarjeta(marca),
        tipo: tipo,
        marca: marca,
        cvv_hash: await bcrypt.hash(String(100 + i), 10),
        fecha_expiracion: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000 * (2 + i % 3))),
        limite_credito: tipo === 'credito' ? 2000 + (i * 500) : 0,
        estado: 'activa'
      });
      tarjetasCreadas.push(tarjeta);
      console.log(`   ✅ ${tipo} ${marca} **** ${tarjeta.numero_tarjeta.slice(-4)}`);
    }
    console.log(`   📊 Total tarjetas: ${tarjetasCreadas.length}`);

    // =====================
    // CREAR TRANSACCIONES (15+)
    // =====================
    console.log('\n📋 Creando transacciones...');
    const transaccionesData = [
      { emisor: 0, receptor: 1, tipo: 'pago_qr', monto: 25.50, estado: 'completada', desc: 'Pago por almuerzo' },
      { emisor: 1, receptor: 2, tipo: 'transferencia', monto: 100.00, estado: 'completada', desc: 'Transferencia a amigo' },
      { emisor: 2, receptor: 3, tipo: 'pago_qr', monto: 15.00, estado: 'completada', desc: 'Compra en tienda' },
      { emisor: 3, receptor: 0, tipo: 'transferencia', monto: 50.00, estado: 'completada', desc: 'Pago deuda' },
      { emisor: 4, receptor: 5, tipo: 'pago_qr', monto: 75.25, estado: 'completada', desc: 'Cena en restaurante' },
      { emisor: 5, receptor: 6, tipo: 'transferencia', monto: 200.00, estado: 'pendiente', desc: 'Préstamo pendiente' },
      { emisor: 6, receptor: 7, tipo: 'pago_qr', monto: 12.50, estado: 'completada', desc: 'Café y snack' },
      { emisor: 7, receptor: 8, tipo: 'transferencia', monto: 35.00, estado: 'completada', desc: 'Cuota gym' },
      { emisor: 8, receptor: 9, tipo: 'pago_qr', monto: 180.00, estado: 'fallida', desc: 'Intento de pago - saldo insuficiente' },
      { emisor: 9, receptor: 10, tipo: 'transferencia', monto: 45.00, estado: 'completada', desc: 'Colaboración evento' },
      { emisor: 10, receptor: 11, tipo: 'pago_qr', monto: 8.75, estado: 'completada', desc: 'Transporte compartido' },
      { emisor: 11, receptor: 0, tipo: 'transferencia', monto: 150.00, estado: 'completada', desc: 'Pago servicio' },
      { emisor: 0, receptor: 4, tipo: 'recarga', monto: 100.00, estado: 'completada', desc: 'Recarga desde BP' },
      { emisor: 1, receptor: 5, tipo: 'pago_qr', monto: 22.00, estado: 'reversada', desc: 'Pago reversado por error' },
      { emisor: 2, receptor: 6, tipo: 'transferencia', monto: 500.00, estado: 'expirada', desc: 'Transferencia grande expirada' }
    ];

    for (const tx of transaccionesData) {
      const emisor = usuariosCreados[tx.emisor];
      const receptor = usuariosCreados[tx.receptor];
      
      const comision = tx.tipo === 'transferencia' ? Math.min(Math.max(tx.monto * 0.005, 0.10), 5.00) : 0;
      
      await Transaccion.create({
        emisor_id: emisor._id,
        receptor_id: receptor._id,
        tipo: tx.tipo,
        monto: tx.monto,
        comision: comision,
        monto_total: tx.monto + comision,
        estado: tx.estado,
        descripcion: tx.desc,
        fuente: 'deuna',
        numero_transaccion: generarNumeroTransaccion(),
        referencia: `REF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        expira_en: tx.estado === 'pendiente' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
        motivo_reverso: tx.estado === 'reversada' ? 'Producto devuelto' : null,
        reversada_en: tx.estado === 'reversada' ? new Date() : null
      });
      
      console.log(`   ✅ ${tx.tipo} $${tx.monto} - ${tx.estado}`);
    }
    console.log(`   📊 Total transacciones: ${transaccionesData.length}`);

    // =====================
    // RESUMEN FINAL
    // =====================
    console.log('\n✨ ========================================');
    console.log('   BASE DE DATOS POBLADA EXITOSAMENTE!');
    console.log('   ========================================');
    console.log(`   👤 Usuarios: ${usuariosCreados.length}`);
    console.log(`   💳 Cuentas: ${cuentasCreadas.length}`);
    console.log(`   🎴 Tarjetas: ${tarjetasCreadas.length}`);
    console.log(`   📋 Transacciones: ${transaccionesData.length}`);
    console.log('   ========================================\n');

    // Mostrar credenciales de prueba
    console.log('📱 Credenciales de prueba:');
    console.log('==========================================');
    usuariosCreados.slice(0, 3).forEach(u => {
      const pwd = usuariosSeed.find(us => us.correo === u.correo)?.password;
      console.log(`${u.nombre} ${u.apellido}`);
      console.log(`  Email: ${u.correo}`);
      console.log(`  Password: ${pwd}`);
      console.log(`  Cuenta: ${u.numero_cuenta}`);
      console.log(`  QR: ${u.qr_code}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    console.error(error.stack);
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
