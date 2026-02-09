const Usuario = require('../models/Usuario');
const Transaccion = require('../models/Transaccion');
const Auditoria = require('../models/Auditoria');

/**
 * Servicio de Transferencias
 * Maneja transferencias directas entre cuentas
 */
class TransferenciaService {
  
  // Porcentaje de comisión para transferencias
  static COMISION_PORCENTAJE = 0.005; // 0.5%
  static COMISION_MINIMA = 0.10;
  static COMISION_MAXIMA = 5.00;

  /**
   * Calcular comisión de transferencia
   */
  static calcularComision(monto) {
    let comision = monto * this.COMISION_PORCENTAJE;
    comision = Math.max(comision, this.COMISION_MINIMA);
    comision = Math.min(comision, this.COMISION_MAXIMA);
    return Math.round(comision * 100) / 100; // Redondear a 2 decimales
  }

  /**
   * Transferir dinero entre usuarios por número de cuenta o teléfono
   */
  async transferir(emisorId, destinatario, monto, descripcion = '', ipOrigen = '') {
    // 1. Validar monto
    if (!monto || monto <= 0) {
      throw { statusCode: 400, message: 'El monto debe ser mayor a 0' };
    }

    // 2. Buscar emisor
    const emisor = await Usuario.findById(emisorId);
    if (!emisor) {
      throw { statusCode: 404, message: 'Usuario emisor no encontrado' };
    }

    // 3. Buscar receptor por número de cuenta, teléfono o correo
    let receptor = await Usuario.findOne({
      $or: [
        { numero_cuenta: destinatario },
        { telefono: destinatario },
        { correo: destinatario.toLowerCase() }
      ]
    });

    if (!receptor) {
      throw { statusCode: 404, message: 'Destinatario no encontrado. Verifica el número de cuenta, teléfono o correo.' };
    }

    // 4. Verificar que no sea a sí mismo
    if (emisor._id.equals(receptor._id)) {
      throw { statusCode: 400, message: 'No puedes transferirte a ti mismo' };
    }

    // 5. Calcular comisión
    const comision = TransferenciaService.calcularComision(monto);
    const montoTotal = monto + comision;

    // 6. Verificar saldo (primero Deuna, luego BP si es necesario)
    let fuente = 'deuna';
    let recargaAutomatica = false;
    let montoRecargado = 0;

    if (emisor.saldo_deuna >= montoTotal) {
      fuente = 'deuna';
    } else if ((emisor.saldo_deuna + emisor.saldo_bp) >= montoTotal) {
      // Recarga automática desde BP
      fuente = 'mixto';
      recargaAutomatica = true;
      montoRecargado = montoTotal - emisor.saldo_deuna;
      
      // Transferir de BP a Deuna
      emisor.saldo_bp -= montoRecargado;
      emisor.saldo_deuna += montoRecargado;
    } else {
      throw { 
        statusCode: 400, 
        message: `Saldo insuficiente. Necesitas $${montoTotal.toFixed(2)} (incluye comisión de $${comision.toFixed(2)})` 
      };
    }

    // 7. Generar número de transacción
    const numeroTransaccion = await Transaccion.generarNumeroTransaccion();

    // 8. Crear transacción en estado PENDIENTE
    const transaccion = await Transaccion.create({
      numero_transaccion: numeroTransaccion,
      tipo: 'transferencia',
      emisor_id: emisor._id,
      receptor_id: receptor._id,
      monto: monto,
      comision: comision,
      monto_total: montoTotal,
      fuente: fuente,
      recarga_automatica: recargaAutomatica,
      monto_recargado: montoRecargado,
      estado: 'pendiente',
      descripcion: descripcion || 'Transferencia Deuna'
    });

    try {
      // 9. Ejecutar transferencia
      emisor.saldo_deuna -= montoTotal;
      receptor.saldo_deuna += monto; // El receptor recibe sin comisión

      await emisor.save();
      await receptor.save();

      // 10. Marcar como completada
      transaccion.estado = 'completada';
      await transaccion.save();

      // 11. Registrar auditoría
      await Auditoria.registrar({
        usuario_id: emisor._id,
        accion: 'transferencia',
        entidad: 'transaccion',
        entidad_id: transaccion._id,
        descripcion: `Transferencia de $${monto} a ${receptor.nombre} ${receptor.apellido}`,
        datos_nuevos: {
          receptor: receptor._id,
          monto,
          comision,
          montoTotal
        },
        ip_origen: ipOrigen,
        estado: 'exitoso',
        monto: montoTotal
      });

      return {
        transaccion: transaccion.toJSON(),
        emisor: {
          nombre: emisor.nombre,
          apellido: emisor.apellido,
          saldo_deuna: emisor.saldo_deuna,
          saldo_bp: emisor.saldo_bp
        },
        receptor: {
          nombre: receptor.nombre,
          apellido: receptor.apellido,
          numero_cuenta_masked: '******' + receptor.numero_cuenta.slice(-4)
        },
        resumen: {
          monto_enviado: monto,
          comision: comision,
          monto_total: montoTotal,
          recarga_automatica: recargaAutomatica,
          monto_recargado: montoRecargado
        }
      };

    } catch (error) {
      // Si falla, marcar como fallida
      transaccion.estado = 'fallida';
      await transaccion.save();

      await Auditoria.registrar({
        usuario_id: emisor._id,
        accion: 'transferencia',
        entidad: 'transaccion',
        entidad_id: transaccion._id,
        descripcion: `Error en transferencia: ${error.message}`,
        estado: 'fallido',
        error: error.message
      });

      throw error;
    }
  }

  /**
   * Reversar una transacción
   */
  async reversar(transaccionId, usuarioId, motivo, ipOrigen = '') {
    const transaccion = await Transaccion.findById(transaccionId);
    
    if (!transaccion) {
      throw { statusCode: 404, message: 'Transacción no encontrada' };
    }

    if (transaccion.estado !== 'completada') {
      throw { statusCode: 400, message: 'Solo se pueden reversar transacciones completadas' };
    }

    // Verificar que el usuario sea el emisor o admin
    if (transaccion.emisor_id.toString() !== usuarioId) {
      throw { statusCode: 403, message: 'No tienes permiso para reversar esta transacción' };
    }

    // Verificar tiempo límite (24 horas)
    const horasDesdeTransaccion = (Date.now() - transaccion.createdAt) / (1000 * 60 * 60);
    if (horasDesdeTransaccion > 24) {
      throw { statusCode: 400, message: 'Las transacciones solo pueden reversarse dentro de las primeras 24 horas' };
    }

    const emisor = await Usuario.findById(transaccion.emisor_id);
    const receptor = await Usuario.findById(transaccion.receptor_id);

    if (!emisor || !receptor) {
      throw { statusCode: 404, message: 'Usuarios no encontrados' };
    }

    // Verificar que el receptor tenga saldo
    if (receptor.saldo_deuna < transaccion.monto) {
      throw { statusCode: 400, message: 'El receptor no tiene saldo suficiente para el reverso' };
    }

    // Generar transacción de reverso
    const numeroTransaccion = await Transaccion.generarNumeroTransaccion();
    
    const reverso = await Transaccion.create({
      numero_transaccion: numeroTransaccion,
      tipo: 'transferencia',
      emisor_id: receptor._id, // El receptor devuelve
      receptor_id: emisor._id, // El emisor original recibe
      monto: transaccion.monto,
      comision: 0, // Sin comisión en reversos
      monto_total: transaccion.monto,
      fuente: 'deuna',
      estado: 'completada',
      descripcion: `Reverso de transacción ${transaccion.numero_transaccion}`,
      transaccion_original_id: transaccion._id,
      motivo_reverso: motivo
    });

    // Ejecutar reverso
    receptor.saldo_deuna -= transaccion.monto;
    emisor.saldo_deuna += transaccion.monto;

    await emisor.save();
    await receptor.save();

    // Marcar transacción original como reversada
    transaccion.estado = 'reversada';
    transaccion.reversada_en = new Date();
    transaccion.motivo_reverso = motivo;
    await transaccion.save();

    // Auditoría
    await Auditoria.registrar({
      usuario_id: usuarioId,
      accion: 'reverso',
      entidad: 'transaccion',
      entidad_id: transaccion._id,
      descripcion: `Reverso de transacción ${transaccion.numero_transaccion}: ${motivo}`,
      datos_anteriores: { estado: 'completada' },
      datos_nuevos: { estado: 'reversada', reverso_id: reverso._id },
      ip_origen: ipOrigen,
      estado: 'exitoso',
      monto: transaccion.monto
    });

    return {
      reverso: reverso.toJSON(),
      transaccion_original: transaccion.toJSON(),
      mensaje: 'Transacción reversada exitosamente'
    };
  }
}

module.exports = new TransferenciaService();
