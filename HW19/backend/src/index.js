require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const destinationRoutes = require('./routes/destinationRoutes');

const app = express();

connectDB();

app.use(express.json());

const corsOptions = {
    origin: process.env.CORS_ORIGIN 
        ? process.env.CORS_ORIGIN.split(',') 
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Destinations API - Funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            destinations: '/api/destinations',
            byCountry: '/api/destinations/country/:country',
            countries: '/api/destinations/countries'
        }
    });
});

app.use('/api/destinations', destinationRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta ${req.originalUrl} no encontrada`
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
