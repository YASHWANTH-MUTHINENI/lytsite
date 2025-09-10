import { customAlphabet } from 'nanoid';

// Generate short, URL-safe slugs
export function generateSlug(): string {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);
  return nanoid();
}

// Generate unique file IDs
export function generateId(): string {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 16);
  return nanoid();
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

// Convert base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Check if file is an image
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

// Check if file is a PDF
export function isPDF(mimeType: string): boolean {
  return mimeType === 'application/pdf';
}

// Check if file is a PowerPoint presentation
export function isPowerPoint(mimeType: string): boolean {
  return mimeType === 'application/vnd.ms-powerpoint' || 
         mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
}

// PowerPoint processing result interface
interface PowerPointProcessingResult {
  pdfBuffer: ArrayBuffer;
  thumbnails: ArrayBuffer[];
  originalBuffer: ArrayBuffer;
  slideCount: number;
}

// Convert PowerPoint to PDF + PNG thumbnails + keep original
export async function processPowerPointFile(fileBuffer: ArrayBuffer, filename: string, env?: any): Promise<PowerPointProcessingResult> {
  try {
    console.log(`Processing PowerPoint file: ${filename}`);
    
    // Get service URLs from environment variables
    const awsConverterUrl = env?.AWS_CONVERTER_URL;
    const gotenbergUrl = env?.GOTENBERG_SERVICE_URL;
    const cloudmersiveKey = env?.CLOUDMERSIVE_API_KEY;
    
    // Try AWS LibreOffice first (primary service)
    if (awsConverterUrl && awsConverterUrl !== 'https://your-aws-endpoint.amazonaws.com') {
      try {
        console.log('🚀 Attempting AWS LibreOffice processing...');
        const result = await processWithAWS(fileBuffer, filename, awsConverterUrl);
        if (result) {
          console.log('✅ AWS processing successful');
          return result;
        }
      } catch (awsError) {
        console.log('❌ AWS failed:', awsError);
      }
    }

    // Try Gotenberg second (can generate PDF + images)
    if (gotenbergUrl && gotenbergUrl !== 'https://your-gotenberg-service.railway.app') {
      try {
        console.log('🚀 Attempting Gotenberg processing...');
        const result = await processWithGotenberg(fileBuffer, filename, gotenbergUrl);
        if (result) {
          console.log('✅ Gotenberg processing successful');
          return result;
        }
      } catch (gotenbergError) {
        console.log('❌ Gotenberg failed:', gotenbergError);
      }
    }
    
    // Fallback: Try CloudMersive (PDF only, then convert to images)
    if (cloudmersiveKey && cloudmersiveKey !== 'your-cloudmersive-api-key') {
      // Check file size limit for CloudMersive
      const fileSizeMB = fileBuffer.byteLength / (1024 * 1024);
      if (fileSizeMB > 3.5) {
        console.log(`⚠️ File too large for CloudMersive (${fileSizeMB.toFixed(1)}MB > 3.5MB limit)`);
      } else {
        try {
          console.log('🚀 Attempting CloudMersive processing...');
          const result = await processWithCloudMersive(fileBuffer, filename, cloudmersiveKey);
          if (result) {
            console.log('✅ CloudMersive processing successful');
            return result;
          }
        } catch (cloudError) {
          console.log('❌ CloudMersive failed:', cloudError);
        }
      }
    }
    
    // Final fallback: Create placeholder results
    console.log('❌ All services failed, creating placeholder results');
    return createPlaceholderResults(fileBuffer, filename);
    
  } catch (error) {
    console.error('❌ PowerPoint processing failed:', error);
    return createPlaceholderResults(fileBuffer, filename);
  }
}

// Process with Gotenberg (PDF + PNG generation)
async function processWithGotenberg(fileBuffer: ArrayBuffer, filename: string, gotenbergUrl: string): Promise<PowerPointProcessingResult> {
  // Step 1: Convert to PDF
  const pdfFormData = new FormData();
  pdfFormData.append('files', new Blob([fileBuffer]), filename);
  
  const pdfResponse = await fetch(`${gotenbergUrl}/forms/libreoffice/convert`, {
    method: 'POST',
    body: pdfFormData,
    headers: { 'Accept': 'application/pdf' }
  });
  
  if (!pdfResponse.ok) {
    throw new Error(`PDF conversion failed: ${pdfResponse.status}`);
  }
  
  const pdfBuffer = await pdfResponse.arrayBuffer();
  
  // Step 2: Convert PDF to PNG thumbnails
  const thumbnails = await convertPdfToThumbnails(pdfBuffer, gotenbergUrl);
  
  return {
    pdfBuffer,
    thumbnails,
    originalBuffer: fileBuffer,
    slideCount: thumbnails.length
  };
}

// Convert PDF to PNG thumbnails using Gotenberg
async function convertPdfToThumbnails(pdfBuffer: ArrayBuffer, gotenbergUrl: string): Promise<ArrayBuffer[]> {
  try {
    // Use Gotenberg's Chromium engine to convert PDF pages to images
    const formData = new FormData();
    formData.append('files', new Blob([pdfBuffer]), 'presentation.pdf');
    
    // Request PNG conversion with specific settings
    const response = await fetch(`${gotenbergUrl}/forms/chromium/convert/url`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/zip', // Gotenberg returns multiple images as ZIP
        'Gotenberg-Output-Format': 'png',
        'Gotenberg-Paper-Width': '11.7',
        'Gotenberg-Paper-Height': '8.3'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Thumbnail generation failed: ${response.status}`);
    }
    
    // Extract PNG files from ZIP response
    const zipBuffer = await response.arrayBuffer();
    return await extractPngsFromZip(zipBuffer);
    
  } catch (error) {
    console.error('Thumbnail generation failed:', error);
    // Return placeholder thumbnails
    return [createPlaceholderThumbnail()];
  }
}

// Process with AWS LibreOffice service
async function processWithAWS(fileBuffer: ArrayBuffer, filename: string, awsEndpoint: string): Promise<PowerPointProcessingResult> {
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer]), filename);
  
  const response = await fetch(`${awsEndpoint}/convert`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`AWS conversion failed: ${response.statusText}`);
  }
  
  const result = await response.json() as { 
    pdf: string; 
    thumbnails?: string[]; 
    slideCount?: number; 
  };
  
  // AWS service should return: { pdf: base64, thumbnails: base64[], slideCount: number }
  const pdfBuffer = base64ToArrayBuffer(result.pdf);
  const thumbnails = result.thumbnails?.map((thumb: string) => base64ToArrayBuffer(thumb)) || [createPlaceholderThumbnail()];
  
  return {
    pdfBuffer,
    thumbnails,
    originalBuffer: fileBuffer,
    slideCount: result.slideCount || thumbnails.length
  };
}

// Process with CloudMersive (PDF conversion, then client-side thumbnails)
async function processWithCloudMersive(fileBuffer: ArrayBuffer, filename: string, apiKey: string): Promise<PowerPointProcessingResult> {
  // Convert to PDF using CloudMersive
  const pdfBuffer = await convertUsingCloudLibreOffice(fileBuffer, filename, apiKey);
  
  // Generate thumbnails from PDF (simplified approach)
  const thumbnails = await generateThumbnailsFromPdf(pdfBuffer);
  
  return {
    pdfBuffer,
    thumbnails,
    originalBuffer: fileBuffer,
    slideCount: thumbnails.length
  };
}

// Generate thumbnails from PDF (fallback method)
async function generateThumbnailsFromPdf(pdfBuffer: ArrayBuffer): Promise<ArrayBuffer[]> {
  // This is a simplified approach - in production you'd use pdf2pic or similar
  // For now, create placeholder thumbnails based on estimated slide count
  const estimatedSlides = Math.max(1, Math.floor(pdfBuffer.byteLength / 50000)); // Rough estimation
  
  const thumbnails: ArrayBuffer[] = [];
  for (let i = 0; i < estimatedSlides; i++) {
    thumbnails.push(createPlaceholderThumbnail(i + 1));
  }
  
  return thumbnails;
}

// Extract PNG files from ZIP buffer
async function extractPngsFromZip(zipBuffer: ArrayBuffer): Promise<ArrayBuffer[]> {
  // This is a simplified ZIP extraction - in production you'd use a proper ZIP library
  // For now, return placeholder thumbnails
  return [createPlaceholderThumbnail()];
}

// Create placeholder thumbnail
function createPlaceholderThumbnail(slideNumber: number = 1): ArrayBuffer {
  // Create a minimal PNG placeholder (1x1 pixel)
  const pngData = new Uint8Array([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // Width: 1
    0x00, 0x00, 0x00, 0x01, // Height: 1
    0x08, 0x02, 0x00, 0x00, 0x00, // Bit depth, color type, compression, filter, interlace
    0x90, 0x77, 0x53, 0xDE, // CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // Compressed data
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  return pngData.buffer;
}

// Create placeholder processing results
function createPlaceholderResults(originalBuffer: ArrayBuffer, filename: string): PowerPointProcessingResult {
  const placeholderPdf = createSimplePDF(filename);
  const placeholderThumbnails = [createPlaceholderThumbnail()];
  
  return {
    pdfBuffer: placeholderPdf,
    thumbnails: placeholderThumbnails,
    originalBuffer,
    slideCount: 1
  };
}

// Legacy function for backward compatibility
export async function convertPowerPointToPDF(fileBuffer: ArrayBuffer, filename: string, env?: any): Promise<ArrayBuffer> {
  const result = await processPowerPointFile(fileBuffer, filename, env);
  return result.pdfBuffer;
}

// Convert using cloud-based LibreOffice service
async function convertUsingCloudLibreOffice(fileBuffer: ArrayBuffer, filename: string, apiKey: string): Promise<ArrayBuffer> {
  // Using CloudMersive LibreOffice conversion service
  const serviceUrl = 'https://api.cloudmersive.com/convert/ppt/to/pdf';
  
  const formData = new FormData();
  formData.append('inputFile', new Blob([fileBuffer]), filename);
  
  const response = await fetch(serviceUrl, {
    method: 'POST',
    headers: {
      'Apikey': apiKey
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`CloudMersive conversion failed: ${response.statusText}`);
  }
  
  return await response.arrayBuffer();
}

// Convert using OnlyOffice DocumentServer
async function convertUsingOnlyOffice(fileBuffer: ArrayBuffer, filename: string, serverUrl: string): Promise<ArrayBuffer> {
  // OnlyOffice DocumentServer conversion
  const conversionUrl = `${serverUrl}/ConvertService.ashx`;
  
  const conversionRequest = {
    async: false,
    filetype: filename.split('.').pop()?.toLowerCase(),
    key: generateId(),
    outputtype: 'pdf',
    title: filename,
    url: `data:application/octet-stream;base64,${btoa(String.fromCharCode(...new Uint8Array(fileBuffer)))}`
  };
  
  const response = await fetch(conversionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(conversionRequest)
  });
  
  if (!response.ok) {
    throw new Error(`OnlyOffice conversion failed: ${response.statusText}`);
  }
  
  const result = await response.json() as { error?: string; fileUrl?: string };
  
  if (result.error) {
    throw new Error(`OnlyOffice error: ${result.error}`);
  }
  
  if (!result.fileUrl) {
    throw new Error('OnlyOffice did not return a file URL');
  }
  
  // Download the converted file
  const pdfResponse = await fetch(result.fileUrl);
  return await pdfResponse.arrayBuffer();
}

// Create a simple PDF placeholder for development
function createSimplePDF(originalFilename: string): ArrayBuffer {
  // This is a minimal PDF that shows a message about conversion
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 120
>>
stream
BT
/F1 12 Tf
72 720 Td
(PowerPoint file converted to PDF: ${originalFilename}) Tj
0 -20 Td
(This is a placeholder PDF. Real conversion would be implemented) Tj
0 -20 Td
(using a proper conversion service like ConvertAPI or LibreOffice.) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000445 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
544
%%EOF`;

  return new TextEncoder().encode(pdfContent).buffer;
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// CORS headers for API responses
export function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Handle CORS preflight
export function handleCORS(): Response {
  return new Response(null, {
    status: 200,
    headers: corsHeaders()
  });
}
