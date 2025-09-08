# Lytsite Cloudflare Backend

A serverless backend for Lytsite built on Cloudflare Workers with R2 storage and KV database.

## 🏗️ Architecture

- **Cloudflare Workers**: Serverless compute for API endpoints
- **R2 Object Storage**: File storage with zero egress fees
- **KV Store**: Metadata storage for projects and analytics
- **Global Edge Network**: Fast response times worldwide

## 🚀 Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Cloudflare

Login to Cloudflare:
```bash
npx wrangler login
```

Create KV namespace:
```bash
npm run kv:create
npm run kv:create:preview
```

Create R2 bucket:
```bash
npm run r2:create
```

### 3. Update wrangler.toml

Replace the placeholder IDs in `wrangler.toml` with your actual:
- KV namespace IDs (from step 2 output)
- R2 bucket names

### 4. Deploy

Development:
```bash
npm run dev
```

Production:
```bash
npm run deploy
```

## 📡 API Endpoints

### Upload Files
```http
POST /api/upload
Content-Type: multipart/form-data

files: File[]
title: string
description: string
template: string (optional)
authorName: string (optional)
authorEmail: string (optional)
```

### Serve Files
```http
GET /api/file/{fileId}
```

### View Project
```http
GET /{projectSlug}
```

### Health Check
```http
GET /api/health
```

## 🔧 Frontend Integration

Update your frontend's upload function to use the Cloudflare Worker:

```typescript
const uploadFiles = async (files: File[], metadata: any) => {
  const formData = new FormData();
  
  files.forEach(file => formData.append('files', file));
  formData.append('title', metadata.title);
  formData.append('description', metadata.description);
  formData.append('template', metadata.template);
  
  const response = await fetch('https://your-worker.your-subdomain.workers.dev/api/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

## 🌟 Features

- ✅ Multiple file upload support
- ✅ Universal file template generation
- ✅ Photo gallery template
- ✅ Client delivery template
- ✅ Download tracking
- ✅ View analytics
- ✅ Mobile-responsive templates
- ✅ SEO-optimized pages
- ✅ Global CDN distribution

## 💰 Cost Optimization

- **R2 Storage**: $0.015/GB/month (no egress fees)
- **Workers**: 100K requests/day free
- **KV**: 1K writes/day free
- **Global edge**: Built-in CDN

## 🔒 Security

- CORS headers configured
- File type validation
- Size limits enforced
- XSS protection in templates

## 📊 Monitoring

- Built-in analytics tracking
- Download counters
- View statistics
- Error logging

## 🚀 Scaling

This setup automatically scales globally:
- Workers run at 300+ edge locations
- R2 provides global file distribution
- KV offers sub-50ms response times worldwide

Perfect for handling viral content and global users!
