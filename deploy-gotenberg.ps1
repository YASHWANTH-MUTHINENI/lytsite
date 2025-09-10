# PowerPoint Conversion Service Deployment Script for Windows

Write-Host "🚀 Deploying Gotenberg PowerPoint Conversion Service..." -ForegroundColor Green

# Check if Railway CLI is installed
if (!(Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Login to Railway
Write-Host "🔐 Please login to Railway..." -ForegroundColor Yellow
railway login

# Create new Railway project
Write-Host "🆕 Creating new Railway project..." -ForegroundColor Yellow
railway new gotenberg-powerpoint-converter

# Deploy the service
Write-Host "🏗️ Deploying Gotenberg service..." -ForegroundColor Yellow
railway up --detach

# Wait a moment for deployment
Start-Sleep -Seconds 10

# Get the deployment URL
Write-Host "🌐 Getting deployment URL..." -ForegroundColor Yellow
$gotenbergUrl = railway domain

if ($gotenbergUrl) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🔗 Your Gotenberg service is available at: $gotenbergUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update your Cloudflare Worker environment variables:"
    Write-Host "   GOTENBERG_SERVICE_URL=$gotenbergUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Test the service:" -ForegroundColor Yellow
    Write-Host "   curl -X POST $gotenbergUrl/forms/libreoffice/convert -F 'files=@test.pptx' -H 'Accept: application/pdf' -o test.pdf" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. Deploy your updated worker:" -ForegroundColor Yellow
    Write-Host "   wrangler deploy --config backend/wrangler.toml" -ForegroundColor Cyan
    
    # Copy URL to clipboard
    $gotenbergUrl | Set-Clipboard
    Write-Host "📋 URL copied to clipboard!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed. Please check Railway logs." -ForegroundColor Red
    railway logs
}

Write-Host "🎉 Script completed!" -ForegroundColor Green
