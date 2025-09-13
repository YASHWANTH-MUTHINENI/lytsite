import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useEnhancedTheme } from '../../contexts/EnhancedThemeContext';
import { 
  Download, 
  Eye,
  FileText,
  Image,
  PlayCircle,
  Archive,
  Video,
  Play,
  Pause,
  Volume2,
  Maximize,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Grid,
  List
} from "lucide-react";

interface FileData {
  id: string;
  type: 'pdf' | 'image' | 'gallery' | 'video' | 'archive' | 'document';
  name: string;
  size: string;
  url: string;
  thumbnails?: string[];
  pages?: number;
  duration?: string;
  files?: { name: string; size: string; type: string; url?: string }[];
}

interface FileHandlingBlockProps {
  files: FileData[];
  onDownload?: (fileId: string) => void;
}

const FileTypeIcon = ({ type }: { type: string }) => {
  const icons = {
    pdf: <FileText className="w-6 h-6 text-red-600" />,
    document: <FileText className="w-6 h-6 text-blue-600" />,
    image: <Image className="w-6 h-6 text-green-600" />,
    gallery: <Grid className="w-6 h-6 text-purple-600" />,
    video: <Video className="w-6 h-6 text-orange-600" />,
    archive: <Archive className="w-6 h-6 text-gray-600" />
  };
  return icons[type as keyof typeof icons] || <FileText className="w-6 h-6" />;
};

// PDF/Document Viewer Component
const PDFViewer = ({ file }: { file: FileData }) => {
  const { theme } = useEnhancedTheme();
  const [currentPage, setCurrentPage] = useState(0);
  
  return (
    <Card 
      className="overflow-hidden"
      style={{ 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }}
    >
      <div 
        className="px-3 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0"
        style={{ backgroundColor: theme.colors.backgroundSecondary }}
      >
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="flex-shrink-0">
            <FileTypeIcon type={file.type} />
          </div>
          <span 
            className="text-sm font-medium truncate"
            style={{ color: theme.colors.textPrimary }}
          >
            {file.name}
          </span>
        </div>
        <Badge 
          variant="secondary" 
          className="self-start sm:self-auto text-xs"
          style={{ 
            backgroundColor: theme.colors.backgroundTertiary,
            color: theme.colors.textSecondary
          }}
        >
          PDF • {file.pages} pages
        </Badge>
      </div>
      
      <CardContent 
        className="p-0"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div 
          className="aspect-[3/4] sm:aspect-[4/3] relative"
          style={{ backgroundColor: theme.colors.background }}
        >
          {/* PDF Embed or iframe would go here */}
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: theme.colors.backgroundSecondary }}
          >
            <div className="text-center p-4">
              <FileText 
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4"
                style={{ color: theme.colors.textMuted }}
              />
              <p 
                className="mb-3 sm:mb-4 text-sm sm:text-base"
                style={{ color: theme.colors.textSecondary }}
              >
                PDF Viewer
              </p>
              <Button size="sm" className="text-xs sm:text-sm">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Open Full View
              </Button>
            </div>
          </div>
          
          {/* Page Navigation */}
          {file.pages && file.pages > 1 && (
            <div 
              className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 backdrop-blur rounded-full px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium shadow-lg"
              style={{ 
                backgroundColor: `${theme.colors.surface}CC`,
                color: theme.colors.textPrimary 
              }}
            >
              Page {currentPage + 1} of {file.pages}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Image Gallery Component
const ImageGallery = ({ file }: { file: FileData }) => {
  const { theme } = useEnhancedTheme();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid'); // Default to grid for better mobile experience
  
  const images = file.thumbnails || [];
  
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Gallery Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900">
          {file.name} ({images.length} images)
        </h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline ml-1">Grid</span>
          </Button>
          <Button 
            variant={viewMode === 'masonry' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('masonry')}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            <Image className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline ml-1">Masonry</span>
          </Button>
        </div>
      </div>

      {/* Image Grid */}
      <div className={`grid gap-2 sm:gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' 
          : 'columns-2 sm:columns-3 lg:columns-4'
      }`}>
        {images.map((src, index) => (
          <div
            key={index}
            className={`cursor-pointer overflow-hidden rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] ${
              viewMode === 'masonry' ? 'break-inside-avoid mb-2 sm:mb-4' : 'aspect-square'
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <ImageWithFallback
              src={src}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4"
            style={{ 
              color: 'white',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ 
              color: 'white',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
            disabled={selectedImage === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ 
              color: 'white',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
            disabled={selectedImage === images.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
          
          <img
            src={images[selectedImage]}
            alt={`Image ${selectedImage + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
          
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 backdrop-blur rounded-full px-4 py-2 text-sm font-medium"
            style={{ 
              backgroundColor: `${theme.colors.surface}CC`,
              color: theme.colors.textPrimary 
            }}
          >
            {selectedImage + 1} of {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

// Video Player Component
const VideoPlayer = ({ file }: { file: FileData }) => {
  const { theme } = useEnhancedTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-video bg-black relative group">
          {/* Video element would go here */}
          <div className="w-full h-full flex items-center justify-center">
            <Button 
              size="lg"
              className="rounded-full w-12 h-12 sm:w-16 sm:h-16"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4 sm:w-6 sm:h-6" /> : <Play className="w-4 h-4 sm:w-6 sm:h-6" />}
            </Button>
          </div>
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-white gap-2 sm:gap-0">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-xs sm:text-sm truncate">{file.name}</span>
                {file.duration && (
                  <Badge variant="secondary" className="bg-black/50 text-white border-0 text-xs flex-shrink-0">
                    {file.duration}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-3 sm:space-x-2 justify-end">
                <Volume2 className="w-4 h-4 sm:w-4 sm:h-4" />
                <Maximize className="w-4 h-4 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Archive Explorer Component
const ArchiveExplorer = ({ file }: { file: FileData }) => {
  const { theme } = useEnhancedTheme();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const toggleExpand = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };
  
  return (
    <Card>
      <div className="px-4 py-3 border-b" style={{ backgroundColor: theme.colors.backgroundSecondary, borderBottomColor: theme.colors.border }}>
        <div className="flex items-center space-x-3">
          <Archive className="w-5 h-5" style={{ color: theme.colors.textSecondary }} />
          <span className="font-medium" style={{ color: theme.colors.textPrimary }}>{file.name}</span>
          <Badge variant="secondary">{file.files?.length || 0} files</Badge>
        </div>
      </div>
      
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {file.files?.map((archiveFile, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              style={{ 
                borderBottom: `1px solid ${theme.colors.border}`,
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => archiveFile.url && window.open(archiveFile.url)}
            >
              <div className="flex items-center space-x-3">
                <FileTypeIcon type={archiveFile.type} />
                <div>
                  <div className="font-medium" style={{ color: theme.colors.textPrimary }}>{archiveFile.name}</div>
                  <div className="text-sm" style={{ color: theme.colors.textMuted }}>{archiveFile.size}</div>
                </div>
              </div>
              {archiveFile.url && (
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function FileHandlingBlock({ files, onDownload }: FileHandlingBlockProps) {
  const { theme } = useEnhancedTheme();
  const handleDownload = (fileId: string) => {
    onDownload?.(fileId);
    // Track download
    console.log(`Download tracked for file: ${fileId}`);
  };

  return (
    <section className="py-6 sm:py-12 px-3 sm:px-4" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-6xl mx-auto">
        {files.map((file) => (
          <div key={file.id} className="mb-8 sm:mb-12 last:mb-0">
            {/* File Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="flex-shrink-0">
                  <FileTypeIcon type={file.type} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold truncate" style={{ color: theme.colors.textPrimary }}>{file.name}</h2>
                  <p className="text-sm sm:text-base" style={{ color: theme.colors.textMuted }}>{file.size}</p>
                </div>
              </div>
              
              <Button 
                onClick={() => handleDownload(file.id)}
                size="sm"
                className="self-start sm:self-auto"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Download</span>
              </Button>
            </div>

            {/* File Content Renderer */}
            <div className="file-content">
              {(file.type === 'pdf' || file.type === 'document') && (
                <PDFViewer file={file} />
              )}
              
              {(file.type === 'image' || file.type === 'gallery') && (
                <ImageGallery file={file} />
              )}
              
              {file.type === 'video' && (
                <VideoPlayer file={file} />
              )}
              
              {file.type === 'archive' && (
                <ArchiveExplorer file={file} />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
