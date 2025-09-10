#!/bin/bash

# PowerPoint Conversion Service Deployment Script

echo "🚀 Deploying Gotenberg PowerPoint Conversion Service..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔐 Logging into Railway..."
railway login

# Create new Railway project
echo "🆕 Creating new Railway project..."
railway new gotenberg-powerpoint-converter

# Deploy the Gotenberg service
echo "🏗️ Deploying Gotenberg service..."
railway up --detach

# Get the deployment URL
echo "🌐 Getting deployment URL..."
GOTENBERG_URL=$(railway domain)

if [ -n "$GOTENBERG_URL" ]; then
    echo "✅ Deployment successful!"
    echo "🔗 Your Gotenberg service is available at: $GOTENBERG_URL"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update your Cloudflare Worker environment variables:"
    echo "   GOTENBERG_SERVICE_URL=$GOTENBERG_URL"
    echo ""
    echo "2. Test the service:"
    echo "   curl -X POST $GOTENBERG_URL/forms/libreoffice/convert -F \"files=@test.pptx\" -H \"Accept: application/pdf\" -o test.pdf"
    echo ""
    echo "3. Deploy your updated worker:"
    echo "   wrangler deploy --config backend/wrangler.toml"
else
    echo "❌ Deployment failed. Please check Railway logs."
    railway logs
fi

echo "🎉 Script completed!"
