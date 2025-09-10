import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Download, 
  FileText, 
  Eye, 
  Grid3X3, 
  Maximize2,
  ExternalLink,
  PlayCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface PowerPointBlockProps {
  files: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
    powerPointData?: {
      originalFileUrl: string;
      pdfUrl: string;
      thumbnailUrls: string[];
      slideCount: number;
      pdfViewerUrl?: string;
    };
  }>;
  title: string;
  description?: string;
}

type ViewMode = 'pdf' | 'gallery' | 'thumbnails';

const PowerPointBlock: React.FC<PowerPointBlockProps> = ({ files, title, description }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('pdf');
  const [selectedSlide, setSelectedSlide] = useState(0);
  
  const powerPointFile = files.find(file => file.powerPointData);
  
  if (!powerPointFile?.powerPointData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No PowerPoint data available</p>
      </div>
    );
  }
  
  const { originalFileUrl, pdfUrl, thumbnailUrls, slideCount, pdfViewerUrl } = powerPointFile.powerPointData;
  
  const handleDownloadOriginal = () => {
    window.open(originalFileUrl, '_blank');
  };
  
  const handleViewPdf = () => {
    window.open(pdfViewerUrl || pdfUrl, '_blank');
  };
  
  const nextSlide = () => {
    setSelectedSlide((prev) => (prev + 1) % thumbnailUrls.length);
  };
  
  const prevSlide = () => {
    setSelectedSlide((prev) => (prev - 1 + thumbnailUrls.length) % thumbnailUrls.length);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600">{slideCount} slides</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadOriginal}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PPTX</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewPdf}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open PDF</span>
            </Button>
          </div>
        </div>
        
        {description && (
          <p className="text-gray-600 mb-4">{description}</p>
        )}
        
        {/* View Mode Selector */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'pdf' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('pdf')}
            className="flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>PDF Viewer</span>
          </Button>
          
          <Button
            variant={viewMode === 'gallery' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('gallery')}
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Slide View</span>
          </Button>
          
          <Button
            variant={viewMode === 'thumbnails' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('thumbnails')}
            className="flex items-center space-x-2"
          >
            <Grid3X3 className="w-4 h-4" />
            <span>All Slides</span>
          </Button>
          
          <Badge variant="secondary" className="ml-auto">
            {slideCount} slides
          </Badge>
        </div>
      </div>
      
      {/* Content based on view mode */}
      {viewMode === 'pdf' && (
        <Card className="w-full">
          <CardContent className="p-0">
            <div className="relative w-full" style={{ height: '600px' }}>
              <iframe
                src={`${pdfUrl}#view=FitH&toolbar=1&navpanes=1`}
                className="w-full h-full border-0 rounded-lg"
                title={`${title} - PDF Viewer`}
                allow="fullscreen"
              />
              <div className="absolute top-2 right-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleViewPdf}
                  className="bg-white/90 hover:bg-white"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {viewMode === 'gallery' && (
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="relative">
              {/* Current slide */}
              <div className="flex items-center justify-center mb-4">
                <img
                  src={thumbnailUrls[selectedSlide]}
                  alt={`Slide ${selectedSlide + 1}`}
                  className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
                />
              </div>
              
              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  disabled={thumbnailUrls.length <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Slide {selectedSlide + 1} of {thumbnailUrls.length}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  disabled={thumbnailUrls.length <= 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {viewMode === 'thumbnails' && (
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {thumbnailUrls.map((thumbnailUrl, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedSlide === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedSlide(index);
                    setViewMode('gallery');
                  }}
                >
                  <img
                    src={thumbnailUrl}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* File info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">Original:</span> {powerPointFile.name}
          </div>
          <div className="flex items-center space-x-4">
            <span>{(powerPointFile.size / 1024 / 1024).toFixed(1)} MB</span>
            <span>•</span>
            <span>{slideCount} slides</span>
            <span>•</span>
            <span>PDF + Thumbnails available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerPointBlock;
