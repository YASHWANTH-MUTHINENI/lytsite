import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useFileUrls } from "../../hooks/useDualQuality";
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
  ChevronRight,
  Grid,
  List,
  Search
} from "lucide-react";

interface LightboxGalleryBlockProps {
  title: string;
  files: Array<{ id?: string; url?: string; name: string }>;
  totalImages?: number;
  onDownload?: () => void;
  metadata?: {
    size: string;
    format: string;
    dimensions?: string;
  };
}

export default function LightboxGalleryBlock({ 
  title, 
  files, 
  totalImages = files.length,
  onDownload,
  metadata 
}: LightboxGalleryBlockProps) {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [visibleImages, setVisibleImages] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const galleryRef = useRef<HTMLDivElement>(null);

  // Helper function to get image URL for display
  const getImageUrl = (file: { id?: string; url?: string; name: string }) => {
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

  const loadMoreImages = () => {
    setVisibleImages(prev => Math.min(prev + 20, files.length));
  };

  const filteredImages = files.filter((file, index) => 
    index.toString().includes(searchTerm) || 
    `Image ${index + 1}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedImages = filteredImages.slice(0, visibleImages);

  // Lazy loading observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && visibleImages < files.length) {
            loadMoreImages();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => observer.disconnect();
  }, [visibleImages, files.length]);

  return (
    <section 
      className="py-12 px-6 pb-20"
      style={{ backgroundColor: theme.colors.backgroundSecondary }}
    >
      <div className="max-w-7xl mx-auto">
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
                {totalImages} Images • Lightbox Gallery
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

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
                style={{ color: theme.colors.textSecondary }} 
              />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border text-sm w-full sm:w-48"
                style={{ 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textPrimary
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
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
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div 
            className="px-4 py-2 rounded-xl text-sm"
            style={{ backgroundColor: theme.colors.surface }}
          >
            <span style={{ color: theme.colors.textSecondary }}>Showing: </span>
            <span 
              className="font-semibold"
              style={{ color: theme.colors.textPrimary }}
            >
              {displayedImages.length} of {filteredImages.length}
            </span>
          </div>
          {searchTerm && (
            <div 
              className="px-4 py-2 rounded-xl text-sm"
              style={{ backgroundColor: theme.colors.primaryLight }}
            >
              <span style={{ color: theme.colors.primary }}>Search results for: "{searchTerm}"</span>
            </div>
          )}
        </div>

        {/* Compact Thumbnail Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {displayedImages.map((file, index) => (
            <div
              key={index}
              className="cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 group aspect-square"
              onClick={() => openLightbox(index)}
              style={{ backgroundColor: theme.colors.surface }}
            >
              <div className="relative h-full">
                <ImageWithFallback
                  src={getImageUrl(file)}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white drop-shadow-lg" />
                </div>

                {/* Image Number */}
                <div 
                  className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-xs font-bold backdrop-blur-sm"
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

        {/* Load More Button */}
        {visibleImages < filteredImages.length && (
          <div className="text-center mt-12" ref={galleryRef}>
            <Button
              size="lg"
              variant="outline"
              onClick={loadMoreImages}
              className="rounded-2xl px-8 py-4 shadow-lg transition-all duration-300 hover:scale-105"
              style={{ borderColor: theme.colors.border }}
            >
              Load {Math.min(20, filteredImages.length - visibleImages)} More Images
            </Button>
          </div>
        )}

        {/* No Results */}
        {searchTerm && filteredImages.length === 0 && (
          <div className="text-center py-12">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: theme.colors.backgroundTertiary }}
            >
              <Search className="w-8 h-8" style={{ color: theme.colors.textSecondary }} />
            </div>
            <p 
              className="text-lg mb-2"
              style={{ color: theme.colors.textPrimary }}
            >
              No images found
            </p>
            <p style={{ color: theme.colors.textSecondary }}>
              Try searching with different keywords
            </p>
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
                src={selectedImage !== null ? getImageUrl(files[selectedImage]) : ''}
                alt={`Image ${(selectedImage || 0) + 1}`}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Image Info */}
            <div 
              className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl font-medium backdrop-blur-md shadow-xl text-center z-50"
              style={{ 
                backgroundColor: theme.colors.surface + '90',
                color: theme.colors.textPrimary 
              }}
            >
              <div className="font-semibold">
                {(selectedImage || 0) + 1} of {files.length}
              </div>
              <div 
                className="text-sm mt-1"
                style={{ color: theme.colors.textSecondary }}
              >
                Use ← → keys to navigate
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
