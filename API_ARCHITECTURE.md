# API Architecture Documentation

## Overview

The Hawken AI Transformation application uses a direct API architecture where the frontend (Next.js deployed on Vercel) makes direct API calls to the backend (Express.js deployed on Heroku).

## Architecture Diagram

```
┌─────────────────┐     Direct API Calls      ┌─────────────────┐
│                 │ ────────────────────────► │                 │
│   Frontend      │                           │   Backend       │
│   (Vercel)      │ ◄──────────────────────── │   (Heroku)      │
│                 │      JSON Responses       │                 │
└─────────────────┘                           └─────────────────┘
```

## Environment Configuration

### Frontend (Vercel)

The frontend is configured with the following environment variable:

- `NEXT_PUBLIC_HEROKU_API_URL`: Points to the Heroku backend URL
  - Value: `https://hawken-ai-transformation-27d8ee0ab1a5.herokuapp.com`

This variable is set in:
- `.env` (local development)
- `.env.production` (production builds)
- `vercel.json` (Vercel deployment)

### Backend (Heroku)

The backend is configured with CORS to allow requests from:
- The Vercel deployment (`https://hawken-ai-transformation.vercel.app`)
- Any Vercel subdomain (`*.vercel.app`)
- Local development URLs (`http://localhost:3000`, `http://localhost:3001`)
- In development/testing mode, any origin is allowed

## API Endpoints

The frontend makes direct API calls to these backend endpoints:

### Analysis Endpoints

- `GET /api/cache-status/:company` - Check if analysis cache exists for a company
- `POST /api/analyze` - Generate a new analysis for a company
- `GET /api/analysis/:company` - Get analysis data for a company

### Cache Endpoints

- `GET /cache/:companyId/:file.json` - Get cached JSON files (final_proposal.json, industry_insights.json, etc.)
- `DELETE /api/clear-cache/:company` - Clear cache for a company

### LLM Content Generation

- `POST /api/generate` - Generate content with LLM
- `POST /api/analysis/:companyId/generate` - Generate company-specific content

## API Access Logic

The frontend uses the `getApiBaseUrl()` function in `src/lib/api.ts` to determine the correct API URL:

```typescript
export const getApiBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_HEROKU_API_URL || 'http://localhost:3001';
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
};
```

All API service functions then use this base URL for their requests.

## Common Issues and Troubleshooting

### CORS Errors

If you see CORS errors in the console:
1. Check that the backend CORS configuration includes your frontend domain
2. Verify the frontend is making requests to the correct backend URL
3. Check for any proxy middleware that might be interfering with requests

### 404 Not Found Errors

If API endpoints return 404:
1. Check that you're using the correct API URL
2. Verify the endpoint exists on the backend
3. Check for any typos in the endpoint path

## Deployment Notes

- When deploying a new backend version, update the `NEXT_PUBLIC_HEROKU_API_URL` in Vercel if the URL changes
- When testing locally, use `.env.local` to override the Heroku URL with your local backend 