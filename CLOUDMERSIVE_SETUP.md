# CloudMersive Setup Guide - Free PowerPoint Conversion

## Get Free API Key

1. **Sign up**: Go to https://cloudmersive.com/
2. **Free tier**: 50,000 API calls per month
3. **Get API key**: Copy from dashboard

## Test CloudMersive API

```bash
# Test PowerPoint to PDF conversion
curl -X POST \
  https://api.cloudmersive.com/convert/ppt/to/pdf \
  -H "Apikey: YOUR_API_KEY_HERE" \
  -F "inputFile=@test.pptx" \
  -o converted.pdf
```

## Environment Variables

Add to your `wrangler.toml`:

```toml
[vars]
CLOUDMERSIVE_API_KEY = "your-free-api-key-here"
```

## Production Setup

```toml
[env.production.vars]
GOTENBERG_SERVICE_URL = "https://your-gotenberg.railway.app"
CLOUDMERSIVE_API_KEY = "your-cloudmersive-key"
```

## Conversion Limits

- **Free tier**: 50,000 conversions/month
- **Rate limit**: 10 requests/second
- **File size**: Up to 50MB per file
- **Formats**: PPT, PPTX → PDF

## Cost Comparison

| Service | Free Tier | Paid Plans | Best For |
|---------|-----------|------------|----------|
| CloudMersive | 50k/month | $0.0005/call | Testing & Low Volume |
| Gotenberg (Railway) | $0/month | ~$5/month | Production & High Volume |

## Backup Strategy

1. **Primary**: Gotenberg (self-hosted, unlimited)
2. **Fallback**: CloudMersive (free tier)
3. **Emergency**: Placeholder PDF (always works)

This gives you 50,000 free conversions while you set up Gotenberg! 🎉
