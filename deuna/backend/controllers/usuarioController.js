const Usuario = require('../models/Usuario');
const Transaccion = require('../models/Transaccion');
const Auditoria = require('../models/Auditoria');

/**
 * Obtener datos del usuario autenticado
 * GET /api/usuarios/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.userId);
    
    if (!usuario) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    res.json({
      usuario: usuario.toPublicJSON()
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Buscar usuario por código QR (para resolver receptor al escanear)
 * GET /api/usuarios/qr/:codigo
 */
exports.getByQR = async (req, res, next) => {
  try {
    const { codigo } = req.params;

    const usuario = await Usuario.findOne({ qr_code: codigo });
    
    if (!usuario) {
      return res.status(404).json({ 
        error: 'Código QR inválido. Usuario no encontrado' 
      });
    }

    // Solo devolver datos mínimos (por seguridad)
    res.json({
      usuario: usuario.toMinimalJSON()
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Recargar saldo desde Banco Pichincha a Deuna
 * POST /api/usuarios/recargar
 */
exports.recargar = async (req, res, next) => {
  try {
    const { monto } = req.body;
    const userId = req.userId;

    // Validar monto
    if (!monto || monto < 3) {
      return res.status(400).json({ 
        error: 'El monto mínimo de recarga es $3.00' 
      });
    }

    const usuario = await Usuario.findById(userId);
    
    if (!usuario) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    // Verificar saldo suficiente en BP
    if (usuario.saldo_bp < monto) {
      return res.status(400).json({ 
        error: 'Saldo insuficiente en Banco Pichincha' 
      });
    }

    // Realizar la recarga
    usuario.saldo_bp -= monto;
    usuario.saldo_deuna += monto;
    await usuario.save();

    // Crear transacción de recarga para el historial
    const transaccion = new Transaccion({
      tipo: 'recarga',
      emisor_id: userId,
      receptor_id: userId, // Mismo usuario (de BP a Deuna)
      monto: monto,
      comision: 0,
      monto_total: monto,
      fuente: 'bp',
      estado: 'completada',
      descripcion: 'Recarga desde Banco Pichincha'
    });
    await transaccion.save();

    // Registrar auditoría
    await Auditoria.create({
      usuario_id: userId,
      accion: 'RECARGA',
      entidad: 'Transaccion',
      descripcion: `Recarga de $${monto.toFixed(2)} desde BP a Deuna`,
      datos_anteriores: { saldo_bp: usuario.saldo_bp + monto, saldo_deuna: usuario.saldo_deuna - monto },
      datos_nuevos: { saldo_bp: usuario.saldo_bp, saldo_deuna: usuario.saldo_deuna }
    });

    res.json({
      mensaje: 'Recarga exitosa',
      saldo_bp: usuario.saldo_bp,
      saldo_deuna: usuario.saldo_deuna,
      transaccion: {
        numero_transaccion: transaccion.numero_transaccion,
        monto: transaccion.monto,
        estado: transaccion.estado
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Buscar usuario por cuenta, teléfono o correo
 * GET /api/usuarios/buscar?cuenta=XXX&telefono=XXX&correo=XXX
 */
exports.buscar = async (req, res, next) => {
  try {
    const { cuenta, telefono, correo } = req.query;
    const userId = req.userId;
    
    let query = {};
    
    if (cuenta) {
      query.numero_cuenta = cuenta;
    } else if (telefono) {
      query.telefono = telefono;
    } else if (correo) {
      query.correo = correo.toLowerCase();
    } else {
      return res.status(400).json({
        error: 'Debes proporcionar cuenta, teléfono o correo'
      });
    }

    const usuario = await Usuario.findOne(query);
    
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    // No permitir transferirse a sí mismo
    if (usuario._id.toString() === userId) {
      return res.status(400).json({
        error: 'No puedes transferirte a ti mismo'
      });
    }

    res.json({
      usuario: usuario.toMinimalJSON()
    });

  } catch (error) {
    next(error);
  }
};
