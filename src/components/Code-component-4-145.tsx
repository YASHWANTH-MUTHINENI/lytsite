import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Eye,
  Heart,
  MessageCircle,
  ExternalLink,
  FileText,
  Image,
  PlayCircle,
  Archive,
  Calendar,
  User,
  Globe,
  Zap,
  TrendingUp,
  Clock
} from "lucide-react";

interface UniversalFileTemplateProps {
  onNavigate: (page: string) => void;
}

// This would be auto-populated from file upload and minimal user inputs
const mockData = {
  title: "Q4 Business Review 2024", // User input 1
  description: "Comprehensive quarterly performance analysis and strategic outlook for 2025", // User input 2
  author: "Sarah Chen", // User input 3 (optional - can be auto-filled)
  company: "TechCorp Inc.", // Auto-extracted or optional
  uploadDate: "2024-12-15",
  fileType: "pdf", // Auto-detected
  fileSize: "2.4 MB", // Auto-detected
  totalPages: 24, // Auto-extracted from PDF
  estimatedReadTime: "8 min read", // Auto-calculated
  
  // Analytics - all auto-tracked
  views: 127,
  downloads: 23,
  likes: 8,
  shares: 5,
  
  // File content - auto-extracted
  thumbnails: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?w=400&h=300&fit=crop"
  ],
  
  // Smart defaults - no user input needed
  tags: ["Business", "Quarterly Review", "Analytics"], // Auto-generated from content
  category: "Business Report" // Auto-detected
};

// File type configurations
const getFileTypeConfig = (type: string) => {
  const configs = {
    pdf: {
      icon: <FileText className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: "PDF Document",
      viewerText: "View PDF"
    },
    doc: {
      icon: <FileText className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      label: "Document",
      viewerText: "View as Slides"
    },
    ppt: {
      icon: <PlayCircle className="w-6 h-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      label: "Presentation",
      viewerText: "View Slideshow"
    },
    img: {
      icon: <Image className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      label: "Image Gallery",
      viewerText: "View Gallery"
    },
    zip: {
      icon: <Archive className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      label: "Archive",
      viewerText: "Browse Files"
    }
  };
  return configs[type as keyof typeof configs] || configs.pdf;
};

export default function UniversalFileTemplate({ onNavigate }: UniversalFileTemplateProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [currentThumbnail, setCurrentThumbnail] = useState(0);
  
  const fileConfig = getFileTypeConfig(mockData.fileType);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Track like action
  };

  const handleDownload = () => {
    // Track download action
    console.log("Download tracked");
  };

  const handleShare = () => {
    // Track share action
    console.log("Share tracked");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('homepage')}
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lytsite
              </Button>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${fileConfig.bgColor} ${fileConfig.color}`}>
                  {fileConfig.icon}
                </div>
                <div>
                  <h1 className="font-semibold text-slate-900">{mockData.title}</h1>
                  <p className="text-sm text-slate-600">{fileConfig.label}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                <Eye className="w-3 h-3 mr-1" />
                {mockData.views} views
              </Badge>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* File Preview Section */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Main Preview */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {/* File Viewer */}
                  <div className="aspect-[4/3] bg-slate-100 relative">
                    <ImageWithFallback
                      src={mockData.thumbnails[currentThumbnail]}
                      alt={`${mockData.title} - Page ${currentThumbnail + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center group hover:bg-black/20 transition-colors cursor-pointer">
                      <Button size="lg" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {fileConfig.icon}
                        <span className="ml-2">{fileConfig.viewerText}</span>
                      </Button>
                    </div>
                    
                    {/* Page indicator */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      Page {currentThumbnail + 1} of {mockData.totalPages}
                    </div>
                  </div>
                  
                  {/* Thumbnail navigation */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2 overflow-x-auto">
                      {mockData.thumbnails.map((thumb, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentThumbnail(index)}
                          className={`flex-shrink-0 w-16 h-12 rounded border-2 overflow-hidden transition-colors ${
                            currentThumbnail === index 
                              ? 'border-primary' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <ImageWithFallback
                            src={thumb}
                            alt={`Page ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* File Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">File Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Size</span>
                      <span className="font-medium">{mockData.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pages</span>
                      <span className="font-medium">{mockData.totalPages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Read time</span>
                      <span className="font-medium">{mockData.estimatedReadTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Uploaded</span>
                      <span className="font-medium">Dec 15, 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download ({mockData.fileSize})
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Link
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className={`w-full ${isLiked ? 'text-red-600 border-red-200' : ''}`}
                      onClick={handleLike}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-600' : ''}`} />
                      {isLiked ? 'Liked' : 'Like'} ({mockData.likes})
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analytics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-slate-600">Views</span>
                      </div>
                      <span className="font-semibold">{mockData.views}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Download className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-slate-600">Downloads</span>
                      </div>
                      <span className="font-semibold">{mockData.downloads}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-slate-600">Likes</span>
                      </div>
                      <span className="font-semibold">{mockData.likes}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Share2 className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-slate-600">Shares</span>
                      </div>
                      <span className="font-semibold">{mockData.shares}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Content Description */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{mockData.author}</h3>
                    <p className="text-slate-600">{mockData.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    Dec 15, 2024
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {mockData.estimatedReadTime}
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{mockData.title}</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                {mockData.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {mockData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-slate-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <ExternalLink className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Open in Viewer</h3>
                    <p className="text-slate-600">Full-screen reading experience</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Request Access</h3>
                    <p className="text-slate-600">Get in touch with the author</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            Shared with{" "}
            <span 
              className="text-primary font-medium cursor-pointer hover:underline"
              onClick={() => onNavigate('homepage')}
            >
              Lytsite
            </span>
            {" "}• Professional file sharing made simple
          </p>
        </div>
      </footer>
    </div>
  );
}