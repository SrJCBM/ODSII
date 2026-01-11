const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del destino es obligatorio'],
        trim: true
    },
    country: {
        type: String,
        required: [true, 'El país es obligatorio'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    lat: {
        type: Number,
        default: null
    },
    lng: {
        type: Number,
        default: null
    },
    img: {
        type: String,
        default: null
    },
    userId: {
        type: String,
        default: null
    }
}, {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
    versionKey: false
});

// Índice para búsquedas eficientes por país (Opción A - Business Rule)
destinationSchema.index({ country: 1 });

module.exports = mongoose.model('Destination', destinationSchema);
