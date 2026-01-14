const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');
const auth = require('../middlewares/auth');

// GET /api/transacciones - Listar transacciones del usuario
router.get('/', auth, transaccionController.getTransacciones);

// GET /api/transacciones/:id - Obtener detalle de una transacción
router.get('/:id', auth, transaccionController.getTransaccionById);

module.exports = router;
