import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  Download, 
  Eye,
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Search,
  BookOpen,
  Share2,
  Heart,
  Printer
} from "lucide-react";

interface PDFBlockProps {
  title: string;
  url: string;
  pages: number;
  thumbnails: string[];
  onDownload?: () => void;
  metadata?: {
    size: string;
    author?: string;
    created?: string;
  };
}

export default function PDFBlock({ 
  title, 
  url, 
  pages, 
  thumbnails, 
  onDownload,
  metadata 
}: PDFBlockProps) {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'spread'>('single');
  const [isLiked, setIsLiked] = useState(false);

  const maxZoom = 200;
  const minZoom = 50;

  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in' && zoom < maxZoom) {
      setZoom(Math.min(maxZoom, zoom + 25));
    } else if (direction === 'out' && zoom > minZoom) {
      setZoom(Math.max(minZoom, zoom - 25));
    }
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < thumbnails.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < thumbnails.length) {
      setCurrentPage(pageIndex);
    }
  };

  return (
    <section 
      className="py-12 px-6 pb-20"
      style={{ backgroundColor: theme.colors.backgroundSecondary }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: theme.colors.error }}
              >
                <FileText className="w-6 h-6" style={{ color: theme.colors.surface }} />
              </div>
              <Badge 
                className="px-3 py-1 text-sm font-medium"
                style={{ 
                  backgroundColor: theme.colors.error + '20',
                  color: theme.colors.error 
                }}
              >
                PDF • {pages} pages
              </Badge>
            </div>
            <h2 
              className="text-3xl lg:text-4xl font-bold mb-2"
              style={{ color: theme.colors.textPrimary }}
            >
              {title}
            </h2>
            {metadata && (
              <div className="flex flex-wrap gap-4 text-sm">
                <span style={{ color: theme.colors.textSecondary }}>
                  Size: {metadata.size}
                </span>
                {metadata.author && (
                  <span style={{ color: theme.colors.textSecondary }}>
                    Author: {metadata.author}
                  </span>
                )}
                {metadata.created && (
                  <span style={{ color: theme.colors.textSecondary }}>
                    Created: {metadata.created}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105"
              style={{ borderColor: theme.colors.border }}
            >
              <Heart 
                className={`w-4 h-4 mr-2 transition-colors ${isLiked ? 'fill-current' : ''}`}
                style={{ color: isLiked ? theme.colors.error : theme.colors.textSecondary }}
              />
              {isLiked ? 'Liked' : 'Like'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105"
              style={{ borderColor: theme.colors.border }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105"
              style={{ borderColor: theme.colors.border }}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>

            <Button
              size="sm"
              onClick={onDownload}
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme.colors.error,
                color: theme.colors.surface
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* PDF Viewer */}
          <div className="lg:col-span-3">
            <Card 
              className="overflow-hidden shadow-2xl"
              style={{ backgroundColor: theme.colors.surface }}
            >
              {/* PDF Controls */}
              <div 
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{ 
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border
                }}
              >
                <div className="flex items-center space-x-4">
                  {/* Page Navigation */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange('prev')}
                      disabled={currentPage === 0}
                      className="w-10 h-10 rounded-xl"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span 
                      className="text-sm font-medium px-3 py-1 rounded-lg min-w-[80px] text-center"
                      style={{ 
                        backgroundColor: theme.colors.primaryLight,
                        color: theme.colors.primary 
                      }}
                    >
                      {currentPage + 1} / {pages}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePageChange('next')}
                      disabled={currentPage === thumbnails.length - 1}
                      className="w-10 h-10 rounded-xl"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleZoom('out')}
                      disabled={zoom <= minZoom}
                      className="w-10 h-10 rounded-xl"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span 
                      className="text-sm font-medium px-3 py-1 rounded-lg min-w-[60px] text-center"
                      style={{ 
                        backgroundColor: theme.colors.backgroundTertiary,
                        color: theme.colors.textSecondary 
                      }}
                    >
                      {zoom}%
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleZoom('in')}
                      disabled={zoom >= maxZoom}
                      className="w-10 h-10 rounded-xl"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* View Mode Toggle */}
                  <div 
                    className="flex items-center rounded-xl p-1"
                    style={{ backgroundColor: theme.colors.backgroundTertiary }}
                  >
                    <Button
                      variant={viewMode === 'single' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('single')}
                      className="rounded-lg text-xs"
                      style={viewMode === 'single' ? {
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.surface
                      } : {}}
                    >
                      Single
                    </Button>
                    <Button
                      variant={viewMode === 'spread' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('spread')}
                      className="rounded-lg text-xs"
                      style={viewMode === 'spread' ? {
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.surface
                      } : {}}
                    >
                      Spread
                    </Button>
                  </div>

                  {/* Fullscreen Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="w-10 h-10 rounded-xl"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* PDF Content */}
              <div className="bg-gray-100 min-h-[600px] flex items-center justify-center p-8">
                <div 
                  className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
                  style={{ 
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'center center'
                  }}
                >
                  {thumbnails[currentPage] ? (
                    <img
                      src={thumbnails[currentPage]}
                      alt={`Page ${currentPage + 1}`}
                      className="w-full max-w-[600px] h-auto"
                    />
                  ) : (
                    <div className="w-[600px] h-[800px] flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">PDF Page {currentPage + 1}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Page Thumbnails */}
            <Card style={{ backgroundColor: theme.colors.surface }}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-5 h-5" style={{ color: theme.colors.primary }} />
                  <h3 className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                    Pages
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {thumbnails.map((thumb, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(index)}
                      className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-lg ${
                        currentPage === index 
                          ? 'ring-2 ring-offset-2 scale-105' 
                          : 'hover:scale-[1.02]'
                      }`}
                      style={{ 
                        borderColor: currentPage === index ? theme.colors.primary : theme.colors.border,
                        ringColor: theme.colors.primary
                      }}
                    >
                      <img
                        src={thumb}
                        alt={`Page ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div 
                        className="absolute bottom-1 left-1 px-2 py-1 rounded text-xs font-medium"
                        style={{ 
                          backgroundColor: theme.colors.overlay,
                          color: theme.colors.surface 
                        }}
                      >
                        {index + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Document Info */}
            <Card style={{ backgroundColor: theme.colors.surface }}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="w-5 h-5" style={{ color: theme.colors.primary }} />
                  <h3 className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                    Document Info
                  </h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Pages:</span>
                    <span style={{ color: theme.colors.textPrimary }}>{pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Size:</span>
                    <span style={{ color: theme.colors.textPrimary }}>{metadata?.size}</span>
                  </div>
                  {metadata?.author && (
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Author:</span>
                      <span style={{ color: theme.colors.textPrimary }}>{metadata.author}</span>
                    </div>
                  )}
                  {metadata?.created && (
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Created:</span>
                      <span style={{ color: theme.colors.textPrimary }}>{metadata.created}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card style={{ backgroundColor: theme.colors.surface }}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4" style={{ color: theme.colors.textPrimary }}>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-xl"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-xl"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search in Document
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-xl"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
