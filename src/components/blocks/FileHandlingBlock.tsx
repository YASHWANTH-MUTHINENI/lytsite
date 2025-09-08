import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
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
  const [currentPage, setCurrentPage] = useState(0);
  
  return (
    <Card className="overflow-hidden">
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileTypeIcon type={file.type} />
          <span className="text-white text-sm font-medium">{file.name}</span>
        </div>
        <Badge variant="secondary" className="bg-slate-700 text-slate-300">
          PDF • {file.pages} pages
        </Badge>
      </div>
      
      <CardContent className="p-0">
        <div className="aspect-[3/4] bg-white relative">
          {/* PDF Embed or iframe would go here */}
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <div className="text-center">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">PDF Viewer</p>
              <Button size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Open Full View
              </Button>
            </div>
          </div>
          
          {/* Page Navigation */}
          {file.pages && file.pages > 1 && (
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-full px-4 py-2 text-sm font-medium shadow-lg">
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
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  
  const images = file.thumbnails || [];
  
  return (
    <div className="space-y-4">
      {/* Gallery Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {file.name} ({images.length} images)
        </h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button 
            variant={viewMode === 'masonry' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('masonry')}
          >
            <Image className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image Grid */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
          : 'columns-2 md:columns-3 lg:columns-4'
      }`}>
        {images.map((src, index) => (
          <div
            key={index}
            className={`cursor-pointer overflow-hidden rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] ${
              viewMode === 'masonry' ? 'break-inside-avoid mb-4' : 'aspect-square'
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
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
            disabled={selectedImage === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
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
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur rounded-full px-4 py-2 text-sm font-medium">
            {selectedImage + 1} of {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

// Video Player Component
const VideoPlayer = ({ file }: { file: FileData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-video bg-black relative group">
          {/* Video element would go here */}
          <div className="w-full h-full flex items-center justify-center">
            <Button 
              size="lg"
              className="rounded-full w-16 h-16"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
          </div>
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{file.name}</span>
                {file.duration && (
                  <Badge variant="secondary" className="bg-black/50 text-white border-0">
                    {file.duration}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4" />
                <Maximize className="w-4 h-4" />
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
      <div className="bg-slate-100 px-4 py-3 border-b">
        <div className="flex items-center space-x-3">
          <Archive className="w-5 h-5 text-slate-600" />
          <span className="font-medium">{file.name}</span>
          <Badge variant="secondary">{file.files?.length || 0} files</Badge>
        </div>
      </div>
      
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {file.files?.map((archiveFile, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
              onClick={() => archiveFile.url && window.open(archiveFile.url)}
            >
              <div className="flex items-center space-x-3">
                <FileTypeIcon type={archiveFile.type} />
                <div>
                  <div className="font-medium text-slate-900">{archiveFile.name}</div>
                  <div className="text-sm text-slate-500">{archiveFile.size}</div>
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
  const handleDownload = (fileId: string) => {
    onDownload?.(fileId);
    // Track download
    console.log(`Download tracked for file: ${fileId}`);
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {files.map((file) => (
          <div key={file.id} className="mb-12 last:mb-0">
            {/* File Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FileTypeIcon type={file.type} />
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{file.name}</h2>
                  <p className="text-slate-600">{file.size}</p>
                </div>
              </div>
              
              <Button onClick={() => handleDownload(file.id)}>
                <Download className="w-4 h-4 mr-2" />
                Download
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
