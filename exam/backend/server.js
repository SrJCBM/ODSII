const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://SrJCBM:bdd2025@cluster0.tjvfmrk.mongodb.net/ivaCalculator?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Middleware
app.use(cors());
app.use(express.json());

// IVA percentage constant
const IVA_PERCENTAGE = 15;

// Object to store product prices
class ProductCalculator {
    constructor() {
        this.products = [];
    }

    // Add product price to array
    addProduct(price) {
        this.products.push({ price: parseFloat(price) });
    }

    // Calculate total from products array
    calculateTotal() {
        return this.products.reduce((sum, product) => sum + product.price, 0);
    }

    // Calculate IVA (15%) from total
    calculateIVA(total) {
        return (total * IVA_PERCENTAGE) / 100;
    }

    // Clear products array
    clear() {
        this.products = [];
    }
}

// POST endpoint to calculate IVA from a price
app.post('/api/calculate-iva', (req, res) => {
    try {
        const { price } = req.body;

        // Validate input
        if (price === undefined || price === null || price === '') {
            return res.status(400).json({
                error: 'Price is required'
            });
        }

        const numericPrice = parseFloat(price);

        if (isNaN(numericPrice)) {
            return res.status(400).json({
                error: 'Price must be a valid number'
            });
        }

        if (numericPrice < 0) {
            return res.status(400).json({
                error: 'Price cannot be negative'
            });
        }

        // Create calculator and compute IVA
        const calculator = new ProductCalculator();
        calculator.addProduct(numericPrice);
        const total = calculator.calculateTotal();
        const iva = calculator.calculateIVA(total);

        // Response object
        const result = {
            price: parseFloat(total.toFixed(2)),
            ivaPercentage: IVA_PERCENTAGE,
            ivaValue: parseFloat(iva.toFixed(2))
        };

        res.json(result);

    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// GET endpoint for health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'IVA Calculator Backend is running' });
});

// POST endpoint to save a product
app.post('/api/products', async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({ error: 'Name and price are required' });
        }

        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
            return res.status(400).json({ error: 'Price must be a valid positive number' });
        }

        const product = new Product({ name, price: numericPrice });
        await product.save();

        res.status(201).json({ message: 'Product saved successfully', product });
    } catch (error) {
        res.status(500).json({ error: 'Error saving product' });
    }
});

// GET endpoint to retrieve all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products' });
    }
});

// GET endpoint to find product by name and calculate tax
app.get('/api/products/search/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const product = await Product.findOne({ name: { $regex: name, $options: 'i' } });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const calculator = new ProductCalculator();
        calculator.addProduct(product.price);
        const total = calculator.calculateTotal();
        const iva = calculator.calculateIVA(total);

        res.json({
            product: {
                name: product.name,
                price: parseFloat(product.price.toFixed(2))
            },
            ivaPercentage: IVA_PERCENTAGE,
            ivaValue: parseFloat(iva.toFixed(2)),
            totalWithIVA: parseFloat((total + iva).toFixed(2))
        });
    } catch (error) {
        res.status(500).json({ error: 'Error searching product' });
    }
});

// GET endpoint for health check (duplicate removed above)


// Start server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`IVA Percentage: ${IVA_PERCENTAGE}%`);
});
