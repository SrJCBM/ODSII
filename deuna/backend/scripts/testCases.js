const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Usuario = require('../models/Usuario');
  const Cuenta = require('../models/Cuenta');
  const Transaccion = require('../models/Transaccion');
  
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║           CASOS DE PRUEBA - DEUNA TRANSFERENCIAS             ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  console.log('=== USUARIOS DISPONIBLES ===\n');
  const usuarios = await Usuario.find({}).select('nombre apellido correo telefono numero_cuenta saldo_deuna saldo_bp qr_code');
  
  usuarios.forEach((u, i) => {
    console.log((i+1) + '. ' + u.nombre + ' ' + u.apellido);
    console.log('   Email: ' + u.correo);
    console.log('   Telefono: ' + u.telefono);
    console.log('   Cuenta: ' + u.numero_cuenta);
    console.log('   Saldo Deuna: $' + u.saldo_deuna.toFixed(2));
    console.log('   Saldo BP: $' + u.saldo_bp.toFixed(2));
    console.log('   QR: ' + u.qr_code);
    console.log('');
  });
  
  console.log('\n=== ULTIMAS 5 TRANSACCIONES ===\n');
  const txs = await Transaccion.find({})
    .populate('emisor_id', 'nombre apellido')
    .populate('receptor_id', 'nombre apellido')
    .sort({createdAt: -1})
    .limit(5);
    
  txs.forEach(t => {
    const emisor = t.emisor_id ? t.emisor_id.nombre + ' ' + t.emisor_id.apellido : 'N/A';
    const receptor = t.receptor_id ? t.receptor_id.nombre + ' ' + t.receptor_id.apellido : 'N/A';
    console.log('- ' + t.tipo.toUpperCase() + ' | $' + t.monto.toFixed(2) + ' | ' + t.estado.toUpperCase());
    console.log('  De: ' + emisor + ' -> Para: ' + receptor);
    console.log('  TX: ' + t.numero_transaccion);
    console.log('');
  });
  
  console.log('\n=== CASOS DE PRUEBA SUGERIDOS ===\n');
  
  console.log('CASO 1: Transfer exitosa por CUENTA');
  console.log('--------------------------------------');
  console.log('Login: jcblaciomachuca@gmail.com / Julio38_');
  console.log('Destino (cuenta): 2256789123 (Maria Gonzalez)');
  console.log('Monto: $25.00');
  console.log('Comision esperada: $0.13 (0.5%)');
  console.log('Total: $25.13\n');
  
  console.log('CASO 2: Transfer exitosa por TELEFONO');
  console.log('--------------------------------------');
  console.log('Login: jcblaciomachuca@gmail.com / Julio38_');
  console.log('Destino (telefono): 0992345678 (Carlos Ramirez)');
  console.log('Monto: $50.00');
  console.log('Comision esperada: $0.25 (0.5%)');
  console.log('Total: $50.25\n');
  
  console.log('CASO 3: Transfer exitosa por CORREO');
  console.log('--------------------------------------');
  console.log('Login: jcblaciomachuca@gmail.com / Julio38_');
  console.log('Destino (correo): ana.martinez@ejemplo.com');
  console.log('Monto: $100.00');
  console.log('Comision esperada: $0.50 (0.5%)');
  console.log('Total: $100.50\n');
  
  console.log('CASO 4: Transfer con RECARGA AUTOMATICA');
  console.log('--------------------------------------');
  console.log('Login: jcblaciomachuca@gmail.com / Julio38_');
  console.log('Saldo Deuna actual: $' + usuarios[0].saldo_deuna.toFixed(2));
  console.log('Saldo BP actual: $' + usuarios[0].saldo_bp.toFixed(2));
  console.log('Destino: 2256789123');
  console.log('Monto: $300.00 (mayor al saldo Deuna)');
  console.log('Se recargara automaticamente desde BP\n');
  
  console.log('CASO 5: Transfer FALLIDA - Saldo insuficiente');
  console.log('--------------------------------------');
  console.log('Login: andres.pacheco@ejemplo.com / Andres44!');
  console.log('Saldo Deuna: $0.00, Saldo BP: $175.00');
  console.log('Destino: 2256789123');
  console.log('Monto: $1000.00');
  console.log('Resultado esperado: Error saldo insuficiente\n');
  
  console.log('CASO 6: Transfer a SI MISMO (debe fallar)');
  console.log('--------------------------------------');
  console.log('Login: jcblaciomachuca@gmail.com / Julio38_');
  console.log('Destino: 2208910273 (su propia cuenta)');
  console.log('Resultado esperado: Error - No puedes transferirte a ti mismo\n');
  
  console.log('CASO 7: Buscar usuario INEXISTENTE');
  console.log('--------------------------------------');
  console.log('Login: jcblaciomachuca@gmail.com / Julio38_');
  console.log('Destino: 9999999999');
  console.log('Resultado esperado: Usuario no encontrado\n');
  
  await mongoose.connection.close();
  console.log('Conexion cerrada.');
}

main().catch(console.error);
