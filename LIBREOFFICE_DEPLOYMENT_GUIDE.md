# LibreOffice Headless Conversion Setup Guide

## Overview

LibreOffice headless provides free PowerPoint to PDF conversion without external service costs. This guide shows multiple deployment options from simple to production-ready.

## Option 1: Gotenberg Service (Recommended)

Gotenberg is a Docker-based service that wraps LibreOffice for HTTP API conversion.

### Docker Deployment

```dockerfile
# docker-compose.yml
version: '3.8'
services:
  gotenberg:
    image: gotenberg/gotenberg:8
    ports:
      - "3000:3000"
    command:
      - "gotenberg"
      - "--chromium-disable-web-security"
      - "--chromium-incognito"
      - "--chromium-disable-crash-reporter"
      - "--libreoffice-disable-routes"
```

### Deploy to Railway/Render

```yaml
# railway.json
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "startCommand": "gotenberg --chromium-disable-web-security --libreoffice-disable-routes"
  }
}
```

### Usage in Code

```typescript
// Already implemented in utils.ts
const response = await fetch(`${libreOfficeServiceUrl}/forms/libreoffice/convert`, {
  method: 'POST',
  body: formData,
  headers: { 'Accept': 'application/pdf' }
});
```

## Option 2: CloudMersive API (Free Tier)

CloudMersive offers free LibreOffice-based conversion with generous limits.

### Setup
1. Sign up at https://cloudmersive.com
2. Get free API key (50,000 calls/month)
3. Add to environment variables:

```bash
CLOUDMERSIVE_API_KEY=your_api_key_here
```

### Implementation
```typescript
// Already implemented as fallback in utils.ts
const response = await fetch('https://api.cloudmersive.com/convert/ppt/to/pdf', {
  method: 'POST',
  headers: { 'Apikey': apiKey },
  body: formData
});
```

## Option 3: OnlyOffice DocumentServer

Free open-source document server with conversion capabilities.

### Docker Deployment

```dockerfile
# docker-compose.yml
version: '3.8'
services:
  onlyoffice:
    image: onlyoffice/documentserver:latest
    ports:
      - "8080:80"
    environment:
      - JWT_ENABLED=false
    volumes:
      - ./data:/var/www/onlyoffice/Data
```

### Configuration

```typescript
// Environment variable
ONLYOFFICE_SERVER_URL=https://your-onlyoffice-server.com

// Usage (already implemented)
const conversionRequest = {
  async: false,
  filetype: 'pptx',
  outputtype: 'pdf',
  key: generateId(),
  title: filename,
  url: dataUrl
};
```

## Option 4: Self-Hosted LibreOffice (Advanced)

For complete control, run LibreOffice directly in your infrastructure.

### Dockerfile

```dockerfile
FROM ubuntu:22.04

# Install LibreOffice
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    libreoffice-impress \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install unoconv for conversion
RUN pip3 install unoconv

# Create conversion service
COPY conversion-service.py /app/
WORKDIR /app

EXPOSE 8000
CMD ["python3", "conversion-service.py"]
```

### Python Conversion Service

```python
# conversion-service.py
from flask import Flask, request, send_file
import subprocess
import tempfile
import os

app = Flask(__name__)

@app.route('/convert', methods=['POST'])
def convert_file():
    if 'file' not in request.files:
        return 'No file provided', 400
    
    file = request.files['file']
    
    with tempfile.TemporaryDirectory() as temp_dir:
        input_path = os.path.join(temp_dir, file.filename)
        output_path = os.path.join(temp_dir, 'output.pdf')
        
        # Save uploaded file
        file.save(input_path)
        
        # Convert using LibreOffice
        subprocess.run([
            'libreoffice',
            '--headless',
            '--convert-to', 'pdf',
            '--outdir', temp_dir,
            input_path
        ], check=True)
        
        return send_file(output_path, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

## Deployment Options

### 1. Railway (Easiest)
```bash
# Deploy Gotenberg to Railway
git clone https://github.com/gotenberg/gotenberg
cd gotenberg
railway login
railway deploy
```

### 2. Render
```yaml
# render.yaml
services:
  - type: web
    name: libreoffice-converter
    runtime: docker
    dockerfilePath: ./Dockerfile
    plan: free
```

### 3. Cloudflare Workers + Durable Objects
For serverless, you'd need to proxy to an external service since Workers can't run LibreOffice directly.

### 4. AWS Lambda (with layers)
Possible but complex due to LibreOffice size constraints.

## Environment Variables Setup

Add to your `wrangler.toml`:

```toml
[env.production.vars]
LIBREOFFICE_SERVICE_URL = "https://your-gotenberg-service.com"
CLOUDMERSIVE_API_KEY = "your-cloudmersive-key"
ONLYOFFICE_SERVER_URL = "https://your-onlyoffice-server.com"
```

## Testing

1. **Deploy a service** (Gotenberg recommended)
2. **Update environment variables** in your Cloudflare Worker
3. **Test conversion**:

```bash
# Test Gotenberg directly
curl -X POST \
  https://your-gotenberg-service.com/forms/libreoffice/convert \
  -F "files=@presentation.pptx" \
  -H "Accept: application/pdf" \
  -o converted.pdf
```

## Cost Comparison

| Option | Cost | Setup Complexity | Reliability |
|--------|------|------------------|-------------|
| Gotenberg (Railway) | ~$5/month | Low | High |
| CloudMersive Free | Free (limited) | Very Low | Medium |
| OnlyOffice Self-hosted | ~$5/month | Medium | High |
| LibreOffice Custom | ~$5/month | High | High |

## Recommendation

1. **Start with CloudMersive** (free tier) for testing
2. **Deploy Gotenberg to Railway** for production
3. **Fallback chain**: Gotenberg → CloudMersive → Placeholder

This gives you a robust, cost-effective PowerPoint to PDF conversion system!

## Current Implementation Status

✅ **Multiple conversion methods implemented**
✅ **Fallback chain for reliability**  
✅ **Error handling and logging**
❌ **Services not deployed yet**

Next step: Deploy Gotenberg service and update environment variables.
