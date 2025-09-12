import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { 
  useFileUrls,
  formatFileSize
} from "../../hooks/useDualQuality";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { 
  Download, 
  ZoomIn,
  X,
  Maximize,
  Share2,
  Heart,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface GridGalleryBlockProps {
  title: string;
  files: Array<{ id?: string; url?: string; name: string; type?: string; size?: number }>;
  onDownload?: () => void;
  metadata?: {
    size: string;
    format: string;
    dimensions?: string;
  };
}

export default function GridGalleryBlock({ 
  title, 
  files, 
  onDownload,
  metadata 
}: GridGalleryBlockProps) {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Phase 1 Dual-Quality System - Get optimized preview and original download URLs
  const fileUrls = useFileUrls(files);

  // Helper function to get optimized preview URL (WebP for images)
  const getPreviewUrl = (file: { id?: string; url?: string; name: string }) => {
    // Use Phase 1 dual-quality system when file.id is available
    if (file.id && fileUrls[file.id]) {
      return fileUrls[file.id].previewUrl;
    } else if (file.id) {
      // Direct URL construction for Phase 1
      return `https://lytsite-backend.yashwanthvarmamuthineni.workers.dev/api/files/${file.id}?mode=preview`;
    }
    return file.url || '';
  };

  // Helper function to get original download URL
  const getDownloadUrl = (file: { id?: string; url?: string; name: string }) => {
    // Use Phase 1 dual-quality system when file.id is available
    if (file.id && fileUrls[file.id]) {
      return fileUrls[file.id].downloadUrl;
    } else if (file.id) {
      // Direct URL construction for Phase 1
      return `https://lytsite-backend.yashwanthvarmamuthineni.workers.dev/api/files/${file.id}?mode=download`;
    }
    return file.url || '';
  };

  // Enhanced download handler using Phase 1 system
  const handleDownloadAll = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      // Download all files using Phase 1 dual-quality URLs
      const downloadPromises = files.map(async (file, index) => {
        try {
          const downloadUrl = getDownloadUrl(file);
          const response = await fetch(downloadUrl);
          
          if (response.ok) {
            const blob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }
        } catch (error) {
          console.error(`Failed to download ${file.name}:`, error);
        }
        
        // Update progress
        const progress = Math.round(((index + 1) / files.length) * 100);
        setDownloadProgress(progress);
      });

      await Promise.all(downloadPromises);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      if (onDownload) onDownload();
    }
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

  // Determine grid layout based on image count
  const getGridColumns = (count: number) => {
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2 lg:grid-cols-2';
    return 'grid-cols-2 md:grid-cols-3';
  };

  return (
    <section 
      className="py-12 px-6 pb-20"
      style={{ backgroundColor: theme.colors.backgroundSecondary }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <ImageIcon className="w-6 h-6" style={{ color: theme.colors.surface }} />
              </div>
              <Badge 
                className="px-3 py-1 text-sm font-medium"
                style={{ 
                  backgroundColor: theme.colors.primaryLight,
                  color: theme.colors.primary 
                }}
              >
                {files.length} Images • Grid Gallery
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

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
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
              onClick={handleDownloadAll}
              disabled={isDownloading}
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.surface
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? `Downloading... ${downloadProgress}%` : 'Download All'}
            </Button>
          </div>
        </div>

        {/* Grid Gallery */}
        <div className={`grid ${getGridColumns(files.length)} gap-6`}>
          {files.map((file, index) => (
            <div
              key={index}
              className="cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 group aspect-square"
              onClick={() => openLightbox(index)}
              style={{ backgroundColor: theme.colors.surface }}
            >
              <div className="relative h-full">
                <ImageWithFallback
                  src={getPreviewUrl(file)}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl"
                      style={{ backgroundColor: theme.colors.surface + '90' }}
                    >
                      <ZoomIn className="w-6 h-6" style={{ color: theme.colors.textPrimary }} />
                    </div>
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl"
                      style={{ backgroundColor: theme.colors.surface + '90' }}
                    >
                      <Maximize className="w-6 h-6" style={{ color: theme.colors.textPrimary }} />
                    </div>
                  </div>
                </div>

                {/* Image Number Badge */}
                <div 
                  className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm"
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
