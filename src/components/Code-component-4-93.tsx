import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  Video, 
  Archive,
  CheckCircle,
  AlertCircle,
  Loader2,
  Link,
  QrCode,
  Share2
} from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
}

const templateOptions = [
  { value: 'client-delivery', label: 'Client Delivery', description: 'Professional file delivery' },
  { value: 'photo-gallery', label: 'Photo Gallery', description: 'Stunning photo showcase' },
  { value: 'portfolio-resume', label: 'Portfolio Resume', description: 'Personal brand showcase' },
  { value: 'event-template', label: 'Event', description: 'Event pages and schedules' },
  { value: 'product-template', label: 'Product', description: 'Product showcases and catalogs' },
  { value: 'case-study-template', label: 'Case Study', description: 'Design and research case studies' },
  { value: 'pitch-template', label: 'Pitch Deck', description: 'Investment and business pitches' }
];

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image className="w-5 h-5 text-green-500" />;
  if (type.startsWith('video/')) return <Video className="w-5 h-5 text-blue-500" />;
  if (type.includes('pdf') || type.includes('document')) return <FileText className="w-5 h-5 text-red-500" />;
  if (type.includes('zip') || type.includes('archive')) return <Archive className="w-5 h-5 text-yellow-500" />;
  return <FileText className="w-5 h-5 text-slate-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Mock Cloudflare R2 upload function
const uploadToCloudflare = async (file: File): Promise<string> => {
  // Simulate upload with progress
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock Cloudflare R2 URL
      resolve(`https://pub-your-cloudflare-bucket.r2.dev/${Date.now()}-${file.name}`);
    }, 2000 + Math.random() * 3000);
  });
};

// Mock website generation function
const generateWebsite = async (files: UploadedFile[], template: string, siteTitle: string): Promise<{url: string, qrCode: string}> => {
  // Simulate website generation
  return new Promise((resolve) => {
    setTimeout(() => {
      const siteId = Math.random().toString(36).substring(7);
      resolve({
        url: `https://${siteId}.lytsite.app`,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://${siteId}.lytsite.app`
      });
    }, 3000);
  });
};

export default function UploadModal({ isOpen, onClose, onNavigate }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [siteTitle, setSiteTitle] = useState('');
  const [step, setStep] = useState<'upload' | 'configure' | 'generating' | 'complete'>('upload');
  const [generatedSite, setGeneratedSite] = useState<{url: string, qrCode: string} | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = async (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      status: 'uploading'
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload for each file
    for (const [index, file] of fileList.entries()) {
      const fileId = newFiles[index].id;
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, uploadProgress: Math.min(f.uploadProgress + 10, 90) } : f
        ));
      }, 200);

      try {
        const url = await uploadToCloudflare(file);
        clearInterval(progressInterval);
        
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            uploadProgress: 100, 
            status: 'completed',
            url 
          } : f
        ));
      } catch (error) {
        clearInterval(progressInterval);
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'error' } : f
        ));
      }
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleNext = () => {
    if (step === 'upload' && files.length > 0) {
      setStep('configure');
    } else if (step === 'configure' && selectedTemplate && siteTitle) {
      setStep('generating');
      generateSite();
    }
  };

  const generateSite = async () => {
    try {
      const result = await generateWebsite(files, selectedTemplate, siteTitle);
      setGeneratedSite(result);
      setStep('complete');
    } catch (error) {
      console.error('Failed to generate website:', error);
    }
  };

  const resetModal = () => {
    setFiles([]);
    setSelectedTemplate('');
    setSiteTitle('');
    setStep('upload');
    setGeneratedSite(null);
    setDragActive(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleViewSite = () => {
    if (selectedTemplate) {
      handleClose();
      onNavigate(selectedTemplate);
    }
  };

  const completedFiles = files.filter(f => f.status === 'completed');
  const isUploadComplete = files.length > 0 && completedFiles.length === files.length;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Create Your Lytsite</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className={`flex items-center space-x-2 ${step === 'upload' ? 'text-primary' : completedFiles.length > 0 ? 'text-green-500' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'upload' ? 'border-primary bg-primary text-white' : completedFiles.length > 0 ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300'}`}>
                {completedFiles.length > 0 ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className="text-sm font-medium">Upload Files</span>
            </div>
            
            <div className={`w-16 h-0.5 ${completedFiles.length > 0 ? 'bg-green-500' : 'bg-slate-300'}`} />
            
            <div className={`flex items-center space-x-2 ${step === 'configure' ? 'text-primary' : step === 'generating' || step === 'complete' ? 'text-green-500' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'configure' ? 'border-primary bg-primary text-white' : (step === 'generating' || step === 'complete') ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300'}`}>
                {(step === 'generating' || step === 'complete') ? <CheckCircle className="w-4 h-4" /> : '2'}
              </div>
              <span className="text-sm font-medium">Configure</span>
            </div>
            
            <div className={`w-16 h-0.5 ${step === 'complete' ? 'bg-green-500' : 'bg-slate-300'}`} />
            
            <div className={`flex items-center space-x-2 ${step === 'generating' ? 'text-primary' : step === 'complete' ? 'text-green-500' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'generating' ? 'border-primary bg-primary text-white' : step === 'complete' ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300'}`}>
                {step === 'generating' ? <Loader2 className="w-4 h-4 animate-spin" /> : step === 'complete' ? <CheckCircle className="w-4 h-4" /> : '3'}
              </div>
              <span className="text-sm font-medium">Generate</span>
            </div>
          </div>

          {/* Step 1: Upload Files */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-slate-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Drop your files here
                </h3>
                <p className="text-slate-600 mb-6">
                  Or click to browse from your computer
                </p>
                <Input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFiles(Array.from(e.target.files));
                    }
                  }}
                />
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose Files
                  </label>
                </Button>
                <p className="text-xs text-slate-500 mt-4">
                  Supports: Images, Videos, PDFs, Documents, Archives
                </p>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900">Uploaded Files ({files.length})</h4>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
                              {file.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {file.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => removeFile(file.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          {file.status === 'uploading' && (
                            <Progress value={file.uploadProgress} className="h-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Configure */}
          {step === 'configure' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Configure Your Site</h3>
                <p className="text-slate-600">Choose a template and customize your site details</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="site-title" className="text-base font-medium">Site Title</Label>
                  <Input
                    id="site-title"
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    placeholder="Enter your site title..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Choose Template</Label>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templateOptions.map((template) => (
                      <Card 
                        key={template.value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate === template.value ? 'ring-2 ring-primary border-primary' : ''
                        }`}
                        onClick={() => setSelectedTemplate(template.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900">{template.label}</h4>
                            {selectedTemplate === template.value && (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{template.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Generating */}
          {step === 'generating' && (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 mx-auto mb-6 text-primary animate-spin" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Creating Your Site</h3>
              <p className="text-slate-600 mb-6">
                We're processing your files and generating your beautiful website...
              </p>
              <div className="max-w-md mx-auto">
                <Progress value={66} className="h-2" />
                <p className="text-sm text-slate-500 mt-2">Almost done...</p>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 'complete' && generatedSite && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
              <h3 className="text-3xl font-bold text-slate-900 mb-2">🎉 Your Site is Ready!</h3>
              <p className="text-slate-600 mb-8">
                Your beautiful Lytsite has been created and is ready to share.
              </p>

              <Card className="max-w-md mx-auto mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Link className="w-4 h-4 text-primary" />
                      <span className="font-medium text-slate-900">Your Site URL</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-slate-50 rounded p-3 mb-4">
                    <p className="text-sm font-mono text-slate-700 break-all">{generatedSite.url}</p>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        <QrCode className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-xs text-slate-500">QR Code</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleViewSite} className="bg-primary hover:bg-primary/90">
                  View Your Site
                </Button>
                <Button variant="outline" onClick={() => window.open(generatedSite.url, '_blank')}>
                  Open in New Tab
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <Button variant="ghost" onClick={handleClose}>
            {step === 'complete' ? 'Close' : 'Cancel'}
          </Button>
          
          {step !== 'complete' && step !== 'generating' && (
            <Button
              onClick={handleNext}
              disabled={
                (step === 'upload' && !isUploadComplete) ||
                (step === 'configure' && (!selectedTemplate || !siteTitle))
              }
              className="bg-primary hover:bg-primary/90"
            >
              {step === 'upload' ? 'Next: Configure' : 'Generate Site'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}