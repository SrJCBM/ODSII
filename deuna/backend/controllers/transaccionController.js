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
      const esRecarga = t.tipo === 'recarga' && t.emisor_id._id.toString() === t.receptor_id._id.toString();

      if (esRecarga) {
        return {
          id: t._id,
          numero_transaccion: t.numero_transaccion,
          tipo: t.tipo,
          monto: t.monto,
          fuente: t.fuente,
          recarga_automatica: false,
          monto_recargado: 0,
          estado: t.estado,
          descripcion: t.descripcion || 'Recarga desde Banco Pichincha',
          fecha: t.createdAt,
          direccion: 'recarga',
          contraparte: {
            nombre: 'Banco',
            apellido: 'Pichincha',
            cuenta_masked: 'BP → Deuna'
          }
        };
      }

      return {
        id: t._id,
        numero_transaccion: t.numero_transaccion,
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

/**
 * Consulta avanzada de transacciones con filtros, búsqueda y paginación
 * GET /api/transacciones/consulta
 * Query params:
 *   - estado: filtrar por estado (pendiente, completada, fallida, reversada, expirada)
 *   - tipo: filtrar por tipo (pago_qr, transferencia, recarga)
 *   - desde: fecha inicio (ISO string)
 *   - hasta: fecha fin (ISO string)
 *   - monto_min: monto mínimo
 *   - monto_max: monto máximo
 *   - buscar: búsqueda por descripción o número de transacción
 *   - pagina: número de página (default 1)
 *   - limite: registros por página (default 10, max 100)
 *   - ordenar: campo para ordenar (fecha, monto, estado)
 *   - orden: asc o desc (default desc)
 */
exports.consultaAvanzada = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      estado,
      tipo,
      desde,
      hasta,
      monto_min,
      monto_max,
      buscar,
      pagina = 1,
      limite = 10,
      ordenar = 'fecha',
      orden = 'desc'
    } = req.query;

    // Construir filtro base
    const filtro = {
      $or: [
        { emisor_id: userId },
        { receptor_id: userId }
      ]
    };

    // Filtros opcionales
    if (estado) {
      filtro.estado = estado;
    }

    if (tipo) {
      filtro.tipo = tipo;
    }

    if (desde || hasta) {
      filtro.createdAt = {};
      if (desde) filtro.createdAt.$gte = new Date(desde);
      if (hasta) filtro.createdAt.$lte = new Date(hasta);
    }

    if (monto_min || monto_max) {
      filtro.monto = {};
      if (monto_min) filtro.monto.$gte = parseFloat(monto_min);
      if (monto_max) filtro.monto.$lte = parseFloat(monto_max);
    }

    if (buscar) {
      filtro.$and = [
        { $or: filtro.$or },
        {
          $or: [
            { descripcion: { $regex: buscar, $options: 'i' } },
            { numero_transaccion: { $regex: buscar, $options: 'i' } },
            { referencia: { $regex: buscar, $options: 'i' } }
          ]
        }
      ];
      delete filtro.$or;
    }

    // Ordenamiento
    const camposOrden = {
      fecha: 'createdAt',
      monto: 'monto',
      estado: 'estado'
    };
    const sortField = camposOrden[ordenar] || 'createdAt';
    const sortOrder = orden === 'asc' ? 1 : -1;

    // Paginación
    const limiteNum = Math.min(Math.max(parseInt(limite), 1), 100);
    const paginaNum = Math.max(parseInt(pagina), 1);
    const skip = (paginaNum - 1) * limiteNum;

    // Ejecutar consulta con agregación para join de usuarios
    const [transacciones, totalDocs] = await Promise.all([
      Transaccion.find(filtro)
        .populate('emisor_id', 'nombre apellido correo telefono numero_cuenta')
        .populate('receptor_id', 'nombre apellido correo telefono numero_cuenta')
        .populate('transaccion_original_id', 'numero_transaccion monto')
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limiteNum),
      Transaccion.countDocuments(filtro)
    ]);

    // Estadísticas agregadas
    const estadisticas = await Transaccion.aggregate([
      { $match: { $or: [{ emisor_id: userId }, { receptor_id: userId }] } },
      {
        $group: {
          _id: '$estado',
          count: { $sum: 1 },
          total_monto: { $sum: '$monto' },
          promedio_monto: { $avg: '$monto' }
        }
      }
    ]);

    // Formatear respuesta
    const transaccionesFormateadas = transacciones.map(t => {
      const esEmisor = t.emisor_id?._id.toString() === userId;
      return {
        id: t._id,
        numero_transaccion: t.numero_transaccion,
        tipo: t.tipo,
        monto: t.monto,
        comision: t.comision || 0,
        monto_total: t.monto_total || t.monto,
        fuente: t.fuente,
        estado: t.estado,
        descripcion: t.descripcion,
        referencia: t.referencia,
        fecha: t.createdAt,
        expira_en: t.expira_en,
        direccion: esEmisor ? 'enviado' : 'recibido',
        emisor: t.emisor_id ? {
          id: t.emisor_id._id,
          nombre: `${t.emisor_id.nombre} ${t.emisor_id.apellido}`,
          correo: t.emisor_id.correo,
          telefono: t.emisor_id.telefono
        } : null,
        receptor: t.receptor_id ? {
          id: t.receptor_id._id,
          nombre: `${t.receptor_id.nombre} ${t.receptor_id.apellido}`,
          correo: t.receptor_id.correo,
          telefono: t.receptor_id.telefono
        } : null,
        transaccion_original: t.transaccion_original_id ? {
          numero: t.transaccion_original_id.numero_transaccion,
          monto: t.transaccion_original_id.monto
        } : null,
        motivo_reverso: t.motivo_reverso,
        reversada_en: t.reversada_en
      };
    });

    res.json({
      transacciones: transaccionesFormateadas,
      paginacion: {
        pagina_actual: paginaNum,
        total_paginas: Math.ceil(totalDocs / limiteNum),
        total_registros: totalDocs,
        registros_por_pagina: limiteNum
      },
      filtros_aplicados: {
        estado, tipo, desde, hasta, monto_min, monto_max, buscar
      },
      estadisticas: estadisticas.reduce((acc, e) => {
        acc[e._id] = {
          cantidad: e.count,
          total: e.total_monto.toFixed(2),
          promedio: e.promedio_monto.toFixed(2)
        };
        return acc;
      }, {})
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Reporte de transacciones agrupado por período
 * GET /api/transacciones/reporte
 * Query params:
 *   - periodo: dia, semana, mes (default mes)
 *   - desde: fecha inicio
 *   - hasta: fecha fin
 */
exports.reporteTransacciones = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { periodo = 'mes', desde, hasta } = req.query;

    const matchFiltro = {
      $or: [
        { emisor_id: userId },
        { receptor_id: userId }
      ],
      estado: 'completada'
    };

    if (desde || hasta) {
      matchFiltro.createdAt = {};
      if (desde) matchFiltro.createdAt.$gte = new Date(desde);
      if (hasta) matchFiltro.createdAt.$lte = new Date(hasta);
    }

    // Definir agrupación por período
    const groupBy = {
      dia: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      semana: { $dateToString: { format: '%Y-W%V', date: '$createdAt' } },
      mes: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
    };

    const reporte = await Transaccion.aggregate([
      { $match: matchFiltro },
      {
        $group: {
          _id: groupBy[periodo] || groupBy.mes,
          total_transacciones: { $sum: 1 },
          monto_total: { $sum: '$monto' },
          comisiones_total: { $sum: { $ifNull: ['$comision', 0] } },
          monto_promedio: { $avg: '$monto' },
          monto_minimo: { $min: '$monto' },
          monto_maximo: { $max: '$monto' },
          tipos: { $addToSet: '$tipo' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]);

    // Totales generales
    const totales = await Transaccion.aggregate([
      { $match: matchFiltro },
      {
        $group: {
          _id: null,
          total_transacciones: { $sum: 1 },
          monto_total: { $sum: '$monto' },
          comisiones_total: { $sum: { $ifNull: ['$comision', 0] } }
        }
      }
    ]);

    res.json({
      reporte: reporte.map(r => ({
        periodo: r._id,
        transacciones: r.total_transacciones,
        monto_total: r.monto_total.toFixed(2),
        comisiones: r.comisiones_total.toFixed(2),
        promedio: r.monto_promedio.toFixed(2),
        minimo: r.monto_minimo.toFixed(2),
        maximo: r.monto_maximo.toFixed(2),
        tipos: r.tipos
      })),
      totales: totales[0] ? {
        transacciones: totales[0].total_transacciones,
        monto: totales[0].monto_total.toFixed(2),
        comisiones: totales[0].comisiones_total.toFixed(2)
      } : null,
      parametros: { periodo, desde, hasta }
    });

  } catch (error) {
    next(error);
  }
};
