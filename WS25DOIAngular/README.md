# PLOS Articles Search Application

Full-stack application for searching and exploring PLOS scientific articles using MVC architecture.

> **📖 Documentación en Español:** [README_ES.md](README_ES.md)

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Pattern**: MVC (Model-View-Controller)
- **API**: RESTful endpoints
- **External API**: PLOS Search API

### Frontend (Angular)
- **Framework**: Angular 21+
- **UI**: Standalone components
- **State Management**: RxJS
- **Styling**: Custom CSS

## ✨ Features

- 🔍 **Search Articles**: Search PLOS articles by title, author, or keywords
- 📊 **Paginated Results**: Navigate through results with pagination controls
- 📄 **PDF Export**: Export search results to PDF format
- 🔗 **DOI Redirect**: Double-click on DOI to open article on official PLOS site
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Fast & Lightweight**: Optimized performance with minimal dependencies

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Clone or navigate to the project directory**

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

#### 1. Start the Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:3000`

For development mode with auto-reload:
```bash
npm run dev
```

#### 2. Start the Frontend Application

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:4200`

Open your browser and navigate to `http://localhost:4200`

## 📖 API Documentation

### Backend Endpoints

#### Health Check
```
GET /health
```
Returns server health status.

#### Search Articles
```
GET /api/articles/search
```

**Query Parameters:**
- `q` (string, optional): Search query. Default: "title:university"
  - Examples: 
    - `title:covid`
    - `author:smith`
    - `title:machine learning`
- `page` (number, optional): Page number (1-based). Default: 1
- `pageSize` (number, optional): Results per page (max: 50). Default: 10

**Response Example:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "doi": "10.1371/journal.pone.0123456",
        "title": "Sample Article Title",
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

## 🎯 Usage Guide

### Searching Articles
1. Enter your search query in the search box
2. Use field operators for specific searches:
   - `title:keyword` - Search in title
   - `author:name` - Search by author
   - Or just type keywords for title search
3. Click "🔍 Search" button

### Navigating Results
- Use pagination buttons at the bottom to navigate through pages
- Click page numbers to jump to specific pages
- Use First/Last buttons for quick navigation

### Exporting to PDF
1. Perform a search to display results
2. Click "📄 Export to PDF" button
3. PDF file will be downloaded automatically

### Opening Articles
- **Double-click** on any DOI in the table
- Article will open in a new browser tab on the official PLOS website

## 📁 Project Structure

```
WS25DOIAngular/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── constants.js          # Application constants
│   │   ├── controllers/
│   │   │   └── articlesController.js # Request handlers
│   │   ├── middleware/
│   │   │   └── errorHandler.js       # Error handling middleware
│   │   ├── routes/
│   │   │   └── articlesRoutes.js     # API route definitions
│   │   ├── services/
│   │   │   └── plosService.js        # Business logic for PLOS API
│   │   └── server.js                 # Application entry point
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── articles-list/    # Main component
│   │   │   ├── models/
│   │   │   │   └── article.model.ts  # Data models
│   │   │   ├── services/
│   │   │   │   ├── article.service.ts # HTTP service
│   │   │   │   └── pdf.service.ts    # PDF export service
│   │   │   ├── app.config.ts         # App configuration
│   │   │   ├── app.routes.ts         # Route definitions
│   │   │   └── app.ts                # Root component
│   │   ├── index.html
│   │   └── main.ts
│   ├── package.json
│   └── angular.json
│
└── README.md                          # This file
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for external API calls
- **CORS** - Cross-origin resource sharing

### Frontend
- **Angular 21** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming
- **jsPDF** - PDF generation
- **jsPDF-AutoTable** - Table generation in PDFs

## 🎨 Clean Code Practices

This project follows clean code principles:

- ✅ **Meaningful Names**: Clear, descriptive variable and function names
- ✅ **Single Responsibility**: Each class/function has one clear purpose
- ✅ **DRY Principle**: No code duplication
- ✅ **Comments**: JSDoc documentation for all public methods
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **Separation of Concerns**: Clear separation between layers (MVC)
- ✅ **Type Safety**: Full TypeScript typing in frontend
- ✅ **Code Organization**: Logical folder structure and file organization

## 🔒 CORS Configuration

The backend is configured to accept requests from the frontend (port 4200). If you change ports, update the CORS settings in `backend/src/server.js`.

## 🐛 Troubleshooting

### Backend won't start
- Ensure port 3000 is not in use
- Check that all dependencies are installed: `npm install`

### Frontend won't start
- Ensure port 4200 is not in use
- Check that all dependencies are installed: `npm install`

### No articles showing
- Verify backend is running on port 3000
- Check browser console for CORS errors
- Ensure internet connection (app fetches from PLOS API)

### PDF export not working
- Check browser console for errors
- Ensure jsPDF libraries are installed

## � Deploy to Render

### Backend Deployment

1. **Create Web Service** in Render
2. **Settings:**
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Node
3. **Environment Variables:**
   - `PORT` = 3000

### Frontend Deployment

1. **Create Static Site** in Render
2. **Settings:**
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist/frontend/browser`
3. **Update API URL:**
   - In `frontend/src/app/services/article.service.ts`
   - Change `http://localhost:3000` to your Render backend URL

**Note:** Update CORS in backend to allow your frontend domain.

## 📝 Notes

- The default search query is "title:university"
- Maximum page size is 50 results per page
- DOI format: 10.1371/journal.pone.XXXXXXX
- All code is in English following international standards
- SSR removed for simpler deployment

## 📄 License

This project is for educational purposes.

## 👤 Author

Created as part of AWD coursework at ESPE University.

---

**Enjoy exploring PLOS scientific articles! 🔬📚**
