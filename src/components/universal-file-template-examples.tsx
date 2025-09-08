import { useState } from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import HeroBlock from "./blocks/HeroBlock";
import BlockRouter, { getFileType, getMultipleFileTypes, FileMetadata } from "./blocks/BlockRouter";
import FooterBlock from "./blocks/FooterBlock";
import ThemeSwitcher from "./ui/ThemeSwitcher";

interface UniversalFileTemplateProps {
  onNavigate: (page: string) => void;
}

// Example Use Cases for the Universal 3-Input Hero Block with Smart Image Gallery Auto-Selection

// Single Image Example (→ SingleImageBlock)
const singleImageData = {
  title: "Product Launch Poster",
  subLine: "Version 3.0 Final",
  tagLine: "Ready for campaign launch",
  heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop",
  files: [
    {
      name: "product-launch-poster.jpg",
      size: "4.2 MB",
      type: "image/jpeg",
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=1600&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=533&fit=crop",
      uploadedAt: "2024-01-15",
      uploadedBy: "Creative Team",
      description: "High-resolution poster for product launch campaign"
    }
  ] as FileMetadata[],
  contactInfo: {
    email: "creative@company.com",
    website: "https://company.com",
    linkedin: "https://linkedin.com/company/company"
  }
};

// Small Collection Example (2-6 Images → GridGalleryBlock)
const gridGalleryData = {
  title: "Product Showcase",
  subLine: "New Collection 2025",
  tagLine: "Fresh designs for modern lifestyle",
  heroImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
  files: [
    {
      name: "product-1.jpg",
      size: "2.1 MB", 
      type: "image/jpeg",
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      uploadedAt: "2024-01-15",
      uploadedBy: "Product Team",
      description: "Product photography - main view"
    },
    {
      name: "product-2.jpg", 
      size: "1.9 MB",
      type: "image/jpeg",
      url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      uploadedAt: "2024-01-15",
      uploadedBy: "Product Team",
      description: "Product photography - detail shot"
    },
    {
      name: "product-3.jpg",
      size: "2.3 MB",
      type: "image/jpeg", 
      url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      uploadedAt: "2024-01-15",
      uploadedBy: "Product Team",
      description: "Product photography - lifestyle context"
    },
    {
      name: "product-4.jpg",
      size: "2.0 MB", 
      type: "image/jpeg",
      url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
      uploadedAt: "2024-01-15",
      uploadedBy: "Product Team",
      description: "Product photography - alternate angle"
    }
  ] as FileMetadata[],
  contactInfo: {
    email: "products@store.com", 
    website: "https://store.com",
    linkedin: "https://linkedin.com/company/store"
  }
};

// Medium Collection Example (7-20 Images → MasonryGalleryBlock)
const masonryGalleryData = {
  title: "Architecture Portfolio",
  subLine: "Residential Projects 2024",
  tagLine: "Curated collection of our finest work", 
  heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
  files: Array.from({ length: 12 }, (_, i) => ({
    name: `architecture-${i + 1}.jpg`,
    size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
    type: "image/jpeg",
    url: `https://images.unsplash.com/photo-${1486406146926 + i}?w=800&h=${Math.floor(Math.random() * 400) + 600}&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${1486406146926 + i}?w=400&h=${Math.floor(Math.random() * 200) + 300}&fit=crop`,
    uploadedAt: "2024-01-15",
    uploadedBy: "Architecture Studio",
    description: `Professional architecture photography - Project ${i + 1}`
  })) as FileMetadata[],
  contactInfo: {
    email: "hello@architecture.studio",
    website: "https://architecture.studio",
    linkedin: "https://linkedin.com/company/architecture-studio"
  }
};

// Large Collection Example (20+ Images → LightboxGalleryBlock)
const lightboxGalleryData = {
  title: "Wedding Photography",
  subLine: "Sarah & Michael - Dec 2024",
  tagLine: "Complete ceremony & reception collection",
  heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop", 
  files: Array.from({ length: 45 }, (_, i) => ({
    name: `wedding-${String(i + 1).padStart(3, '0')}.jpg`,
    size: `${(Math.random() * 4 + 2).toFixed(1)} MB`,
    type: "image/jpeg",
    url: `https://images.unsplash.com/photo-${1519741497674 + i}?w=1200&h=${Math.floor(Math.random() * 400) + 800}&fit=crop`,
    thumbnailUrl: `https://images.unsplash.com/photo-${1519741497674 + i}?w=400&h=${Math.floor(Math.random() * 200) + 300}&fit=crop`,
    uploadedAt: "2024-01-15",
    uploadedBy: "Wedding Photographer",
    description: `Wedding photography - Image ${i + 1}`
  })) as FileMetadata[],
  contactInfo: {
    email: "photographer@weddings.com",
    website: "https://weddingphotographer.com", 
    linkedin: "https://linkedin.com/in/weddingphotographer"
  }
};

// Portfolio Share Example (Fallback - Original)
const portfolioData = {
  title: "UX Case Study – Travel App",
  subLine: "Prepared for Acme Agency", 
  tagLine: "From Yashwanth Varma",
  heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop",
  files: [
    {
      name: "travel-app-mockups.png",
      size: "4.2 MB",
      type: "image/png",
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      uploadedAt: "2024-01-15",
      uploadedBy: "Yashwanth Varma",
      description: "Mobile app interface design mockups"
    },
    {
      name: "user-journey.png",
      size: "2.1 MB",
      type: "image/png", 
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      uploadedAt: "2024-01-15",
      uploadedBy: "Yashwanth Varma",
      description: "User journey mapping and flow diagrams"
    }
  ] as FileMetadata[],
  contactInfo: {
    email: "yashwanth@designer.com",
    website: "https://yashwanthdesigns.com",
    linkedin: "https://linkedin.com/in/yashwanthvarma"
  }
};

// Event Flyer Example  
const eventData = {
  title: "Tech Meetup 2025",
  subLine: "Hyderabad | Sept 15",
  tagLine: "Organized by CloudDev Community", 
  heroImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop",
  files: [
    {
      name: "event-flyer.pdf",
      size: "1.8 MB",
      type: "application/pdf",
      url: "https://example.com/event-flyer.pdf",
      thumbnailUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      uploadedAt: "2024-01-15", 
      uploadedBy: "CloudDev Team",
      description: "Official event flyer and details"
    }
  ] as FileMetadata[],
  contactInfo: {
    email: "events@clouddev.com",
    website: "https://clouddev.community",
    linkedin: "https://linkedin.com/company/clouddev"
  }
};

// Client Handoff Example
const clientHandoffData = {
  title: "Landing Page Draft v2",
  subLine: "For Sarah @Brandly",
  tagLine: "Ready for review & feedback",
  heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
  files: [
    {
      name: "landing-page-design.fig",
      size: "12.4 MB", 
      type: "application/octet-stream",
      url: "https://example.com/design.fig",
      thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      uploadedAt: "2024-01-15",
      uploadedBy: "Design Team",
      description: "Figma design file with all components and styles"
    },
    {
      name: "style-guide.pdf",
      size: "2.1 MB",
      type: "application/pdf", 
      url: "https://example.com/style-guide.pdf",
      thumbnailUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop",
      uploadedAt: "2024-01-15",
      uploadedBy: "Design Team",
      description: "Complete brand style guide and design system"
    }
  ] as FileMetadata[],
  contactInfo: {
    email: "design@agency.com",
    website: "https://designagency.com", 
    linkedin: "https://linkedin.com/company/designagency"
  }
};

// You can switch between different examples to showcase Auto-Block Selection
const currentExample: "single" | "grid" | "masonry" | "lightbox" | "portfolio" | "event" | "client" = "lightbox";

const getCurrentData = () => {
  switch (currentExample) {
    case "single": return singleImageData;
    case "grid": return gridGalleryData; 
    case "masonry": return masonryGalleryData;
    case "lightbox": return lightboxGalleryData;
    case "event": return eventData;
    case "client": return clientHandoffData;
    default: return portfolioData;
  }
};

export default function UniversalFileTemplate({ onNavigate }: UniversalFileTemplateProps) {
  const mockData = getCurrentData();
  
  // Determine the primary file type for the template
  const detectedFileType = getMultipleFileTypes(mockData.files);
  const primaryFileType = detectedFileType === 'mixed' ? 'gallery' : detectedFileType;
  
  const handleDownload = () => {
    // Track download action
    console.log(`Download tracked for files`);
  };

  const handleGetInTouch = () => {
    window.location.href = `mailto:${mockData.contactInfo.email}`;
  };

  const handleDownloadAll = () => {
    // Download all files
    console.log("Download all files");
  };

  // Prepare metadata based on file type
  const getMetadata = () => {
    switch (primaryFileType) {
      case 'gallery':
        return {
          totalImages: mockData.files.length,
          size: mockData.files.reduce((total, file) => {
            const sizeNum = parseFloat(file.size);
            return total + sizeNum;
          }, 0).toFixed(1) + " MB",
          format: "Multiple Images"
        };
      case 'pdf':
        const pdfFile = mockData.files.find(f => f.type === 'application/pdf');
        return {
          size: pdfFile?.size || "0 MB",
          format: "PDF Document", 
          pages: 24, // This would come from actual PDF analysis
          thumbnails: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
          ]
        };
      case 'video':
        const videoFile = mockData.files.find(f => f.type?.startsWith('video/'));
        return {
          size: videoFile?.size || "0 MB",
          format: "Video",
          duration: "5:24",
          quality: "1080p"
        };
      case 'archive':
        return {
          size: mockData.files.reduce((total, file) => {
            const sizeNum = parseFloat(file.size);
            return total + sizeNum;
          }, 0).toFixed(1) + " MB",
          format: "ZIP Archive",
          compressed: "60%",
          ratio: "2.5:1"
        };
      case 'document':
        return {
          size: mockData.files[0]?.size || "0 MB",
          format: "Text Document",
          lines: 245,
          words: 2840,
          characters: 15420,
          language: "markdown"
        };
      default:
        return {
          size: "0 MB",
          format: "Unknown"
        };
    }
  };

  return (
    <ThemeProvider defaultThemeKey="ocean-light">
      <div className="min-h-screen theme-bg theme-transition-colors">
        {/* Theme Switcher - Fixed Position */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeSwitcher variant="minimal" showLabel={false} />
        </div>

        {/* Universal 3-Input Hero Block */}
        <HeroBlock
          title={mockData.title}
          subLine={mockData.subLine}
          tagLine={mockData.tagLine}
        />

        {/* Specialized File Block - Core content */}
        <BlockRouter
          fileType={primaryFileType}
          title={mockData.title}
          description={`${mockData.tagLine}`}
          files={mockData.files}
          onDownload={handleDownload}
          metadata={getMetadata()}
        />

        {/* Footer Block - Always on bottom */}
        <FooterBlock
          creatorName={mockData.tagLine.includes('From') ? mockData.tagLine.replace('From ', '') : 'Creator'}
          contactInfo={mockData.contactInfo}
          primaryCTA={{
            text: "Get in touch",
            action: handleGetInTouch
          }}
          secondaryCTA={{
            text: "Download all files", 
            action: handleDownloadAll
          }}
          showLytsiteBranding={true}
          onNavigateHome={() => onNavigate('homepage')}
        />
      </div>
    </ThemeProvider>
  );
}
