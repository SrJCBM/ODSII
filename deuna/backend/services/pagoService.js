const Usuario = require('../models/Usuario');
const Transaccion = require('../models/Transaccion');

/**
 * Servicio de pagos - Contiene toda la lógica de negocio
 * para procesar pagos QR con recarga automática
 */
class PagoService {
  
  /**
   * Procesa un pago QR con la lógica de recarga automática
   * @param {string} emisorId - ID del usuario que paga
   * @param {string} receptorQr - Código QR del receptor
   * @param {number} monto - Monto a pagar
   * @param {string} descripcion - Descripción opcional del pago
   * @returns {Object} Resultado del pago con transacción y saldos
   */
  async procesarPagoQR(emisorId, receptorQr, monto, descripcion = '') {
    // 1. Validar monto
    if (!monto || monto <= 0) {
      throw { statusCode: 400, message: 'El monto debe ser mayor a 0' };
    }

    // 2. Buscar emisor (quien paga)
    const emisor = await Usuario.findById(emisorId);
    if (!emisor) {
      throw { statusCode: 404, message: 'Usuario emisor no encontrado' };
    }

    // 3. Buscar receptor por qr_code
    const receptor = await Usuario.findOne({ qr_code: receptorQr });
    if (!receptor) {
      throw { statusCode: 404, message: 'Código QR inválido. Usuario receptor no encontrado' };
    }

    // 4. Verificar que no se pague a sí mismo
    if (emisor._id.equals(receptor._id)) {
      throw { statusCode: 400, message: 'No puedes pagarte a ti mismo' };
    }

    // 5. Calcular si necesita recarga automática
    let recargaAutomatica = false;
    let montoRecargado = 0;
    let fuente = 'deuna';

    if (emisor.saldo_deuna >= monto) {
      // Caso simple: tiene suficiente en Deuna
      fuente = 'deuna';
    } else {
      // Necesita recarga desde BP
      const faltante = monto - emisor.saldo_deuna;
      
      // Verificar si tiene suficiente en BP
      if (emisor.saldo_bp < faltante) {
        throw { 
          statusCode: 400, 
          message: `Saldo insuficiente. Necesitas $${faltante.toFixed(2)} más en tu cuenta Banco Pichincha.` 
        };
      }

      // Realizar recarga automática
      recargaAutomatica = true;
      montoRecargado = faltante;
      fuente = emisor.saldo_deuna > 0 ? 'mixto' : 'bp';

      // Transferir de BP a Deuna
      emisor.saldo_bp -= faltante;
      emisor.saldo_deuna += faltante;
    }

    // 6. Realizar el pago (debitar de Deuna del emisor)
    emisor.saldo_deuna -= monto;

    // 7. Acreditar al receptor
    receptor.saldo_deuna += monto;

    // 8. Guardar cambios en ambos usuarios
    await emisor.save();
    await receptor.save();

    // 9. Generar número de transacción único
    const numeroTransaccion = await Transaccion.generarNumeroTransaccion();

    // 10. Registrar la transacción
    const transaccion = await Transaccion.create({
      numero_transaccion: numeroTransaccion,
      tipo: 'pago_qr',
      emisor_id: emisor._id,
      receptor_id: receptor._id,
      monto: monto,
      fuente: fuente,
      recarga_automatica: recargaAutomatica,
      monto_recargado: montoRecargado,
      estado: 'completada',
      descripcion: descripcion || (recargaAutomatica 
        ? `Pago QR con recarga automática de $${montoRecargado.toFixed(2)} desde BP`
        : 'Pago QR')
    });

    // 11. Retornar resultado completo
    return {
      transaccion: transaccion.toJSON(),
      qr_validacion: transaccion.numero_transaccion, // QR para validar el pago
      emisor: {
        nombre: emisor.nombre,
        apellido: emisor.apellido,
        saldo_bp: emisor.saldo_bp,
        saldo_deuna: emisor.saldo_deuna
      },
      receptor: receptor.toMinimalJSON(),
      resumen: {
        monto_pagado: monto,
        recarga_automatica: recargaAutomatica,
        monto_recargado: montoRecargado,
        mensaje: recargaAutomatica
          ? `Se recargaron automáticamente $${montoRecargado.toFixed(2)} desde tu cuenta BP`
          : 'Pago realizado exitosamente'
      }
    };
  }
}

module.exports = new PagoService();
