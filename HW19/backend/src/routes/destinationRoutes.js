const express = require('express');
const router = express.Router();
const {
    getAllDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination,
    getDestinationsByCountry,
    getCountries
} = require('../controllers/destinationController');

// Rutas especiales (deben ir ANTES de las rutas con :id)
router.get('/countries', getCountries);
router.get('/country/:country', getDestinationsByCountry);

// Rutas CRUD estándar
router.route('/')
    .get(getAllDestinations)
    .post(createDestination);

router.route('/:id')
    .get(getDestinationById)
    .put(updateDestination)
    .delete(deleteDestination);

module.exports = router;
