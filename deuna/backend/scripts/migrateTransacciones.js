/**
 * Script de migración para agregar numero_transaccion a transacciones existentes
 * 
 * Ejecutar con: node scripts/migrateTransacciones.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const TransaccionSchema = new mongoose.Schema({
  numero_transaccion: String,
  tipo: String,
  emisor_id: mongoose.Schema.Types.ObjectId,
  receptor_id: mongoose.Schema.Types.ObjectId,
  monto: Number,
  fuente: String,
  recarga_automatica: Boolean,
  monto_recargado: Number,
  estado: String,
  descripcion: String
}, { timestamps: true });

const Transaccion = mongoose.model('Transaccion', TransaccionSchema);

async function generarNumeroUnico() {
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let numeroUnico;
  let existe = true;

  while (existe) {
    const random = Math.floor(10000000 + Math.random() * 90000000);
    numeroUnico = `TX${fecha}-${random}`;
    existe = await Transaccion.findOne({ numero_transaccion: numeroUnico });
  }

  return numeroUnico;
}

async function migrate() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Buscar transacciones sin numero_transaccion
    const transaccionesSinNumero = await Transaccion.find({
      $or: [
        { numero_transaccion: { $exists: false } },
        { numero_transaccion: null },
        { numero_transaccion: '' }
      ]
    });

    console.log(`📋 Encontradas ${transaccionesSinNumero.length} transacciones sin número`);

    if (transaccionesSinNumero.length === 0) {
      console.log('✨ No hay transacciones que migrar');
      process.exit(0);
    }

    let migradas = 0;
    let errores = 0;

    for (const tx of transaccionesSinNumero) {
      try {
        const nuevoNumero = await generarNumeroUnico();
        
        await Transaccion.updateOne(
          { _id: tx._id },
          { $set: { numero_transaccion: nuevoNumero } }
        );
        
        migradas++;
        console.log(`  ✅ ${tx._id} -> ${nuevoNumero}`);
      } catch (err) {
        errores++;
        console.log(`  ❌ Error en ${tx._id}: ${err.message}`);
      }
    }

    console.log('\n📊 Resumen de migración:');
    console.log(`   ✅ Migradas: ${migradas}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log(`   📋 Total: ${transaccionesSinNumero.length}`);

  } catch (error) {
    console.error('❌ Error de migración:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
    process.exit(0);
  }
}

migrate();
