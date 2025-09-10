# PowerPoint to PDF Conversion Implementation

## Current Implementation

The PowerPoint to PDF conversion is currently implemented as a **placeholder system** that demonstrates the conversion flow but doesn't perform real conversion yet.

### How it Works Now

1. **Detection**: Backend detects PowerPoint files using MIME types
   ```typescript
   // In utils.ts
   export function isPowerPoint(mimeType: string): boolean {
     return mimeType === 'application/vnd.ms-powerpoint' || 
            mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
   }
   ```

2. **Conversion Process**: When a PowerPoint file is uploaded
   ```typescript
   // In upload.ts
   if (isPowerPoint(file.type)) {
     try {
       console.log(`Converting PowerPoint file: ${file.name}`);
       const fileBuffer = await file.arrayBuffer();
       const convertedPdf = await convertPowerPointToPDF(fileBuffer, file.name);
       
       // Create a new file object for the converted PDF
       finalFile = new File([convertedPdf], file.name.replace(/\.(ppt|pptx)$/i, '.pdf'), {
         type: 'application/pdf'
       });
       finalContentType = 'application/pdf';
       finalName = file.name.replace(/\.(ppt|pptx)$/i, '.pdf');
     } catch (error) {
       // Fall back to original file if conversion fails
     }
   }
   ```

3. **Placeholder PDF**: Currently creates a simple PDF with text
   ```typescript
   // Creates a minimal PDF document with conversion notice
   function createSimplePDF(originalFilename: string): ArrayBuffer {
     const pdfContent = `%PDF-1.4
     // ... PDF structure with text about conversion
     `;
     return new TextEncoder().encode(pdfContent).buffer;
   }
   ```

## Real Conversion Implementation Options

### Option 1: ConvertAPI (Recommended)
**Pros**: Easy to implement, reliable, handles many formats
**Cons**: Costs money per conversion

```typescript
export async function convertPowerPointToPDF(fileBuffer: ArrayBuffer, filename: string): Promise<ArrayBuffer> {
  const convertApiUrl = 'https://v2.convertapi.com/convert/ppt/to/pdf';
  const convertApiSecret = process.env.CONVERT_API_SECRET;
  
  const formData = new FormData();
  formData.append('Parameters[StoreFile]', 'true');
  formData.append('File', new Blob([fileBuffer]), filename);
  
  const response = await fetch(`${convertApiUrl}?Secret=${convertApiSecret}`, {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  const pdfUrl = result.Files[0].Url;
  
  // Download the converted PDF
  const pdfResponse = await fetch(pdfUrl);
  return await pdfResponse.arrayBuffer();
}
```

### Option 2: CloudConvert
**Pros**: Good pricing, reliable API
**Cons**: Setup complexity

```typescript
export async function convertPowerPointToPDF(fileBuffer: ArrayBuffer, filename: string): Promise<ArrayBuffer> {
  const cloudConvertApi = 'https://api.cloudconvert.com/v2';
  const apiKey = process.env.CLOUDCONVERT_API_KEY;
  
  // 1. Create a job
  const jobResponse = await fetch(`${cloudConvertApi}/jobs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tasks: {
        'import-file': {
          operation: 'import/upload'
        },
        'convert-file': {
          operation: 'convert',
          input: 'import-file',
          output_format: 'pdf'
        },
        'export-file': {
          operation: 'export/url',
          input: 'convert-file'
        }
      }
    })
  });
  
  // 2. Upload file and get converted result...
  // (Implementation continues)
}
```

### Option 3: Aspose.Cloud
**Pros**: Specialized in document conversion
**Cons**: More complex API

```typescript
export async function convertPowerPointToPDF(fileBuffer: ArrayBuffer, filename: string): Promise<ArrayBuffer> {
  const asposeApi = 'https://api.aspose.cloud/v3.0';
  const clientId = process.env.ASPOSE_CLIENT_ID;
  const clientSecret = process.env.ASPOSE_CLIENT_SECRET;
  
  // 1. Get access token
  const tokenResponse = await fetch(`${asposeApi}/connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
  });
  
  const { access_token } = await tokenResponse.json();
  
  // 2. Upload and convert...
  // (Implementation continues)
}
```

### Option 4: LibreOffice Headless (Self-hosted)
**Pros**: Free, complete control
**Cons**: Complex setup, requires server management

```typescript
// Would require a separate service/container running LibreOffice
export async function convertPowerPointToPDF(fileBuffer: ArrayBuffer, filename: string): Promise<ArrayBuffer> {
  const libreOfficeServiceUrl = process.env.LIBREOFFICE_SERVICE_URL;
  
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer]), filename);
  formData.append('format', 'pdf');
  
  const response = await fetch(`${libreOfficeServiceUrl}/convert`, {
    method: 'POST',
    body: formData
  });
  
  return await response.arrayBuffer();
}
```

## Current Status

✅ **Infrastructure Ready**: The conversion pipeline is implemented and working
✅ **File Detection**: PowerPoint files are properly detected
✅ **File Processing**: Files are processed and stored as PDFs
✅ **Frontend Notification**: Users are informed about conversion
❌ **Real Conversion**: Currently using placeholder PDF

## To Implement Real Conversion

1. **Choose a conversion service** (ConvertAPI recommended for simplicity)
2. **Add environment variables** for API credentials
3. **Replace the placeholder function** with real conversion code
4. **Add error handling** for conversion failures
5. **Test with real PowerPoint files**

## Environment Variables Needed

```bash
# For ConvertAPI
CONVERT_API_SECRET=your_secret_here

# For CloudConvert  
CLOUDCONVERT_API_KEY=your_key_here

# For Aspose
ASPOSE_CLIENT_ID=your_client_id
ASPOSE_CLIENT_SECRET=your_client_secret
```

## Testing

To test with real conversion:
1. Sign up for ConvertAPI (free trial available)
2. Add your secret to environment variables
3. Update the conversion function to use real API
4. Deploy and test with PowerPoint files

The current implementation provides a complete foundation - you just need to plug in a real conversion service!
