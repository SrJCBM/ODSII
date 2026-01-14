const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const auth = require('../middlewares/auth');

// POST /api/pagos/qr - Realizar pago por QR
router.post('/qr', auth, pagoController.pagarQR);

module.exports = router;
