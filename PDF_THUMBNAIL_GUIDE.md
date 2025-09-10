# PDF Thumbnail Generation Guide

## 🎯 Overview
This guide explains how to generate PDF thumbnails in your React application for better user experience.

## 🔧 Implementation Methods

### 1. **PDF.js Canvas Rendering** (✅ Recommended - Client-side)
```javascript
import { PDFThumbnailGenerator } from '../utils/pdfThumbnailGenerator';

// Generate single page thumbnail
const thumbnail = await PDFThumbnailGenerator.generatePageThumbnail(pdfUrl, 1);

// Generate multiple thumbnails
const thumbnails = await PDFThumbnailGenerator.generateThumbnails(pdfUrl, {
  scale: 0.3,        // Smaller for thumbnails
  maxPages: 5,       // Only first 5 pages
  quality: 0.8,      // JPEG quality
  format: 'jpeg'     // jpeg/png/webp
});
```

### 2. **React Hook Integration**
```javascript
import { usePDFThumbnails } from '../utils/pdfThumbnailGenerator';

function MyPDFComponent({ pdfUrl }) {
  const {
    thumbnails,
    coverThumbnail,
    isGenerating,
    progress,
    error
  } = usePDFThumbnails(pdfUrl);
  
  return (
    <div>
      {coverThumbnail && (
        <img src={coverThumbnail} alt="PDF Preview" />
      )}
    </div>
  );
}
```

### 3. **Server-side Generation** (Optional - Better performance)
```javascript
// Backend API endpoint
POST /api/pdf/thumbnails
{
  "pdfUrl": "https://example.com/document.pdf",
  "pages": [1, 2, 3],
  "options": {
    "width": 300,
    "height": 400,
    "format": "jpeg"
  }
}

// Response
{
  "thumbnails": [
    {
      "page": 1,
      "thumbnail": "data:image/jpeg;base64,..."
    }
  ]
}
```

## 📐 Responsive Design Standards

### Mobile (≤ 768px)
```css
.mobile-pdf {
  height: 70vh; /* 70% of viewport */
  max-height: calc(100vh - 120px);
}
```

### Desktop (≥ 769px)
```css
.desktop-pdf {
  height: 80vh;
  max-height: 800px;
  min-height: 500px;
}
```

## 🎨 UX Patterns

### 1. **Thumbnail First + Expand Modal**
```javascript
<EnhancedPDFBlock
  showThumbnailFirst={true}  // Shows 400px thumbnail
  // Click opens 90vh modal
/>
```

### 2. **Multi-PDF Gallery**
```javascript
<MultiPDFBlock
  files={pdfFiles}
  showThumbnails={true}
  // Grid view with card previews
  // Click selects and shows full viewer
/>
```

### 3. **Page Navigation Thumbnails**
```javascript
// Left sidebar (desktop) or bottom (mobile)
<div className="thumbnail-nav">
  {thumbnails.map((thumb, index) => (
    <button 
      onClick={() => goToPage(index + 1)}
      className={pageNumber === index + 1 ? 'active' : ''}
    >
      <img src={thumb} />
    </button>
  ))}
</div>
```

## ⚡ Performance Optimization

### 1. **Lazy Loading**
```javascript
const [thumbnailsGenerated, setThumbnailsGenerated] = useState(false);

// Generate only when needed
const handleExpand = async () => {
  if (!thumbnailsGenerated) {
    await generateThumbnails();
    setThumbnailsGenerated(true);
  }
  setModalOpen(true);
};
```

### 2. **Progressive Loading**
```javascript
// Generate cover first for quick preview
const coverThumbnail = await PDFThumbnailGenerator.generateCoverThumbnail(pdfUrl);

// Then generate remaining pages in background
const allThumbnails = await PDFThumbnailGenerator.generateThumbnails(pdfUrl);
```

### 3. **Memory Management**
```javascript
useEffect(() => {
  // Cleanup blob URLs on unmount
  return () => {
    thumbnails.forEach(thumb => {
      if (thumb.startsWith('blob:')) {
        URL.revokeObjectURL(thumb);
      }
    });
  };
}, [thumbnails]);
```

## 🛠️ Component Architecture

```
PDFBlock (Base)
├── EnhancedPDFBlock (Single PDF with thumbnails)
├── MultiPDFBlock (Multiple PDFs)
└── PDFThumbnailGenerator (Utility)
```

## 🔄 Usage Flow

1. **Upload PDF files**
2. **usePDFManager** processes files
3. **PDFThumbnailGenerator** creates thumbnails
4. **EnhancedPDFBlock** or **MultiPDFBlock** renders UI
5. **User interactions** trigger modal/navigation

## 📱 Mobile Optimizations

- **Touch-friendly** navigation buttons
- **Snap-to-screen** reader experience  
- **Swipe gestures** for page navigation
- **70vh height** prevents page scrolling issues
- **Bottom thumbnail bar** for easy access

## 🎯 Best Practices

1. **Always use proper MIME types** for blob URLs
2. **Limit thumbnail generation** to first 5-10 pages
3. **Show progress indicators** during generation
4. **Provide fallback placeholders** when generation fails
5. **Cache thumbnails** in localStorage/sessionStorage if needed
6. **Use WebP format** when supported for better compression

## 🐛 Common Issues & Solutions

### Issue: Blob URLs not rendering
```javascript
// ✅ Fix: Use explicit MIME type
const blob = new Blob([file], { type: 'application/pdf' });
const url = URL.createObjectURL(blob);
```

### Issue: PDF.js worker not loading
```javascript
// ✅ Fix: Set worker source
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
```

### Issue: Canvas rendering fails
```javascript
// ✅ Fix: Add error handling
try {
  const thumbnail = await generateThumbnail();
} catch (error) {
  // Show placeholder or retry
  const placeholder = PDFThumbnailGenerator.createPlaceholderThumbnail(pageNumber);
}
```

This system provides a professional, mobile-first PDF viewing experience with automatic thumbnail generation! 🚀
