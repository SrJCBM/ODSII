# PLOS API Backend

Backend service for searching and retrieving PLOS articles.

## Features

- RESTful API for PLOS article search
- Pagination support
- Clean code architecture (MVC pattern)
- Error handling
- CORS enabled

## Installation

```bash
npm install
```

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on port 3000 by default.

## API Endpoints

### Health Check
```
GET /health
```

### Search Articles
```
GET /api/articles/search?q=title:university&page=1&pageSize=10
```

**Query Parameters:**
- `q` (optional): Search query (default: "title:university")
- `page` (optional): Page number, 1-based (default: 1)
- `pageSize` (optional): Results per page (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "doi": "10.1371/journal.pone.0123456",
        "title": "Article Title",
        "journal": "PLOS ONE",
        "publicationDate": "2023-01-15",
        "authors": ["Author 1", "Author 2"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalResults": 1000,
      "totalPages": 100
    }
  }
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── server.js        # Application entry point
├── package.json
└── README.md
```

## Technologies

- Node.js
- Express.js
- Axios
- CORS
