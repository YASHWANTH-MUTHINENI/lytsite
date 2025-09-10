const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const execAsync = promisify(exec);
const app = express();

// Configure multer for file uploads
const upload = multer({ 
  dest: '/tmp/conversions/',
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'LibreOffice PowerPoint Converter',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Convert PowerPoint to PDF
app.post('/convert', upload.single('file'), async (req, res) => {
  let inputPath = null;
  let outputDir = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    console.log(`Converting file: ${req.file.originalname} (${req.file.size} bytes)`);
    
    inputPath = req.file.path;
    outputDir = path.dirname(inputPath);
    const baseName = path.basename(inputPath);
    const outputPdfPath = path.join(outputDir, `${baseName}.pdf`);
    
    // Convert to PDF using LibreOffice
    const convertCommand = `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;
    console.log(`Executing: ${convertCommand}`);
    
    await execAsync(convertCommand, { 
      timeout: 60000,
      env: { ...process.env, HOME: '/tmp' }
    });
    
    // Check if PDF was created
    if (!fs.existsSync(outputPdfPath)) {
      throw new Error('PDF conversion failed - output file not found');
    }
    
    // TODO: Generate PNG thumbnails (for future enhancement)
    // For now, return just the PDF
    const pdfBuffer = fs.readFileSync(outputPdfPath);
    const pdfBase64 = pdfBuffer.toString('base64');
    
    // Clean up
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPdfPath);
    
    // Return JSON response with base64 PDF
    res.json({
      pdf: pdfBase64,
      thumbnails: [], // TODO: Implement thumbnail generation
      slideCount: 1,  // TODO: Calculate actual slide count
      originalFilename: req.file.originalname,
      convertedAt: new Date().toISOString()
    });
    
    console.log(`✅ Conversion successful: ${req.file.originalname}`);
    
  } catch (error) {
    console.error('❌ Conversion failed:', error);
    
    // Clean up on error
    if (inputPath && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    
    res.status(500).json({ 
      error: 'Conversion failed', 
      details: error.message 
    });
  }
});

// Convert and return PDF directly (alternative endpoint)
app.post('/convert-pdf', upload.single('file'), async (req, res) => {
  let inputPath = null;
  let outputPath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    inputPath = req.file.path;
    const outputDir = path.dirname(inputPath);
    const baseName = path.basename(inputPath);
    outputPath = path.join(outputDir, `${baseName}.pdf`);
    
    // Convert to PDF
    const convertCommand = `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;
    await execAsync(convertCommand, { 
      timeout: 60000,
      env: { ...process.env, HOME: '/tmp' }
    });
    
    if (!fs.existsSync(outputPath)) {
      throw new Error('PDF conversion failed');
    }
    
    // Send PDF file directly
    const filename = req.file.originalname.replace(/\.[^/.]+$/, '.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(outputPath);
    fileStream.pipe(res);
    
    // Clean up after stream ends
    fileStream.on('end', () => {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });
    
  } catch (error) {
    console.error('PDF conversion failed:', error);
    
    // Clean up on error
    if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    
    res.status(500).json({ 
      error: 'PDF conversion failed', 
      details: error.message 
    });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 LibreOffice PowerPoint Converter running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📤 Convert endpoint: http://localhost:${PORT}/convert`);
  console.log(`📄 PDF endpoint: http://localhost:${PORT}/convert-pdf`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
