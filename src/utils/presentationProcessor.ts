// Utility functions for PowerPoint processing
// This would typically be implemented on the backend

export interface SlideData {
  id: number;
  imageUrl: string;
  thumbnailUrl: string;
  title?: string;
}

export interface PresentationProcessingResult {
  slides: SlideData[];
  totalSlides: number;
  pdfUrl?: string;
  embedUrl?: string;
  theme?: string;
}

/**
 * Generate a mock slide SVG for testing purposes
 */
function generateSlideSVG(slideNumber: number, isThumbnail = false): string {
  const width = isThumbnail ? 320 : 800;
  const height = isThumbnail ? 240 : 600;
  const fontSize = isThumbnail ? 14 : 24;
  const titleFontSize = isThumbnail ? 16 : 32;
  
  // Generate some variety in colors and content
  const colors = [
    { bg: '#6366f1', accent: '#8b5cf6' },
    { bg: '#3b82f6', accent: '#06b6d4' },
    { bg: '#10b981', accent: '#059669' },
    { bg: '#f59e0b', accent: '#d97706' },
    { bg: '#ef4444', accent: '#dc2626' }
  ];
  
  const color = colors[(slideNumber - 1) % colors.length];
  
  const slideTypes = [
    { title: "Introduction", content: "Welcome to our presentation", subtitle: "Getting started" },
    { title: "Overview", content: "Key points and agenda", subtitle: "What we'll cover" },
    { title: "Analysis", content: "Data and insights", subtitle: "Key findings" },
    { title: "Results", content: "Findings and outcomes", subtitle: "What we learned" },
    { title: "Strategy", content: "Next steps and planning", subtitle: "Moving forward" },
    { title: "Implementation", content: "Action items and timeline", subtitle: "Getting it done" },
    { title: "Review", content: "Summary and feedback", subtitle: "Looking back" },
    { title: "Conclusion", content: "Final thoughts", subtitle: "Wrapping up" }
  ];
  
  const slideType = slideTypes[(slideNumber - 1) % slideTypes.length];
  
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${slideNumber}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color.bg};stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:${color.accent};stop-opacity:0.2" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="white" stroke="#e5e7eb" stroke-width="1"/>
      <rect width="100%" height="100%" fill="url(#grad${slideNumber})"/>
      
      <!-- Header bar -->
      <rect x="0" y="0" width="100%" height="${isThumbnail ? 30 : 60}" fill="${color.bg}" opacity="0.1"/>
      
      <!-- Slide number -->
      <text x="${width - 20}" y="${isThumbnail ? 20 : 35}" text-anchor="end" 
            font-family="Arial, sans-serif" font-size="${fontSize - 4}" fill="${color.bg}" opacity="0.7">
        ${slideNumber}
      </text>
      
      <!-- Title -->
      <text x="50%" y="${isThumbnail ? 25 : 35}%" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="${titleFontSize}" font-weight="bold" fill="${color.bg}">
        ${slideType.title}
      </text>
      
      <!-- Subtitle -->
      <text x="50%" y="${isThumbnail ? 35 : 45}%" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="${fontSize - 2}" fill="#6b7280">
        ${slideType.subtitle}
      </text>
      
      <!-- Content -->
      <text x="50%" y="${isThumbnail ? 50 : 60}%" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="${fontSize}" fill="#374151">
        ${slideType.content}
      </text>
      
      <!-- Demo indicator -->
      ${!isThumbnail ? `
        <text x="50%" y="85%" text-anchor="middle" 
              font-family="Arial, sans-serif" font-size="10" fill="#9ca3af" opacity="0.7">
          Demo Preview • Not actual slide content
        </text>
      ` : ''}
      
      <!-- Decorative elements -->
      ${!isThumbnail ? `
        <circle cx="10%" cy="70%" r="3" fill="${color.accent}" opacity="0.6"/>
        <circle cx="15%" cy="75%" r="2" fill="${color.bg}" opacity="0.4"/>
        <circle cx="85%" cy="20%" r="4" fill="${color.accent}" opacity="0.3"/>
      ` : ''}
      
      <!-- Footer line -->
      <line x1="10%" y1="${isThumbnail ? 85 : 90}%" x2="90%" y2="${isThumbnail ? 85 : 90}%" 
            stroke="${color.bg}" stroke-width="1" opacity="0.3"/>
    </svg>
  `.trim();
}

/**
 * Process a PowerPoint file to extract slides (mock implementation)
 * 
 * 🚧 DEMO MODE - This is currently showing mock slide previews
 * 
 * To show REAL presentations, replace this function with:
 * 1. Upload file to your backend server
 * 2. Process PowerPoint file using LibreOffice/Office SDK
 * 3. Extract slide images and thumbnails
 * 4. Return real slide URLs from your file storage
 * 
 * See POWERPOINT_IMPLEMENTATION_GUIDE.md for complete setup instructions
 */
export async function processPowerPointFile(file: File): Promise<PresentationProcessingResult> {
  // 🔄 TODO: Replace this mock implementation with real backend API call
  // 
  // Real implementation would look like:
  // const formData = new FormData();
  // formData.append('file', file);
  // const response = await fetch('/api/presentations/process', {
  //   method: 'POST',
  //   body: formData
  // });
  // return await response.json();
  
  console.log('🎭 PowerPoint Demo Mode: Generating mock slide previews for:', file.name);
  
  // This is a mock implementation for demo purposes
  // Real implementation would upload to backend and get processed results
  
  const mockSlideCount = Math.floor(Math.random() * 12) + 8; // 8-20 slides
  
  // Simulate processing delay (reduced for better UX)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log(`📊 Generated ${mockSlideCount} mock slides for demo`);
  
  // Generate mock slide data
  const slides: SlideData[] = Array.from({ length: mockSlideCount }, (_, i) => {
    const slideNumber = i + 1;
    const slideImageUrl = `data:image/svg+xml;base64,${btoa(generateSlideSVG(slideNumber))}`;
    const thumbnailUrl = `data:image/svg+xml;base64,${btoa(generateSlideSVG(slideNumber, true))}`;
    
    return {
      id: slideNumber,
      // 🎨 These are generated SVGs for demo - replace with real image URLs
      imageUrl: slideImageUrl,
      thumbnailUrl: thumbnailUrl,
      title: `Slide ${slideNumber}`
    };
  });
  
  return {
    slides,
    totalSlides: mockSlideCount,
    // 🔗 Mock URLs - in real implementation these would be actual file URLs
    pdfUrl: `https://example.com/converted/${file.name.replace('.pptx', '.pdf')}`,
    embedUrl: generateOffice365EmbedUrl(file.name),
    theme: 'Demo Theme'
  };
  
  // 🎯 Real implementation would return something like:
  // return {
  //   slides: [
  //     {
  //       id: 1,
  //       imageUrl: "https://your-storage.com/slides/abc123/slide-1.png",
  //       thumbnailUrl: "https://your-storage.com/thumbs/abc123/slide-1-thumb.png",
  //       title: "Actual Slide Title"
  //     }
  //   ],
  //   totalSlides: realSlideCount,
  //   pdfUrl: "https://your-storage.com/pdfs/abc123.pdf",
  //   embedUrl: "https://office365.com/embed/abc123",
  //   theme: "Extracted Theme Name"
  // };
}

/**
 * Generate Office 365 embed URL for a PowerPoint file
 * Requires the file to be accessible via public URL
 */
export function generateOffice365EmbedUrl(fileName: string, publicUrl?: string): string {
  if (!publicUrl) {
    // If no public URL provided, return a mock embed URL
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(`https://example.com/files/${fileName}`)}`;
  }
  
  // Office 365 embed URL format
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publicUrl)}`;
}

/**
 * Check if a file can be processed as a PowerPoint presentation
 */
export function isPowerPointFile(file: File): boolean {
  const powerPointMimeTypes = [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.oasis.opendocument.presentation'
  ];
  
  const powerPointExtensions = ['.ppt', '.pptx', '.odp'];
  
  return powerPointMimeTypes.includes(file.type) || 
         powerPointExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
}

/**
 * Backend integration example - this is what you would actually implement
 */
export async function uploadAndProcessPresentation(file: File): Promise<PresentationProcessingResult> {
  const formData = new FormData();
  formData.append('presentation', file);
  
  try {
    // This would be your actual backend endpoint
    const response = await fetch('/api/presentations/process', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to process presentation');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error processing presentation:', error);
    // Fallback to mock processing
    return processPowerPointFile(file);
  }
}

/**
 * Example backend endpoint structure you would need:
 * 
 * POST /api/presentations/process
 * - Receives PowerPoint file
 * - Converts to PDF using LibreOffice/Office SDK
 * - Extracts slide images using PDF-to-image conversion
 * - Generates thumbnails
 * - Stores files and returns URLs
 * 
 * Response format:
 * {
 *   slides: [
 *     { id: 1, imageUrl: "...", thumbnailUrl: "...", title: "..." },
 *     ...
 *   ],
 *   totalSlides: 12,
 *   pdfUrl: "https://your-cdn.com/presentations/converted/file.pdf",
 *   embedUrl: "https://view.officeapps.live.com/op/embed.aspx?src=...",
 *   theme: "Office Theme"
 * }
 */
