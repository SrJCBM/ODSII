const Destination = require('../models/Destination');

exports.getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: destinations.length,
            data: destinations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los destinos',
            error: error.message
        });
    }
};

exports.getDestinationById = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        
        if (!destination) {
            return res.status(404).json({
                success: false,
                message: 'Destino no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            data: destination
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'ID de destino inválido'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error al obtener el destino',
            error: error.message
        });
    }
};

exports.createDestination = async (req, res) => {
    try {
        const destination = await Destination.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Destino creado exitosamente',
            data: destination
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: messages
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error al crear el destino',
            error: error.message
        });
    }
};

exports.updateDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!destination) {
            return res.status(404).json({
                success: false,
                message: 'Destino no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Destino actualizado exitosamente',
            data: destination
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'ID de destino inválido'
            });
        }
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: messages
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el destino',
            error: error.message
        });
    }
};

exports.deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);
        
        if (!destination) {
            return res.status(404).json({
                success: false,
                message: 'Destino no encontrado'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Destino eliminado exitosamente',
            data: destination
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'ID de destino inválido'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el destino',
            error: error.message
        });
    }
};

exports.getDestinationsByCountry = async (req, res) => {
    try {
        const { country } = req.params;
        
        const destinations = await Destination.find({
            country: { $regex: new RegExp(country, 'i') }
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: destinations.length,
            country: country,
            data: destinations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar destinos por país',
            error: error.message
        });
    }
};

exports.getCountries = async (req, res) => {
    try {
        const countries = await Destination.distinct('country');
        const validCountries = countries.filter(c => c && c.trim() !== '');
        
        res.status(200).json({
            success: true,
            count: validCountries.length,
            data: validCountries.sort()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la lista de países',
            error: error.message
        });
    }
};
