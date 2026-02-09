const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middlewares/auth');

// GET /api/usuarios/me - Obtener usuario autenticado
router.get('/me', auth, usuarioController.getMe);

// GET /api/usuarios/buscar - Buscar usuario por cuenta, teléfono o correo
router.get('/buscar', auth, usuarioController.buscar);

// GET /api/usuarios/qr/:codigo - Buscar usuario por código QR
router.get('/qr/:codigo', auth, usuarioController.getByQR);

// POST /api/usuarios/recargar - Recargar saldo desde BP a Deuna
router.post('/recargar', auth, usuarioController.recargar);

module.exports = router;
