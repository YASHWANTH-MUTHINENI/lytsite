# 🚀 Quick Deployment Guide

## Step 1: Deploy LibreOffice Conversion Service

### Option A: AWS LibreOffice (Recommended - Uses Your Credits)
1. **See detailed guide**: `AWS_LIBREOFFICE_DEPLOYMENT.md`
2. **Quick ECS Fargate deployment** (20 minutes):
   ```bash
   # Build and deploy to ECS Fargate
   docker build -t powerpoint-converter .
   # Deploy to ECS (see full guide)
   ```
3. **Benefits**: 
   - ✅ Unlimited file sizes
   - ✅ Uses your AWS credits
   - ✅ Auto-scaling
   - ✅ No API rate limits

### Option B: Railway Gotenberg (Alternative)
1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Deploy Gotenberg**:
   ```bash
   railway new gotenberg-powerpoint
   railway up
   ```

4. **Get your URL**:
   ```bash
   railway domain
   # Example: https://gotenberg-powerpoint-production.up.railway.app
   ```

### Option C: Quick CloudMersive Setup (Free - Limited)
1. **Sign up**: https://cloudmersive.com/
2. **Get free API key**: Dashboard → API Keys
3. **⚠️ Limitations**: 50,000 conversions/month, **3.5MB file limit**
4. **Best for**: Testing small PowerPoint files only

## Step 2: Update Environment Variables

Edit `backend/wrangler.toml`:

```toml
[vars]
AWS_CONVERTER_URL = "https://your-aws-endpoint.amazonaws.com"
GOTENBERG_SERVICE_URL = "https://your-gotenberg.railway.app"
CLOUDMERSIVE_API_KEY = "your-free-api-key"

[env.production.vars]
AWS_CONVERTER_URL = "https://your-aws-endpoint.amazonaws.com"
GOTENBERG_SERVICE_URL = "https://your-gotenberg.railway.app" 
CLOUDMERSIVE_API_KEY = "your-free-api-key"
```

## Step 3: Deploy Backend

```bash
wrangler deploy --config backend/wrangler.toml
```

## Step 4: Test PowerPoint Upload

1. **Go to your site**: https://lytsite-backend.yashwanthvarmamuthineni.workers.dev
2. **Upload a PPTX file**
3. **Check for**:
   - ✅ PDF viewer mode
   - ✅ Thumbnail gallery 
   - ✅ Original download option

## Step 5: Monitor Logs

```bash
wrangler tail --config backend/wrangler.toml
```

## 🎯 Success Criteria

- [ ] Gotenberg service deployed and accessible
- [ ] Environment variables configured
- [ ] Backend deployed with new variables
- [ ] PowerPoint upload works
- [ ] All three viewing modes functional
- [ ] Logs show successful conversions

## 💡 Quick Start

**Fastest path to testing**:
1. Get CloudMersive free API key (2 minutes)
2. Update `CLOUDMERSIVE_API_KEY` in wrangler.toml
3. Deploy: `wrangler deploy --config backend/wrangler.toml`
4. Test with a PowerPoint file

You'll have working PowerPoint conversion in under 5 minutes! 🎉
