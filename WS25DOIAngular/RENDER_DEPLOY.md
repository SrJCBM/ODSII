# Render Deployment Guide

## Backend (Web Service)

### Settings
- **Name:** plos-api-backend
- **Environment:** Node
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`
- **Plan:** Free

### Environment Variables
```
PORT=3000
FRONTEND_URL=https://your-frontend-url.onrender.com
```

---

## Frontend (Static Site)

### Settings
- **Name:** plos-articles-frontend
- **Build Command:** `cd frontend && npm install && npm run build`
- **Publish Directory:** `frontend/dist/frontend/browser`
- **Plan:** Free

---

## Setup Steps

### 1. Deploy Backend First

1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure settings as above
5. Add environment variables
6. Click "Create Web Service"
7. Wait for deployment
8. **Copy the backend URL** (e.g., `https://plos-api-backend.onrender.com`)

### 2. Update Frontend Code

Before deploying frontend, update the API URL:

**File:** `frontend/src/app/services/article.service.ts`

Change:
```typescript
private readonly apiUrl = 'http://localhost:3000/api/articles';
```

To:
```typescript
private readonly apiUrl = 'https://your-backend-url.onrender.com/api/articles';
```

Commit and push the change.

### 3. Deploy Frontend

1. Click "New +" → "Static Site"
2. Connect your Git repository
3. Configure settings as above
4. Click "Create Static Site"
5. Wait for deployment
6. **Copy the frontend URL**

### 4. Update Backend CORS

Add the frontend URL to backend environment variables:

**Backend Environment Variable:**
```
FRONTEND_URL=https://your-frontend-url.onrender.com
```

Redeploy the backend if needed.

---

## Testing

1. Open your frontend URL
2. Search for articles
3. Verify pagination works
4. Test PDF export
5. Test DOI redirect

---

## Important Notes

- **Free tier:** Services sleep after 15 minutes of inactivity
- **Cold starts:** First request after sleep takes ~30 seconds
- **Frontend:** Always deployed and fast (static)
- **Backend:** May take time on first request

---

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` is set correctly in backend
- Check both URLs use HTTPS

### Backend Not Responding
- Check backend logs in Render dashboard
- Verify start command is correct
- Cold start may take time (wait 30s)

### Frontend Shows Errors
- Verify API URL is updated in `article.service.ts`
- Check browser console for specific errors
- Ensure backend is running

---

## Alternative: Environment-Based API URL

For better flexibility, use environment-based configuration:

**File:** `frontend/src/environments/environment.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.onrender.com/api/articles'
};
```

**File:** `frontend/src/environments/environment.development.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/articles'
};
```

Then in `article.service.ts`:
```typescript
import { environment } from '../../environments/environment';

private readonly apiUrl = environment.apiUrl;
```

---

**Good luck with your deployment! 🚀**
