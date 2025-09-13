import React, { useState } from "react";
import { useEnhancedTheme } from "../../contexts/EnhancedThemeContext";
import {
  useFileUrls,
  DualQualityFile
} from "../../hooks/useDualQuality";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { 
  Download, 
  Eye,
  ZoomIn,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize,
  Share2,
  Heart,
  Image as ImageIcon
} from "lucide-react";

interface GalleryBlockProps {
  title: string;
  files: DualQualityFile[]; // Use the standardized interface
  totalImages?: number;
  onDownload?: () => void;
  metadata?: {
    size: string;
    format: string;
    dimensions?: string;
  };
}

export default function GalleryBlock({ 
  title, 
  files, 
  totalImages = files.length, 
  onDownload,
  metadata 
}: GalleryBlockProps) {
  const { theme } = useEnhancedTheme();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('masonry');
  const [isLiked, setIsLiked] = useState(false);

  // Helper function to get optimized preview URL (WebP for images)
  const getPreviewUrl = (file: { id?: string; url?: string; name: string }) => {
    // Use Phase 1 dual-quality system when file.id is available
    if (file.id) {
      return `https://lytsite-backend.yashwanthvarmamuthineni.workers.dev/api/files/${file.id}?mode=preview`;
    }
    return file.url || '';
  };

  // Helper function to get original download URL
  const getDownloadUrl = (file: { id?: string; url?: string; name: string }) => {
    // Use Phase 1 dual-quality system when file.id is available
    if (file.id) {
      return `https://lytsite-backend.yashwanthvarmamuthineni.workers.dev/api/files/${file.id}?mode=download`;
    }
    return file.url || '';
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    const newIndex = direction === 'prev' 
      ? (selectedImage - 1 + files.length) % files.length
      : (selectedImage + 1) % files.length;
    
    setSelectedImage(newIndex);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateImage('prev');
    if (e.key === 'ArrowRight') navigateImage('next');
  };

  return (
    <section 
      className="py-8 sm:py-12 px-4 sm:px-6 pb-12 sm:pb-20"
      style={{ backgroundColor: theme.colors.backgroundSecondary }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile-optimized */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 sm:mb-12">
          <div className="mb-4 sm:mb-6 lg:mb-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.colors.surface }} />
                </div>
              </div>
              <Badge 
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium w-fit"
                style={{ 
                  backgroundColor: theme.colors.primaryLight,
                  color: theme.colors.primary 
                }}
              >
                {totalImages} Images
              </Badge>
            </div>
            <h2 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 px-1"
              style={{ color: theme.colors.textPrimary }}
            >
              {title}
            </h2>
            {metadata && (
              <div className="flex flex-wrap gap-4 text-sm">
                <span style={{ color: theme.colors.textSecondary }}>
                  Size: {metadata.size}
                </span>
                <span style={{ color: theme.colors.textSecondary }}>
                  Format: {metadata.format}
                </span>
                {metadata.dimensions && (
                  <span style={{ color: theme.colors.textSecondary }}>
                    Dimensions: {metadata.dimensions}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div 
              className="flex items-center rounded-xl p-1 shadow-md"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <Button
                variant={viewMode === 'masonry' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('masonry')}
                className="rounded-lg"
                style={viewMode === 'masonry' ? {
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.surface
                } : {}}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-lg"
                style={viewMode === 'grid' ? {
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.surface
                } : {}}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105"
              style={{ 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                color: theme.colors.textPrimary
              }}
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
              style={{ 
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                color: theme.colors.textPrimary
              }}
            >
              <Share2 className="w-4 h-4 mr-2" style={{ color: theme.colors.textSecondary }} />
              Share
            </Button>

            <Button
              size="sm"
              onClick={onDownload}
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.surface
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div 
          className={`gap-4 transition-all duration-500 ${
            viewMode === 'masonry' 
              ? 'columns-2 md:columns-3 lg:columns-4 xl:columns-5' 
              : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          }`}
        >
          {files.map((file, index) => (
            <div
              key={index}
              className={`cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 group ${
                viewMode === 'masonry' ? 'break-inside-avoid mb-4' : 'aspect-square'
              }`}
              onClick={() => openLightbox(index)}
              style={{ backgroundColor: theme.colors.surface }}
            >
              <div className="relative">
                <ImageWithFallback
                  src={getPreviewUrl(file)}
                  alt={`Image ${index + 1}`}
                  className={`w-full ${viewMode === 'grid' ? 'h-full object-cover' : 'h-auto'} transition-transform duration-300 group-hover:scale-110`}
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
                      style={{ backgroundColor: theme.colors.surface + '90' }}
                    >
                      <ZoomIn className="w-5 h-5" style={{ color: theme.colors.textPrimary }} />
                    </div>
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
                      style={{ backgroundColor: theme.colors.surface + '90' }}
                    >
                      <Maximize className="w-5 h-5" style={{ color: theme.colors.textPrimary }} />
                    </div>
                  </div>
                </div>

                {/* Image Number Badge */}
                <div 
                  className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm"
                  style={{ 
                    backgroundColor: theme.colors.overlay,
                    color: theme.colors.surface 
                  }}
                >
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button (if more images available) */}
        {totalImages > files.length && (
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="rounded-2xl px-8 py-4 shadow-lg transition-all duration-300 hover:scale-105"
              style={{ borderColor: theme.colors.border }}
            >
              Load {Math.min(20, totalImages - files.length)} More Images
            </Button>
          </div>
        )}

        {/* Lightbox */}
        {selectedImage !== null && (
          <div 
            className="fixed inset-0 z-50"
            style={{ backgroundColor: theme.colors.overlay }}
            onClick={closeLightbox}
            onKeyDown={handleKeyPress}
            tabIndex={0}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="fixed top-6 right-6 z-60 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm hover:scale-110 transition-transform duration-200"
              onClick={closeLightbox}
              style={{ backgroundColor: theme.colors.surface + '20' }}
            >
              <X className="w-6 h-6" style={{ color: theme.colors.surface }} />
            </Button>

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="sm"
              className="fixed left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm disabled:opacity-30 hover:scale-110 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              disabled={selectedImage === 0}
              style={{ backgroundColor: theme.colors.surface + '20' }}
            >
              <ChevronLeft className="w-6 h-6" style={{ color: theme.colors.surface }} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="fixed right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full shadow-lg backdrop-blur-sm disabled:opacity-30 hover:scale-110 transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              disabled={selectedImage === files.length - 1}
              style={{ backgroundColor: theme.colors.surface + '20' }}
            >
              <ChevronRight className="w-6 h-6" style={{ color: theme.colors.surface }} />
            </Button>

            {/* Centered Image Container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <img
                src={selectedImage !== null ? getPreviewUrl(files[selectedImage]) : ''}
                alt={`Image ${(selectedImage || 0) + 1}`}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Image Counter */}
            <div 
              className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl font-medium backdrop-blur-sm shadow-lg z-50"
              style={{ 
                backgroundColor: theme.colors.surface + '90',
                color: theme.colors.textPrimary 
              }}
            >
              {(selectedImage || 0) + 1} of {files.length}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
