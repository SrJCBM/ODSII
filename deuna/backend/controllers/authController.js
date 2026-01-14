const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

/**
 * Registrar nuevo usuario
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { nombre, apellido, ci, correo, telefono, password } = req.body;

    // Validar campos requeridos
    if (!nombre || !apellido || !ci || !correo || !telefono || !password) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }

    // Crear usuario (el modelo genera automáticamente numero_cuenta y qr_code)
    const usuario = await Usuario.create({
      nombre,
      apellido,
      ci,
      correo,
      telefono,
      password
    });

    // Generar JWT
    const token = jwt.sign(
      { userId: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: usuario.toPublicJSON()
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Iniciar sesión
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { correo, password } = req.body;

    // Validar campos
    if (!correo || !password) {
      return res.status(400).json({ 
        error: 'Correo y contraseña son requeridos' 
      });
    }

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const passwordValida = await usuario.compararPassword(password);
    if (!passwordValida) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: usuario.toPublicJSON()
    });

  } catch (error) {
    next(error);
  }
};
