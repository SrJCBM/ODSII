const express = require('express');
const router = express.Router();
const transferenciaController = require('../controllers/transferenciaController');
const auth = require('../middlewares/auth');

// POST /api/transferencias - Realizar transferencia
router.post('/', auth, transferenciaController.transferir);

// POST /api/transferencias/:id/reversar - Reversar transferencia
router.post('/:id/reversar', auth, transferenciaController.reversar);

module.exports = router;
