const transferenciaService = require('../services/transferenciaService');

/**
 * Realizar transferencia
 * POST /api/transferencias
 */
exports.transferir = async (req, res, next) => {
  try {
    const { destinatario, monto, descripcion } = req.body;
    const emisorId = req.userId;
    const ipOrigen = req.ip || req.connection.remoteAddress;

    if (!destinatario || !monto) {
      return res.status(400).json({ 
        error: 'destinatario y monto son requeridos' 
      });
    }

    const resultado = await transferenciaService.transferir(
      emisorId, 
      destinatario, 
      parseFloat(monto),
      descripcion,
      ipOrigen
    );

    res.json({
      mensaje: 'Transferencia realizada exitosamente',
      ...resultado
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Reversar transferencia
 * POST /api/transferencias/:id/reversar
 */
exports.reversar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    const usuarioId = req.userId;
    const ipOrigen = req.ip || req.connection.remoteAddress;

    if (!motivo) {
      return res.status(400).json({ 
        error: 'El motivo del reverso es requerido' 
      });
    }

    const resultado = await transferenciaService.reversar(
      id,
      usuarioId,
      motivo,
      ipOrigen
    );

    res.json(resultado);

  } catch (error) {
    next(error);
  }
};
