# PowerPoint Conversion Testing Guide

## 3. Test with Real PowerPoint Files

### Quick Test Setup

1. **Get a test PPTX file**:
   - Create a simple PowerPoint with 3-5 slides
   - Or download a sample from: https://file-examples.com/index.php/sample-documents-download/sample-ppt-download/

2. **Test CloudMersive (Free)**:
```bash
# Get free API key from https://cloudmersive.com/
curl -X POST \
  https://api.cloudmersive.com/convert/ppt/to/pdf \
  -H "Apikey: YOUR_FREE_API_KEY" \
  -F "inputFile=@test.pptx" \
  -o test-converted.pdf
```

3. **Test Gotenberg (After Railway Deployment)**:
```bash
# Replace with your Railway URL
curl -X POST \
  https://your-gotenberg.railway.app/forms/libreoffice/convert \
  -F "files=@test.pptx" \
  -H "Accept: application/pdf" \
  -o test-gotenberg.pdf
```

### Integration Testing

1. **Update environment variables** in `backend/wrangler.toml`
2. **Deploy backend**:
```bash
wrangler deploy --config backend/wrangler.toml
```

3. **Deploy frontend**:
```bash
npm run build:standalone
wrangler deploy --config backend/wrangler.toml
```

4. **Test upload** at your deployed URL

### Test Cases

- [ ] **Small PPTX** (1-3 slides, <1MB)
- [ ] **Medium PPTX** (5-10 slides, 2-5MB)  
- [ ] **Large PPTX** (20+ slides, 10MB+)
- [ ] **Complex PPTX** (animations, embedded media)
- [ ] **Legacy PPT** (older format)

### Expected Results

✅ **PDF Generation**: Viewable inline PDF
✅ **Thumbnail Creation**: PNG images for each slide
✅ **Original Preservation**: Original PPTX downloadable
✅ **UI Switching**: PDF viewer / Gallery / Grid modes work
✅ **Mobile Responsive**: Good experience on mobile

## 4. Monitor Conversion Success Rates

### CloudFlare Worker Logs
```bash
wrangler tail --config backend/wrangler.toml
```

### Key Metrics to Monitor

- **Conversion Success Rate**: % of successful conversions
- **Service Response Times**: Gotenberg vs CloudMersive speed
- **Error Types**: Network timeouts, format issues, etc.
- **File Size Limits**: What's the practical maximum?

### Error Handling

The system has 3 fallback levels:
1. **Gotenberg** (primary, most reliable)
2. **CloudMersive** (fallback, free tier)
3. **Placeholder PDF** (emergency, always works)

### Performance Benchmarks

| File Size | Expected Time | Success Rate |
|-----------|---------------|--------------|
| <1MB | <5 seconds | 98%+ |
| 1-5MB | 5-15 seconds | 95%+ |
| 5-10MB | 15-30 seconds | 90%+ |
| >10MB | 30+ seconds | Variable |

### Monitoring Commands

```bash
# Check backend logs
wrangler tail --config backend/wrangler.toml

# Check Railway service logs  
railway logs

# Test service health
curl https://your-gotenberg.railway.app/health
```

This ensures your PowerPoint conversion system is working perfectly! 🎯
