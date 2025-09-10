import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  Download, 
  Presentation, 
  Monitor,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Play,
  Pause,
  RotateCcw,
  Grid,
  FileText,
  ExternalLink,
  AlertCircle
} from "lucide-react";

interface FileData {
  name: string;
  size: string;
  type: string;
  url?: string;
  thumbnailUrl?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  description?: string;
}

interface PresentationBlockProps {
  title: string;
  content?: string;
  onDownload?: () => void;
  files?: FileData[];
  metadata?: {
    size?: string;
    format?: string;
    slides?: number;
    theme?: string;
    modified?: string;
    icon?: string;
    slideImages?: string[]; // Array of slide image URLs
    pdfUrl?: string; // PDF conversion of the presentation
    embedUrl?: string; // Office 365 embed URL
  };
}

const PresentationBlock: React.FC<PresentationBlockProps> = ({
  title,
  content,
  onDownload,
  files = [],
  metadata
}) => {
  
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'thumbnails' | 'embed'>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const totalSlides = metadata?.slides || 12;
  const presentationFile: FileData | undefined = files && files.length > 0 ? files[0] : undefined;
  
  // Real slide data - either from metadata or generated
  const slideImages = metadata?.slideImages || [];
  const hasThumbnails = slideImages.length > 0;
  const embedUrl = metadata?.embedUrl;
  const pdfUrl = metadata?.pdfUrl;
  
  // Auto-detect presentation conversion URLs
  useEffect(() => {
    // For now, just set loading to false
    // In real implementation, this would check for converted files
    setIsLoading(false);
  }, [presentationFile]);
  
  // Generate slide data - only use real slide data, no mock/demo slides
  const generateSlideData = () => {
    // Only create slides if we have real slide images from backend processing
    if (!slideImages || slideImages.length === 0) {
      return []; // Return empty array instead of mock slides
    }
    
    return slideImages.map((slideImageUrl, i) => {
      const slideNumber = i + 1;
      return {
        id: slideNumber,
        title: `Slide ${slideNumber}`,
        imageUrl: slideImageUrl,
        thumbnailUrl: slideImageUrl,
        hasRealImage: true
      };
    });
  };
  
  const slides = generateSlideData();
  const hasValidSlides = slides.length > 0;
  
  const nextSlide = () => {
    setCurrentSlide(prev => (prev < totalSlides ? prev + 1 : 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide(prev => (prev > 1 ? prev - 1 : totalSlides));
  };
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  const goToSlide = (slideNumber: number) => {
    setCurrentSlide(slideNumber);
    if (viewMode === 'thumbnails') {
      setViewMode('preview');
    }
  };
  return (
    <div className={`w-full mx-auto px-4 py-8 ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'max-w-6xl'}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full">
            {metadata?.icon ? (
              <span className="text-3xl">{metadata.icon}</span>
            ) : (
              <Presentation className="w-8 h-8 text-purple-600" />
            )}
          </div>
        </div>
        <h1 className={`font-bold mb-2 ${isFullscreen ? 'text-white text-2xl' : 'text-3xl text-gray-900'}`}>
          {title}
        </h1>
        {content && !isFullscreen && (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{content}</p>
        )}
        
        {/* Status indicator for processing state */}
        {!isFullscreen && !hasValidSlides && (
          <div className="mt-4 flex justify-center">
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <AlertCircle className="w-3 h-3 mr-1" />
              Processing Required - File will be converted after upload
            </Badge>
          </div>
        )}
        
        {!isFullscreen && hasValidSlides && (
          <div className="mt-4 flex justify-center">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Monitor className="w-3 h-3 mr-1" />
              Live Mode - {slides.length} real slides processed
            </Badge>
          </div>
        )}
      </div>

      {/* Main Presentation Viewer */}
      <div className="mb-6">
        {viewMode === 'preview' && (
          <Card className={`shadow-lg border-0 ${isFullscreen ? 'bg-gray-900 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-0">
              <div className="relative">
                {/* Main Slide Display */}
                <div className={`relative ${isFullscreen ? 'h-96' : 'h-80'} bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg flex items-center justify-center`}>
                  {hasValidSlides ? (
                    /* Real slide content */
                    <div className="w-full h-full bg-white m-4 rounded shadow-sm flex items-center justify-center relative overflow-hidden">
                      {slides[currentSlide - 1]?.hasRealImage && slides[currentSlide - 1]?.imageUrl ? (
                        /* Real slide image */
                        <div className="w-full h-full relative">
                          <img
                            src={slides[currentSlide - 1].imageUrl!}
                            alt={`Slide ${currentSlide}`}
                            className="w-full h-full object-contain"
                            onError={() => {
                              setImageError(prev => ({...prev, [currentSlide]: true}));
                              console.warn(`Failed to load slide image: ${slides[currentSlide - 1].imageUrl}`);
                            }}
                            onLoad={() => setImageError(prev => ({...prev, [currentSlide]: false}))}
                          />
                          {imageError[currentSlide] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                              <div className="text-center">
                                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                                <p className="text-red-600 text-sm font-medium">Failed to load slide image</p>
                                <p className="text-gray-500 text-xs mt-1">Using fallback content</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Fallback for slides without images */
                        <div className="text-center p-8">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Presentation className="w-8 h-8 text-purple-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Slide {currentSlide}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Slide image could not be loaded
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* No slides available - show processing message */
                    <div className="w-full h-full bg-white m-4 rounded shadow-sm flex items-center justify-center">
                      <div className="text-center p-8 max-w-md">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          PowerPoint Preview Not Available
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          This PowerPoint file needs to be uploaded and processed by our AWS service to generate slide previews.
                        </p>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
                          <div className="flex items-center mb-2">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span className="font-medium">After upload:</span>
                          </div>
                          <ul className="text-left space-y-1 text-xs">
                            <li>• PPTX will be converted to PDF</li>
                            <li>• Slide thumbnails will be generated</li>
                            <li>• Interactive preview will be available</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                    
                    {/* Slide number indicator */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {currentSlide} / {totalSlides}
                    </div>
                  </div>
                  
                  {/* Navigation overlays */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Controls Bar */}
                <div className={`flex items-center justify-between px-4 py-3 border-t ${isFullscreen ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={togglePlayback}
                      className={isFullscreen ? 'text-white hover:bg-gray-700' : ''}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCurrentSlide(1)}
                      className={isFullscreen ? 'text-white hover:bg-gray-700' : ''}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <span className={`text-sm ${isFullscreen ? 'text-gray-300' : 'text-gray-600'}`}>
                      Slide {currentSlide} of {totalSlides}
                      {hasThumbnails && (
                        <span className="ml-2 text-green-600">• Live</span>
                      )}
                      {!hasThumbnails && (
                        <span className="ml-2 text-blue-600">• Demo</span>
                      )}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-purple-600 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setViewMode('thumbnails')}
                      className={isFullscreen ? 'text-white hover:bg-gray-700' : ''}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className={isFullscreen ? 'text-white hover:bg-gray-700' : ''}
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Office 365 Embed View */}
        {viewMode === 'embed' && embedUrl && (
          <Card className="shadow-lg border-0">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold">PowerPoint Online Viewer</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setViewMode('preview')}
                >
                  Back to Preview
                </Button>
              </div>
              <div className="relative">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  allowFullScreen
                  title="PowerPoint Presentation"
                  className="rounded-b-lg"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(embedUrl, '_blank')}
                    className="bg-white/90 hover:bg-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Thumbnail Grid View */}
        {viewMode === 'thumbnails' && (
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">All Slides</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setViewMode('preview')}
                >
                  Back to Presentation
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {slides.map((slide) => (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(slide.id)}
                    className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                      currentSlide === slide.id
                        ? 'border-purple-500 ring-2 ring-purple-200'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                      {slide.hasRealImage ? (
                        <img
                          src={slide.thumbnailUrl}
                          alt={`Slide ${slide.id} thumbnail`}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(prev => ({...prev, [`thumb_${slide.id}`]: true}))}
                        />
                      ) : (
                        <div className="text-center">
                          <Presentation className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <span className="text-xs text-gray-500">{slide.id}</span>
                        </div>
                      )}
                      {imageError[`thumb_${slide.id}`] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <div className="text-center">
                            <Presentation className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-500">{slide.id}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    {/* Slide number overlay */}
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                      {slide.id}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons and Info */}
      {!isFullscreen && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Actions Card */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={onDownload}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Presentation
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={() => setViewMode('thumbnails')}
                >
                  <Grid className="w-5 h-5 mr-2" />
                  View All Slides
                </Button>
                {embedUrl && (
                  <Button
                    variant="outline"
                    className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                    onClick={() => setViewMode('embed')}
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View in Office Online
                  </Button>
                )}
                {pdfUrl && (
                  <Button
                    variant="outline"
                    className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                    onClick={() => window.open(pdfUrl, '_blank')}
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    View as PDF
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={() => setIsFullscreen(true)}
                >
                  <Maximize className="w-5 h-5 mr-2" />
                  Full Screen Mode
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Presentation Details</h3>
              <div className="space-y-3">
                {metadata?.format && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Format:</span>
                    <Badge variant="secondary">{metadata.format}</Badge>
                  </div>
                )}
                {metadata?.size && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">File Size:</span>
                    <Badge variant="secondary">{metadata.size}</Badge>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Slides:</span>
                  <Badge variant="secondary">{totalSlides} slides</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Preview:</span>
                  <Badge variant={hasThumbnails ? "default" : "secondary"}>
                    {hasThumbnails ? "Images Available" : "Download Required"}
                  </Badge>
                </div>
                {embedUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Online View:</span>
                    <Badge variant="default">Available</Badge>
                  </div>
                )}
                {pdfUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">PDF Version:</span>
                    <Badge variant="default">Available</Badge>
                  </div>
                )}
                {metadata?.theme && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Theme:</span>
                    <Badge variant="secondary">{metadata.theme}</Badge>
                  </div>
                )}
                {metadata?.modified && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Modified:</span>
                    <Badge variant="secondary">
                      {new Date(metadata.modified).toLocaleDateString()}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fullscreen Exit Button */}
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-10">
          <Button
            onClick={() => setIsFullscreen(false)}
            variant="outline"
            className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
          >
            Exit Fullscreen
          </Button>
        </div>
      )}
    </div>
  );
};

export default PresentationBlock;
