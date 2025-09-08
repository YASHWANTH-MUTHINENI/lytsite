# 🚀 Lytsite Deployment Guide

This guide will help you deploy your Lytsite platform with Cloudflare Workers backend.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Node.js**: Version 16 or higher
3. **Domain (Optional)**: For custom domain

## Step 1: Deploy Backend to Cloudflare

### 1.1 Install Wrangler CLI

```bash
npm install -g wrangler
```

### 1.2 Login to Cloudflare

```bash
wrangler login
```

### 1.3 Setup Backend

```bash
cd backend
npm install
```

### 1.4 Create KV Namespace

```bash
wrangler kv:namespace create "LYTSITE_KV"
wrangler kv:namespace create "LYTSITE_KV" --preview
```

Copy the namespace IDs from the output and update `wrangler.toml`.

### 1.5 Create R2 Bucket

```bash
wrangler r2 bucket create lytsite-files
```

### 1.6 Deploy Worker

```bash
wrangler deploy
```

Your Worker will be deployed to: `https://lytsite-backend.your-subdomain.workers.dev`

## Step 2: Update Frontend Configuration

### 2.1 Update API Base URL

In `src/components/minimal-upload-modal.tsx`, update the API_BASE:

```typescript
const API_BASE = 'https://lytsite-backend.your-subdomain.workers.dev';
```

### 2.2 Build Frontend

```bash
npm run build
```

## Step 3: Deploy Frontend

### Option A: Cloudflare Pages (Recommended)

1. Push your code to GitHub
2. Go to Cloudflare Dashboard > Pages
3. Connect GitHub repository
4. Set build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Deploy

### Option B: Vercel

```bash
npm install -g vercel
vercel --prod
```

### Option C: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## Step 4: Configure Custom Domain (Optional)

### 4.1 Add Domain to Cloudflare

1. Go to Cloudflare Dashboard
2. Add your domain
3. Update nameservers at your domain registrar

### 4.2 Setup Custom Domain for Worker

```bash
wrangler custom-domain add api.yourdomain.com
```

### 4.3 Update Frontend API Base

```typescript
const API_BASE = 'https://api.yourdomain.com';
```

## Step 5: Environment Configuration

### Production Environment Variables

Create `backend/.env.production`:

```env
ENVIRONMENT=production
```

### CORS Configuration

If using a custom domain, update CORS in `worker.ts`:

```typescript
export function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': 'https://yourdomain.com',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}
```

## Step 6: Testing

### Test Backend Endpoints

```bash
# Health check
curl https://your-worker.workers.dev/api/health

# Test upload (replace with actual form data)
curl -X POST https://your-worker.workers.dev/api/upload \
  -F "files=@test.pdf" \
  -F "title=Test Project" \
  -F "description=Test Description"
```

### Test Frontend Upload

1. Visit your deployed frontend
2. Upload a test file
3. Verify the generated Lytsite works

## Step 7: Monitoring & Analytics

### 7.1 Cloudflare Analytics

Monitor your Worker performance in Cloudflare Dashboard > Workers & Pages > Analytics.

### 7.2 Custom Analytics (Optional)

Add analytics tracking:

```typescript
// In worker.ts
await env.LYTSITE_KV.put(`analytics:${Date.now()}`, JSON.stringify({
  event: 'upload',
  timestamp: Date.now(),
  fileCount: files.length,
  country: request.cf?.country
}));
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check API_BASE URL in frontend
2. **KV Not Found**: Verify namespace IDs in wrangler.toml
3. **R2 Upload Fails**: Check bucket name and permissions
4. **Worker Timeout**: Increase timeout in wrangler.toml

### Debug Mode

Enable debug logging:

```bash
wrangler tail
```

### Support

- 📚 [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- 💬 [Discord Community](https://discord.cloudflare.com)
- 🐛 [GitHub Issues](https://github.com/your-repo/issues)

## Production Checklist

- [ ] Backend deployed to Cloudflare Workers
- [ ] KV namespace created and configured
- [ ] R2 bucket created and accessible
- [ ] Frontend deployed to hosting platform
- [ ] API_BASE updated in frontend
- [ ] Custom domain configured (optional)
- [ ] CORS headers configured
- [ ] Analytics tracking enabled
- [ ] Error monitoring setup
- [ ] File size limits configured
- [ ] Rate limiting enabled

## Cost Estimation

### Cloudflare Workers
- **Free Tier**: 100K requests/day
- **Paid**: $0.50/million requests

### R2 Storage
- **Storage**: $0.015/GB/month
- **Operations**: Class A: $4.50/million, Class B: $0.36/million
- **Egress**: FREE (major cost saving!)

### Example Monthly Cost (1K users, 10GB storage)
- Workers: ~$5
- R2 Storage: ~$0.15
- **Total: ~$5.15/month**

🎉 **Your Lytsite platform is now live and globally distributed!**
