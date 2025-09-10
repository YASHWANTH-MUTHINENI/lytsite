# Railway Gotenberg Service Deployment

## Quick Railway Deployment

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy Gotenberg
```bash
# In your project directory
railway new gotenberg-powerpoint
cd gotenberg-powerpoint

# Copy the Dockerfile
cp ../gotenberg.Dockerfile ./Dockerfile

# Deploy
railway up
```

### Step 3: Get Service URL
```bash
railway domain
# This will give you: https://gotenberg-powerpoint-production.up.railway.app
```

## Alternative: One-Click Railway Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/gotenberg)

## Environment Variables Needed

After deployment, you'll get a URL like:
```
https://gotenberg-powerpoint-production-abc123.up.railway.app
```

## Test the Service

```bash
# Test conversion
curl -X POST \
  https://your-gotenberg-url.up.railway.app/forms/libreoffice/convert \
  -F "files=@test.pptx" \
  -H "Accept: application/pdf" \
  -o test.pdf
```

## Railway Configuration

```json
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

Cost: ~$5/month for basic usage
