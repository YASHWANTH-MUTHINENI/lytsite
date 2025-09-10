import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import QRCode from 'qrcode';
import UniversalFileTemplate from "./universal-file-template";
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  PlayCircle, 
  Archive,
  CheckCircle,
  ArrowRight,
  Zap,
  Sparkles,
  User,
  Calendar,
  Presentation,
  ChevronLeft,
  FileIcon,
  FileVideoIcon,
  FileArchiveIcon,
  FileCodeIcon,
  FileAudioIcon,
  Video,
  ExternalLink,
  Copy,
  Eye,
  Shield,
  Clock,
  QrCode
} from "lucide-react";

interface MinimalUploadModalProps {
  onSuccess: (templateId: string) => void;
}

interface UploadResult {
  success: boolean;
  slug?: string;
  url?: string;
  error?: string;
}

// Backend API configuration
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev' 
  : 'https://lytsite-backend.yashwanthvarmamuthineni.workers.dev'; // Use same URL for both dev and prod

// Enhanced file type icons with more comprehensive support
const getFileIcon = (fileName: string, mimeType?: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Image files
  if (mimeType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
    return <Image className="w-8 h-8 text-green-500" />;
  }
  
  // Video files
  if (mimeType?.startsWith('video/') || ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv'].includes(extension)) {
    return <Video className="w-8 h-8 text-blue-500" />;
  }
  
  // Audio files
  if (mimeType?.startsWith('audio/') || ['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(extension)) {
    return <FileAudioIcon className="w-8 h-8 text-purple-500" />;
  }
  
  // Document files
  if (['pdf'].includes(extension)) {
    return <FileText className="w-8 h-8 text-red-500" />;
  }
  
  if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
    return <FileText className="w-8 h-8 text-blue-500" />;
  }
  
  if (['ppt', 'pptx'].includes(extension)) {
    return <PlayCircle className="w-8 h-8 text-orange-500" />;
  }
  
  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return <FileArchiveIcon className="w-8 h-8 text-purple-500" />;
  }
  
  // Code files
  if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'py', 'java', 'cpp', 'c', 'php'].includes(extension)) {
    return <FileCodeIcon className="w-8 h-8 text-green-600" />;
  }
  
  // Default file icon
  return <FileIcon className="w-8 h-8 text-slate-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Transform user data for UniversalFileTemplate
const getTemplateData = (formData: any, uploadedFiles: File[]) => {
  return {
    title: formData.title || "My Files",
    subLine: formData.description || "File delivery",
    tagLine: formData.authorName ? `By ${formData.authorName}` : "Shared with Lytsite",
    heroImage: null, // We can add hero image upload later
    files: uploadedFiles.map((file, index) => {
      // Create proper blob with explicit MIME type for PDFs
      let fileUrl;
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const pdfBlob = new Blob([file], { type: 'application/pdf' });
        fileUrl = URL.createObjectURL(pdfBlob);
      } else {
        fileUrl = URL.createObjectURL(file);
      }
      
      return {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        url: fileUrl, // Properly typed blob URL
        thumbnailUrl: undefined, // Changed from null to undefined
        uploadedAt: new Date().toISOString().split('T')[0],
        uploadedBy: formData.authorName || "Anonymous",
        description: `${file.name} - ${formatFileSize(file.size)}`
      };
    }),
    contactInfo: {
      email: "",
      website: "",
      linkedin: ""
    }
  };
};

export default function MinimalUploadModal({ onSuccess }: MinimalUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [step, setStep] = useState<'upload' | 'template' | 'details' | 'preview' | 'success'>('upload');
  const [selectedTemplate, setSelectedTemplate] = useState('universal');
  const [showFilesModal, setShowFilesModal] = useState(false);
  
  // Minimal form data - only 2-3 inputs required
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    authorName: '' // Optional - can be auto-filled from user profile
  });
  
  // Additional state for Cloudflare integration
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [projectSlug, setProjectSlug] = useState<string>('');
  
  // Password and expiry state
  const [password, setPassword] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  
  // Destructure form data for easier access
  const { title, description, authorName } = formData;

  const templates = [
    { 
      id: 'universal', 
      name: 'Universal Template', 
      description: 'Works with any file type - recommended for most users',
      icon: <FileText className="w-5 h-5" />,
      color: 'ocean',
      recommended: true
    },
    { 
      id: 'client-delivery', 
      name: 'Client Delivery', 
      description: 'Professional file delivery with project details',
      icon: <FileText className="w-5 h-5" />,
      color: 'blue'
    },
    { 
      id: 'photo-gallery', 
      name: 'Photo Gallery', 
      description: 'Beautiful image galleries with lightbox viewing',
      icon: <Image className="w-5 h-5" />,
      color: 'emerald'
    },
    { 
      id: 'portfolio-resume', 
      name: 'Portfolio Resume', 
      description: 'Personal brand showcase and professional portfolio',
      icon: <User className="w-5 h-5" />,
      color: 'purple'
    },
    { 
      id: 'event-template', 
      name: 'Event', 
      description: 'Event pages with schedules and registration',
      icon: <Calendar className="w-5 h-5" />,
      color: 'orange'
    },
    { 
      id: 'pitch-template', 
      name: 'Pitch Deck', 
      description: 'Investment and business presentations',
      icon: <Presentation className="w-5 h-5" />,
      color: 'red'
    }
  ];

  // Lock body scroll when preview is open
  React.useEffect(() => {
    if (step === 'preview') {
      document.body.style.overflow = 'hidden';
      
      // Add ESC key listener
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setStep('details');
        }
      };
      
      document.addEventListener('keydown', handleEscKey);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscKey);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [step]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleFileSelect = (files: File | File[]) => {
    const fileArray = Array.isArray(files) ? files : [files];
    setUploadedFiles(prev => [...prev, ...fileArray]);
    
    // Auto-populate title from first file (smart default)
    if (fileArray.length > 0 && !formData.title) {
      const firstFile = fileArray[0];
      const nameWithoutExtension = firstFile.name.replace(/\.[^/.]+$/, "");
      const smartTitle = nameWithoutExtension
        .replace(/[-_]/g, ' ')
        .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      
      setFormData(prev => ({
        ...prev,
        title: smartTitle
      }));
    }
    
    setStep('template');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(Array.from(files) as File[]);
    }
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData with files and metadata
      const formData = new FormData();
      
      uploadedFiles.forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('title', title);
      formData.append('description', description);
      formData.append('template', selectedTemplate);
      formData.append('authorName', authorName);
      
      // Add password and expiry if set
      if (password) {
        formData.append('password', password);
      }
      if (expiryDate) {
        formData.append('expiryDate', expiryDate);
      }
      
      // Upload progress simulation (real progress tracking would require chunked uploads)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 15, 90));
      }, 300);
      
      // Make upload request to Cloudflare Worker
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const result: UploadResult = await response.json();
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (result.success && result.url) {
        // Store the generated URL for success step
        setGeneratedUrl(result.url);
        setProjectSlug(result.slug || '');
        
        // Generate QR code
        try {
          const qrDataUrl = await QRCode.toDataURL(result.url, {
            width: 256,
            margin: 2,
            color: {
              dark: '#1f2937',
              light: '#ffffff',
            },
          });
          setQrCodeDataUrl(qrDataUrl);
        } catch (qrError) {
          console.error('QR code generation failed:', qrError);
        }
        
        setStep('success');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleComplete = () => {
    if (generatedUrl) {
      // Open generated Lytsite in new tab
      window.open(generatedUrl, '_blank');
    }
    
    const templateRoute = getTemplateRoute(selectedTemplate);
    onSuccess(templateRoute);
  };

  const getTemplateRoute = (templateId: string) => {
    if (templateId === 'universal') return 'universal-file-template';
    return templateId;
  };

  const resetModal = () => {
    setUploadedFiles([]);
    setStep('upload');
    setSelectedTemplate('universal');
    setFormData({ title: '', description: '', authorName: '' });
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <>
      {/* Debug log */}
      {step === 'preview' && console.log('Rendering preview step')}
      
      {/* Preview Modal - Rendered as Portal */}
      {step === 'preview' && createPortal(
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] overflow-hidden"
          style={{ touchAction: 'none' }}
          onClick={(e) => {
            // Close on backdrop click (only if clicking the backdrop, not the content)
            if (e.target === e.currentTarget) {
              setStep('details');
            }
          }}
        >
          <div className="h-full w-full flex flex-col">
            <div 
              className="bg-white w-full h-full flex flex-col"
              style={{ touchAction: 'auto' }}
            >
              {/* Browser-like Header */}
              <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 bg-gray-100 border-b flex-shrink-0">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="flex space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded-md px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-600 border min-w-0 truncate">
                    <span className="text-gray-400">🔒</span> lytsite.com/preview
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('details')}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-gray-200 flex-shrink-0 ml-2"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>

              {/* Preview Content - Full Viewport */}
              <div 
                className="flex-1 bg-white overflow-y-auto"
                style={{ 
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <UniversalFileTemplate 
                  data={getTemplateData(formData, uploadedFiles)}
                  onNavigate={() => {}}
                />
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-6 py-3 sm:py-4 bg-white border-t border-gray-200 flex-shrink-0 gap-3 sm:gap-0">
                <div className="flex items-center text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">Preview Mode - This is how visitors will see your site</span>
                  <span className="sm:hidden">Preview Mode</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep('details')}
                    className="px-3 sm:px-4 text-sm flex-1 sm:flex-none"
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    size="lg"
                    style={{
                      background: isUploading 
                        ? '#9ca3af' 
                        : 'linear-gradient(to right, #10b981, #059669)',
                      color: 'white',
                      border: 'none'
                    }}
                    className="px-4 sm:px-8 h-10 sm:h-11 text-sm sm:text-base text-white font-semibold shadow-lg relative z-10 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
                        <span className="hidden sm:inline">Publishing...</span>
                        <span className="sm:hidden">Publishing</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Publish Site</span>
                        <span className="sm:hidden">Publish</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      {/* Main Modal Content */}
      {step !== 'preview' && (
        <div className="w-full max-w-4xl mx-auto">
          <Card className="w-full overflow-auto scrollbar-hide">
            <CardContent className="p-0">
          {step === 'upload' && (
            <div className="p-6">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-slate-300 hover:border-slate-400'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="max-w-sm mx-auto">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${
                    isDragging ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    <Upload className="w-8 h-8" />
                  </div>
                  
                  <h3 className={`text-xl font-semibold mb-2 transition-colors ${
                    isDragging ? 'text-primary' : 'text-slate-900'
                  }`}>
                    {isDragging ? 'Drop them now!' : 'Drop your files here'}
                  </h3>
                  <p className={`text-slate-600 mb-6 transition-colors ${
                    isDragging ? 'text-primary/80' : 'text-slate-600'
                  }`}>
                    {isDragging 
                      ? 'Release to upload multiple files' 
                      : 'All file types supported • Multiple files welcome • Beautiful presentation guaranteed'
                    }
                  </p>
                  
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    size="lg"
                    className="mb-4"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept="*/*"
                    onChange={handleFileInputChange}
                  />
                  
                  <p className="text-xs text-slate-500">
                    All file types supported • Multiple files welcome • Beautiful presentation guaranteed
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'template' && uploadedFiles.length > 0 && (
            <div className="p-6">
              {/* Files Summary */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">
                      {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
                    </p>
                    <p className="text-sm text-slate-600">
                      Total: {formatFileSize(uploadedFiles.reduce((total, file) => total + file.size, 0))}
                    </p>
                  </div>
                  <Dialog open={showFilesModal} onOpenChange={setShowFilesModal}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Files
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Uploaded Files ({uploadedFiles.length})</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                            <div className="flex-shrink-0">
                              {getFileIcon(file.name, file.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                              <p className="text-xs text-slate-600">
                                {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ready
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Choose your template style</h3>
                <p className="text-slate-600 mb-4">Select how you want your content to be presented</p>
              </div>

              {/* Template Selection */}
              <div className="space-y-3 mb-6">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedTemplate === template.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        template.color === 'ocean' ? 'bg-ocean-100 text-ocean-700' :
                        template.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                        template.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                        template.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                        template.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-slate-900">{template.name}</h4>
                          {template.recommended && (
                            <Badge className="bg-primary text-white">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{template.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-primary bg-primary'
                          : 'border-slate-300'
                      }`}>
                        {selectedTemplate === template.id && (
                          <CheckCircle className="w-3 h-3 text-white m-0.5" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('upload')}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                <Button 
                  onClick={() => setStep('details')}
                  size="lg"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 'details' && uploadedFiles.length > 0 && (
            <div className="p-8 pb-12">
              {/* Files Summary - Enhanced */}
              <div className="mb-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">
                      {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} ready
                    </p>
                    <p className="text-sm text-slate-600">
                      Total: {formatFileSize(uploadedFiles.reduce((total, file) => total + file.size, 0))}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Ready to Share
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Files
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Files Ready for Upload ({uploadedFiles.length})</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                              <div className="flex-shrink-0">
                                {getFileIcon(file.name, file.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                                <p className="text-xs text-slate-600">
                                  {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                                </p>
                              </div>
                              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Ready
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              {/* Form Fields - Enhanced */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Title Field */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold text-slate-900 flex items-center">
                      Site Title <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Q4 Business Review 2024"
                      className="h-11 text-base border-slate-300 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Description Field */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-slate-900 flex items-center">
                      Description <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of what viewers will find..."
                      rows={3}
                      className="text-base border-slate-300 focus:border-cyan-500 focus:ring-cyan-500 resize-none"
                    />
                  </div>

                  {/* Author Name */}
                  <div className="space-y-2">
                    <Label htmlFor="authorName" className="text-sm font-semibold text-slate-900">
                      Author Name <span className="text-slate-400 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="authorName"
                      value={formData.authorName}
                      onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                      placeholder="Your name or organization"
                      className="h-11 text-base border-slate-300 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                {/* Security & Access - Enhanced */}
                <div className="pt-6 border-t border-slate-200">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">Security & Access</h4>
                    <p className="text-xs text-slate-600">Optional settings to control access to your site</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-slate-700 flex items-center">
                        <Shield className="w-4 h-4 mr-1.5 text-slate-500" />
                        Password Protection
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave empty for public access"
                        className="h-10 text-sm border-slate-300 focus:border-cyan-500 focus:ring-cyan-500"
                      />
                    </div>

                    {/* Expiry Field */}
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate" className="text-sm font-medium text-slate-700 flex items-center">
                        <Clock className="w-4 h-4 mr-1.5 text-slate-500" />
                        Expiry Date
                      </Label>
                      <Input
                        id="expiryDate"
                        type="datetime-local"
                        value={expiryDate || ''}
                        onChange={(e) => setExpiryDate(e.target.value || null)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="h-10 text-sm border-slate-300 focus:border-cyan-500 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                  
                  {/* Security Status Indicators */}
                  {(password || expiryDate) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {password && (
                        <div className="inline-flex items-center px-2.5 py-1 bg-cyan-50 border border-cyan-200 rounded-full text-xs text-cyan-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Password Protected
                        </div>
                      )}
                      {expiryDate && (
                        <div className="inline-flex items-center px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-800">
                          <Clock className="w-3 h-3 mr-1" />
                          Expires: {new Date(expiryDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setStep('template')}
                      className="px-6 h-11 border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Change Template
                    </Button>
                    
                    <Button
                      onClick={() => {
                        console.log('Preview button clicked, current step:', step);
                        console.log('Form data:', formData);
                        console.log('Title valid:', !!formData.title.trim());
                        console.log('Description valid:', !!formData.description.trim());
                        setStep('preview');
                      }}
                      disabled={!formData.title.trim() || !formData.description.trim()}
                      size="lg"
                      style={{
                        background: (!formData.title.trim() || !formData.description.trim()) 
                          ? '#9ca3af' 
                          : 'linear-gradient(to right, #06b6d4, #2563eb)',
                        color: 'white',
                        border: 'none'
                      }}
                      className="px-8 h-11 text-white font-semibold shadow-lg relative z-10 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Site
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lytsite Created Successfully!</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Your professional file sharing site is live! Share the link to give anyone instant access to your content.
              </p>
              
              {generatedUrl && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-slate-700 mb-1">Your Lytsite URL:</p>
                      <p className="text-sm text-blue-600 font-mono break-all">{generatedUrl}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedUrl);
                        // You could add a toast notification here
                      }}
                      className="ml-3"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* QR Code Display */}
              {qrCodeDataUrl && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 max-w-xs mx-auto">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <QrCode className="w-4 h-4 mr-2 text-slate-600" />
                      <p className="text-sm font-medium text-slate-700">QR Code</p>
                    </div>
                    <img 
                      src={qrCodeDataUrl} 
                      alt="QR Code for Lytsite" 
                      className="w-32 h-32 mx-auto mb-3 rounded-lg"
                    />
                    <p className="text-xs text-slate-500">Scan to access on mobile</p>
                  </div>
                </div>
              )}
              
              <div className="bg-slate-50 rounded-xl p-4 mb-8">
                <h4 className="font-medium text-slate-900 mb-2">Your site includes:</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>📄 Interactive file preview & download</p>
                  <p>📊 Built-in analytics & view tracking</p>
                  <p>🔗 Professional shareable link</p>
                  <p>📱 Mobile-responsive design</p>
                  <p>🌐 Global CDN distribution</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleComplete}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Your Lytsite
                </Button>
                
                {generatedUrl && (
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const shareData = {
                        title: title || 'My Lytsite',
                        text: description || 'Check out my professional file sharing site',
                        url: generatedUrl,
                      };
                      
                      if (navigator.share && navigator.canShare(shareData)) {
                        navigator.share(shareData);
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(generatedUrl);
                      }
                    }}
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Share Link
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  onClick={resetModal}
                  className="w-full text-slate-600"
                >
                  Create Another Site
                </Button>
              </div>
            </div>
          )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}