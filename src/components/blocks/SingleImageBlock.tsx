import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { 
  Download, 
  Eye,
  ZoomIn,
  X,
  Maximize,
  Share2,
  Heart,
  Image as ImageIcon,
  Info
} from "lucide-react";

interface SingleImageBlockProps {
  title: string;
  image: string;
  caption?: string;
  credit?: string;
  onDownload?: () => void;
  metadata?: {
    size: string;
    format: string;
    dimensions?: string;
  };
}

export default function SingleImageBlock({ 
  title, 
  image, 
  caption,
  credit,
  onDownload,
  metadata 
}: SingleImageBlockProps) {
  const { theme } = useTheme();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const openLightbox = () => {
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
  };

  return (
    <section 
      className="py-12 px-6 pb-20"
      style={{ backgroundColor: theme.colors.backgroundSecondary }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
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
              Single Image
            </Badge>
          </div>
          
          <h2 
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: theme.colors.textPrimary }}
          >
            {title}
          </h2>
          
          {caption && (
            <p 
              className="text-lg mb-2 max-w-2xl mx-auto"
              style={{ color: theme.colors.textSecondary }}
            >
              {caption}
            </p>
          )}
          
          {credit && (
            <p 
              className="text-sm font-medium"
              style={{ color: theme.colors.textMuted }}
            >
              Credit: {credit}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4 mt-8">
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
              Download
            </Button>
          </div>
        </div>

        {/* Main Image */}
        <div className="relative max-w-4xl mx-auto">
          <div
            className="relative cursor-pointer overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.01] transition-all duration-500 group"
            onClick={openLightbox}
            style={{ backgroundColor: theme.colors.surface }}
          >
            <ImageWithFallback
              src={image}
              alt={title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl transform group-hover:scale-110 transition-all duration-300"
                  style={{ backgroundColor: theme.colors.surface + '90' }}
                >
                  <ZoomIn className="w-8 h-8" style={{ color: theme.colors.textPrimary }} />
                </div>
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl transform group-hover:scale-110 transition-all duration-300"
                  style={{ backgroundColor: theme.colors.surface + '90' }}
                >
                  <Maximize className="w-8 h-8" style={{ color: theme.colors.textPrimary }} />
                </div>
              </div>
            </div>
          </div>

          {/* Image Metadata */}
          {metadata && (
            <div 
              className="mt-6 p-4 rounded-2xl shadow-md"
              style={{ backgroundColor: theme.colors.surface }}
            >
              <div className="flex items-center space-x-2 mb-3">
                <Info className="w-5 h-5" style={{ color: theme.colors.primary }} />
                <span 
                  className="font-semibold text-sm"
                  style={{ color: theme.colors.textPrimary }}
                >
                  Image Details
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span 
                    className="font-medium"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    Size: 
                  </span>
                  <span 
                    className="ml-2"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {metadata.size}
                  </span>
                </div>
                <div>
                  <span 
                    className="font-medium"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    Format: 
                  </span>
                  <span 
                    className="ml-2"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {metadata.format}
                  </span>
                </div>
                {metadata.dimensions && (
                  <div>
                    <span 
                      className="font-medium"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      Dimensions: 
                    </span>
                    <span 
                      className="ml-2"
                      style={{ color: theme.colors.textPrimary }}
                    >
                      {metadata.dimensions}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Lightbox */}
        {isLightboxOpen && (
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

            {/* Centered Image Container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <img
                src={image}
                alt={title}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Caption in Lightbox */}
            {(caption || credit) && (
              <div 
                className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-md text-center px-6 py-4 rounded-2xl backdrop-blur-md shadow-lg"
                style={{ 
                  backgroundColor: theme.colors.surface + '90',
                  color: theme.colors.textPrimary 
                }}
              >
                {caption && (
                  <p className="font-medium mb-1">{caption}</p>
                )}
                {credit && (
                  <p 
                    className="text-sm"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    Credit: {credit}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
