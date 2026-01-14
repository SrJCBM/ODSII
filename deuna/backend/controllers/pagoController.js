const pagoService = require('../services/pagoService');

/**
 * Procesar pago QR
 * POST /api/pagos/qr
 */
exports.pagarQR = async (req, res, next) => {
  try {
    const { receptor_qr, monto, descripcion } = req.body;
    const emisorId = req.userId; // Viene del middleware auth

    // Validar campos requeridos
    if (!receptor_qr || !monto) {
      return res.status(400).json({ 
        error: 'receptor_qr y monto son requeridos' 
      });
    }

    // Delegar al servicio de pagos
    const resultado = await pagoService.procesarPagoQR(
      emisorId, 
      receptor_qr, 
      parseFloat(monto),
      descripcion
    );

    res.json({
      mensaje: 'Pago realizado exitosamente',
      ...resultado
    });

  } catch (error) {
    next(error);
  }
};
