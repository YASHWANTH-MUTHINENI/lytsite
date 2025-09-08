import { useState } from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import HeroBlock from "./blocks/HeroBlock";
import BlockRouter, { getFileType, getMultipleFileTypes, FileMetadata } from "./blocks/BlockRouter";
import FooterBlock from "./blocks/FooterBlock";
import ThemeSwitcher from "./ui/ThemeSwitcher";

interface TemplateData {
  title: string;
  subLine: string;
  tagLine: string;
  heroImage?: string | null;
  files: FileMetadata[];
  contactInfo: {
    email: string;
    website: string;
    linkedin: string;
  };
}

interface UniversalFileTemplateProps {
  data?: TemplateData; // Optional - falls back to mockData if not provided
  onNavigate: (page: string) => void;
}

// This would be auto-populated from file upload and minimal user inputs
const mockData = {
  // The 3 core inputs from user - Universal and flexible
  title: "Q4 Business Review 2024",        // Universal Input 1: What it is
  subLine: "Prepared for Leadership Team", // Universal Input 2: Context (From/To/For/Version/etc.)
  tagLine: "By Sarah Chen • TechCorp Inc.", // Universal Input 3: Personal note/callout/custom field
  
  // Optional hero image (if provided by user)
  heroImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=800&fit=crop",
  
  // Auto-detected file information
  files: [
    {
      name: "Q4_Business_Review_2024.pdf",
      size: "2.4 MB", 
      type: "application/pdf",
      url: "https://example.com/report.pdf",
      thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      uploadedAt: "2024-01-15",
      uploadedBy: "Sarah Chen",
      description: "Comprehensive Q4 business review with financial analysis and growth projections"
    },
    {
      name: "chart1.png",
      size: "1.2 MB",
      type: "image/png",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      uploadedAt: "2024-01-15",
      uploadedBy: "Sarah Chen",
      description: "Revenue growth chart for Q4 2024"
    },
    {
      name: "chart2.png", 
      size: "1.1 MB",
      type: "image/png",
      url: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=800&h=600&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=400&h=300&fit=crop",
      uploadedAt: "2024-01-15",
      uploadedBy: "Sarah Chen", 
      description: "Market analysis visualization"
    },
    {
      name: "chart3.png",
      size: "0.9 MB", 
      type: "image/png",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      uploadedAt: "2024-01-15",
      uploadedBy: "Sarah Chen",
      description: "Performance metrics dashboard"
    }
  ] as FileMetadata[],
  
  // Contact information
  contactInfo: {
    email: "sarah.chen@techcorp.com",
    website: "https://techcorp.com",
    linkedin: "https://linkedin.com/in/sarahchen"
  }
};

export default function UniversalFileTemplate({ data, onNavigate }: UniversalFileTemplateProps) {
  // Use provided data or fall back to mockData for testing
  const templateData = data || mockData;
  
  // Determine the primary file type for the template
  const detectedFileType = getMultipleFileTypes(templateData.files);
  const primaryFileType = detectedFileType === 'mixed' ? 'gallery' : detectedFileType;
  
  const handleDownload = () => {
    // Track download action
    console.log(`Download tracked for files`);
  };

  const handleGetInTouch = () => {
    window.location.href = `mailto:${templateData.contactInfo.email}`;
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
          totalImages: templateData.files.length,
          size: templateData.files.reduce((total, file) => {
            const sizeNum = parseFloat(file.size);
            return total + sizeNum;
          }, 0).toFixed(1) + " MB",
          format: "Multiple Images"
        };
      case 'pdf':
        const pdfFile = templateData.files.find(f => f.type === 'application/pdf');
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
        const videoFile = templateData.files.find(f => f.type?.startsWith('video/'));
        return {
          size: videoFile?.size || "0 MB",
          format: "Video",
          duration: "5:24",
          quality: "1080p"
        };
      case 'archive':
        return {
          size: templateData.files.reduce((total, file) => {
            const sizeNum = parseFloat(file.size);
            return total + sizeNum;
          }, 0).toFixed(1) + " MB",
          format: "ZIP Archive",
          compressed: "60%",
          ratio: "2.5:1"
        };
      case 'document':
        return {
          size: templateData.files[0]?.size || "0 MB",
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
          title={templateData.title}
          subLine={templateData.subLine}
          tagLine={templateData.tagLine}
        />

        {/* Specialized File Block - Core content */}
        <BlockRouter
          fileType={primaryFileType}
          title={templateData.title}
          description={templateData.tagLine}
          files={templateData.files}
          onDownload={handleDownload}
          metadata={getMetadata()}
        />

        {/* Footer Block - Always on bottom */}
        <FooterBlock
          creatorName={templateData.tagLine.includes('•') ? templateData.tagLine.split('•')[1].trim() : 'Creator'}
          contactInfo={templateData.contactInfo}
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
