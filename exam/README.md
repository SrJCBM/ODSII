# Calculadora de IVA - Examen

Aplicación web para calcular el IVA (15%) de un producto.

**Autor:** Blacio  
**Número:** 5 - IVA Calculation

## Estructura del Proyecto

```
u3/
├── backend/          # Servidor Node.js/Express
│   ├── package.json
│   └── server.js
├── frontend/         # Aplicación React
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│       ├── App.js
│       └── App.css
└── README.md
```

## Instalación y Ejecución

### Backend (Puerto 3001)

```bash
cd backend
npm install
npm start
```

### Frontend (Puerto 3000)

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### POST /api/calculate-iva
Calcula el IVA (15%) del precio ingresado.

**Request Body:**
```json
{
  "price": 100
}
```

**Response:**
```json
{
  "price": 100,
  "ivaPercentage": 15,
  "ivaValue": 15
}
```

### POST /api/products
Save a product to MongoDB.

**Request Body:**
```json
{
  "name": "Laptop",
  "price": 500
}
```

**Response:**
```json
{
  "message": "Product saved successfully",
  "product": {
    "_id": "...",
    "name": "Laptop",
    "price": 500,
    "createdAt": "2026-02-09T..."
  }
}
```

### GET /api/products
Get all products from MongoDB.

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Laptop",
    "price": 500,
    "createdAt": "2026-02-09T..."
  }
]
```

### GET /api/products/search/:name
Find a product by name and calculate its tax price.

**Example:** GET /api/products/search/Laptop

**Response:**
```json
{
  "product": {
    "name": "Laptop",
    "price": 500
  },
  "ivaPercentage": 15,
  "ivaValue": 75,
  "totalWithIVA": 575
}
```

### GET /api/health
Health check del servidor.

## Tecnologías Utilizadas

- **Backend:** Node.js, Express, CORS, Mongoose
- **Frontend:** React 18
- **Database:** MongoDB Atlas

## Features

1. **Calculate IVA:** Calculate 15% tax on any price
2. **Save Products:** Save product information to MongoDB
3. **Find Product & See Tax:** Search for a product by name and view its price with calculated tax

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to Render.

**Quick Deploy Steps:**
1. Push backend code to GitHub repository
2. Deploy backend as Web Service on Render
3. Update frontend `.env.local` with backend URL
4. Push frontend code to GitHub repository
5. Deploy frontend as Static Site on Render
