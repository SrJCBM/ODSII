const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccionController');
const auth = require('../middlewares/auth');

// GET /api/transacciones - Listar transacciones del usuario
router.get('/', auth, transaccionController.getTransacciones);

// GET /api/transacciones/consulta - Consulta avanzada con filtros
router.get('/consulta', auth, transaccionController.consultaAvanzada);

// GET /api/transacciones/reporte - Reporte agrupado por período
router.get('/reporte', auth, transaccionController.reporteTransacciones);

// GET /api/transacciones/:id - Obtener detalle de una transacción
router.get('/:id', auth, transaccionController.getTransaccionById);

module.exports = router;
