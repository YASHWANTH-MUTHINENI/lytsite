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
  
  // Sample document content for text/document files
  const getSampleDocumentContent = () => {
    const textFiles = templateData.files.filter(file => 
      file.type?.includes('text') || 
      file.name.match(/\.(txt|md|js|ts|py|html|css|json|xml|yaml|yml|csv)$/i)
    );
    
    if (textFiles.length > 0) {
      // For demo purposes, return sample content based on file extension
      const file = textFiles[0];
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      switch (extension) {
        case 'md':
          return `# ${templateData.title}

${templateData.subLine}

## Overview

This document contains comprehensive information and detailed analysis prepared for the leadership team. The content includes strategic insights, data-driven recommendations, and actionable outcomes.

### Key Highlights

- **Performance Metrics**: Strong growth across all key indicators
- **Market Position**: Competitive advantage maintained
- **Future Outlook**: Positive trajectory with identified opportunities

### Detailed Analysis

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

\`\`\`javascript
// Sample code block
const analysis = {
  revenue: 2400000,
  growth: 0.15,
  satisfaction: 0.92
};
\`\`\`

### Recommendations

1. Continue current growth strategy
2. Expand market presence in key regions
3. Invest in technology infrastructure
4. Enhance customer experience initiatives

---

*Prepared by ${templateData.tagLine}*`;

        case 'js':
        case 'ts':
          return `// ${templateData.title}
// ${templateData.subLine}

/**
 * Main application configuration
 * Generated: ${new Date().toISOString().split('T')[0]}
 */

const config = {
  appName: "${templateData.title}",
  version: "1.0.0",
  environment: "production",
  
  // Database configuration
  database: {
    host: "localhost",
    port: 5432,
    name: "app_db"
  },
  
  // API endpoints
  api: {
    baseUrl: "https://api.example.com",
    timeout: 5000,
    retries: 3
  },
  
  // Feature flags
  features: {
    analytics: true,
    notifications: true,
    darkMode: true
  }
};

// Export configuration
export default config;

// Helper functions
export const validateConfig = (config) => {
  return config.appName && config.version;
};

export const getApiUrl = (endpoint) => {
  return \`\${config.api.baseUrl}/\${endpoint}\`;
};`;

        case 'json':
          return `{
  "name": "${templateData.title}",
  "description": "${templateData.subLine}",
  "version": "1.0.0",
  "author": "${templateData.tagLine.split('•')[0]?.trim() || 'Author'}",
  "license": "MIT",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "express": "^4.18.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.4.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.5.0",
    "webpack": "^5.88.0"
  },
  "keywords": [
    "business",
    "review",
    "analytics",
    "reporting"
  ]
}`;

        case 'py':
          return `# ${templateData.title}
# ${templateData.subLine}

"""
Business Review Analysis Module
${templateData.tagLine}
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

class BusinessReview:
    """
    A comprehensive business review analysis class
    """
    
    def __init__(self, data_source="quarterly_data.csv"):
        self.data_source = data_source
        self.data = None
        self.metrics = {}
    
    def load_data(self):
        """Load and prepare business data"""
        try:
            self.data = pd.read_csv(self.data_source)
            print(f"Loaded {len(self.data)} records")
        except FileNotFoundError:
            print("Data file not found")
    
    def calculate_metrics(self):
        """Calculate key business metrics"""
        if self.data is None:
            return
        
        self.metrics = {
            'revenue': self.data['revenue'].sum(),
            'growth_rate': self.data['revenue'].pct_change().mean(),
            'customer_count': len(self.data['customer_id'].unique()),
            'avg_order_value': self.data['revenue'].mean()
        }
        
        return self.metrics
    
    def generate_report(self):
        """Generate comprehensive business report"""
        metrics = self.calculate_metrics()
        
        report = f"""
        Business Review Report
        Generated: {datetime.now().strftime('%Y-%m-%d')}
        
        Key Metrics:
        - Total Revenue: $\{metrics['revenue']:,.2f}
        - Growth Rate: {metrics['growth_rate']:.2%}
        - Customer Count: {metrics['customer_count']:,}
        - Avg Order Value: $\{metrics['avg_order_value']:,.2f}
        """
        
        return report

# Usage example
if __name__ == "__main__":
    review = BusinessReview()
    review.load_data()
    print(review.generate_report())`;

        case 'txt':
        default:
          return `${templateData.title}
${templateData.subLine}

EXECUTIVE SUMMARY
================

This comprehensive business review document provides detailed insights into our Q4 performance and strategic outlook for the upcoming year. The analysis covers key performance indicators, market positioning, and recommendations for continued growth.

KEY FINDINGS
============

Performance Metrics:
- Revenue Growth: 15% year-over-year
- Customer Satisfaction: 92% (up from 87%)
- Market Share: 23% (industry leader)
- Employee Retention: 94% (above industry average)

Market Analysis:
- Strong demand in core markets
- Emerging opportunities in digital channels
- Competitive landscape remains stable
- Customer preferences shifting toward sustainability

STRATEGIC RECOMMENDATIONS
=========================

1. GROWTH INITIATIVES
   - Expand digital presence
   - Launch new product lines
   - Enter emerging markets
   - Strengthen partnerships

2. OPERATIONAL EXCELLENCE
   - Improve supply chain efficiency
   - Invest in automation technology
   - Enhance customer service capabilities
   - Optimize cost structures

3. PEOPLE & CULTURE
   - Expand talent acquisition
   - Improve employee development programs
   - Foster innovation culture
   - Strengthen leadership pipeline

FINANCIAL PROJECTIONS
=====================

Year 1 Targets:
- Revenue: $12.5M (25% growth)
- Profit Margin: 18% (up from 15%)
- Market Expansion: 3 new regions
- Team Growth: 40 new hires

CONCLUSION
==========

The organization is well-positioned for continued growth and market leadership. With the recommended strategic initiatives, we anticipate strong performance across all key metrics in the coming year.

Prepared by: ${templateData.tagLine}
Document Date: ${new Date().toLocaleDateString()}
Version: 1.0`;
      }
    }
    
    // Default empty content if no text files
    return "";
  };
  
  // Determine the primary file type for the template
  const detectedFileType = getMultipleFileTypes(templateData.files);
  const primaryFileType = detectedFileType; // Keep the detected type, including 'mixed'

  // PowerPoint files should use presentation type to route correctly in BlockRouter
  const isPowerPointFile = templateData.files.some(f => 
    f.name?.toLowerCase().endsWith('.ppt') || 
    f.name?.toLowerCase().endsWith('.pptx') ||
    f.type?.includes('presentation')
  );
  
  const finalFileType = isPowerPointFile ? 'presentation' : primaryFileType;  const handleDownload = () => {
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
          pages: 1, // Default to 1 page since we don't have PDF analysis yet
          thumbnails: [], // Empty array since we don't generate thumbnails yet
          author: "Unknown",
          created: pdfFile?.uploadedAt || new Date().toISOString().split('T')[0]
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
      case 'presentation':
        const presentationFile = templateData.files.find(f => 
          f.type?.includes('presentation') || 
          f.name?.toLowerCase().endsWith('.ppt') || 
          f.name?.toLowerCase().endsWith('.pptx')
        );
        return {
          size: presentationFile?.size || "0 MB",
          format: "PowerPoint → PDF",
          pages: 12, // Estimated pages after PDF conversion
          theme: "Converted Document",
          modified: presentationFile?.uploadedAt || new Date().toISOString().split('T')[0]
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
        {/* Theme Switcher - Mobile-optimized Fixed Position */}
        <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-50">
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
          fileType={finalFileType}
          title={templateData.title}
          description={templateData.tagLine}
          files={templateData.files}
          content={finalFileType === 'document' ? getSampleDocumentContent() : undefined}
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
