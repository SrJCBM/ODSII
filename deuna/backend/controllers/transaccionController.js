const Transaccion = require('../models/Transaccion');

/**
 * Obtener historial de transacciones del usuario
 * GET /api/transacciones
 */
exports.getTransacciones = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Buscar transacciones donde el usuario es emisor o receptor
    const transacciones = await Transaccion.find({
      $or: [
        { emisor_id: userId },
        { receptor_id: userId }
      ]
    })
    .populate('emisor_id', 'nombre apellido numero_cuenta')
    .populate('receptor_id', 'nombre apellido numero_cuenta')
    .sort({ createdAt: -1 }) // Más recientes primero
    .limit(50); // Limitar a últimas 50

    // Formatear respuesta indicando si fue pago enviado o recibido
    const transaccionesFormateadas = transacciones.map(t => {
      const esEmisor = t.emisor_id._id.toString() === userId;
      return {
        id: t._id,
        tipo: t.tipo,
        monto: t.monto,
        fuente: t.fuente,
        recarga_automatica: t.recarga_automatica,
        monto_recargado: t.monto_recargado,
        estado: t.estado,
        descripcion: t.descripcion,
        fecha: t.createdAt,
        // Indicar dirección del flujo de dinero
        direccion: esEmisor ? 'enviado' : 'recibido',
        contraparte: esEmisor 
          ? {
              nombre: t.receptor_id.nombre,
              apellido: t.receptor_id.apellido,
              cuenta_masked: '******' + t.receptor_id.numero_cuenta.slice(-4)
            }
          : {
              nombre: t.emisor_id.nombre,
              apellido: t.emisor_id.apellido,
              cuenta_masked: '******' + t.emisor_id.numero_cuenta.slice(-4)
            }
      };
    });

    res.json({
      transacciones: transaccionesFormateadas,
      total: transaccionesFormateadas.length
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Obtener detalle de una transacción específica
 * GET /api/transacciones/:id
 */
exports.getTransaccionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const transaccion = await Transaccion.findById(id)
      .populate('emisor_id', 'nombre apellido numero_cuenta')
      .populate('receptor_id', 'nombre apellido numero_cuenta');

    if (!transaccion) {
      return res.status(404).json({ 
        error: 'Transacción no encontrada' 
      });
    }

    // Verificar que el usuario sea parte de la transacción
    const esEmisor = transaccion.emisor_id._id.toString() === userId;
    const esReceptor = transaccion.receptor_id._id.toString() === userId;

    if (!esEmisor && !esReceptor) {
      return res.status(403).json({ 
        error: 'No tienes permiso para ver esta transacción' 
      });
    }

    res.json({
      transaccion: {
        id: transaccion._id,
        tipo: transaccion.tipo,
        monto: transaccion.monto,
        fuente: transaccion.fuente,
        recarga_automatica: transaccion.recarga_automatica,
        monto_recargado: transaccion.monto_recargado,
        estado: transaccion.estado,
        descripcion: transaccion.descripcion,
        fecha: transaccion.createdAt,
        direccion: esEmisor ? 'enviado' : 'recibido',
        emisor: {
          nombre: transaccion.emisor_id.nombre,
          apellido: transaccion.emisor_id.apellido,
          cuenta_masked: '******' + transaccion.emisor_id.numero_cuenta.slice(-4)
        },
        receptor: {
          nombre: transaccion.receptor_id.nombre,
          apellido: transaccion.receptor_id.apellido,
          cuenta_masked: '******' + transaccion.receptor_id.numero_cuenta.slice(-4)
        }
      }
    });

  } catch (error) {
    next(error);
  }
};
