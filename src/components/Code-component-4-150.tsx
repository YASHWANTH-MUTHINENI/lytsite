import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
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
  Sparkles
} from "lucide-react";

interface MinimalUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const fileTypeIcons = {
  pdf: <FileText className="w-8 h-8 text-red-500" />,
  doc: <FileText className="w-8 h-8 text-blue-500" />,
  docx: <FileText className="w-8 h-8 text-blue-500" />,
  ppt: <PlayCircle className="w-8 h-8 text-orange-500" />,
  pptx: <PlayCircle className="w-8 h-8 text-orange-500" />,
  jpg: <Image className="w-8 h-8 text-green-500" />,
  jpeg: <Image className="w-8 h-8 text-green-500" />,
  png: <Image className="w-8 h-8 text-green-500" />,
  zip: <Archive className="w-8 h-8 text-purple-500" />,
  rar: <Archive className="w-8 h-8 text-purple-500" />
};

const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension || 'unknown';
};

const getFileIcon = (fileName: string) => {
  const fileType = getFileType(fileName);
  return fileTypeIcons[fileType as keyof typeof fileTypeIcons] || <FileText className="w-8 h-8 text-slate-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function MinimalUploadModal({ isOpen, onClose, onSuccess }: MinimalUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [step, setStep] = useState<'upload' | 'details' | 'success'>('upload');
  
  // Minimal form data - only 2-3 inputs required
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    authorName: '' // Optional - can be auto-filled from user profile
  });

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
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    
    // Auto-populate title from filename (smart default)
    const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    const smartTitle = nameWithoutExtension
      .replace(/[-_]/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    
    setFormData(prev => ({
      ...prev,
      title: smartTitle
    }));
    
    setStep('details');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('success');
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Here you would implement actual Cloudflare R2 upload
    // const uploadResult = await uploadToCloudflare(uploadedFile, formData);
  };

  const handleComplete = () => {
    onSuccess();
    onClose();
    // Navigate to the created template
  };

  const resetModal = () => {
    setUploadedFile(null);
    setStep('upload');
    setFormData({ title: '', description: '', authorName: '' });
    setUploadProgress(0);
    setIsUploading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Create Professional Site</h2>
              <p className="text-slate-600">Upload your file and create a beautiful sharing page in seconds</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

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
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Drop your file here
                  </h3>
                  <p className="text-slate-600 mb-6">
                    PDF, DOC, PPT, Images, or ZIP files up to 50MB
                  </p>
                  
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    size="lg"
                    className="mb-4"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.zip,.rar"
                    onChange={handleFileInputChange}
                  />
                  
                  <p className="text-xs text-slate-500">
                    Your file will be processed automatically to create a professional presentation
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 mb-1">Instant Processing</h4>
                  <p className="text-sm text-slate-600">Files are automatically optimized for web viewing</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 mb-1">Smart Defaults</h4>
                  <p className="text-sm text-slate-600">Professional styling applied automatically</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-slate-900 mb-1">Ready to Share</h4>
                  <p className="text-sm text-slate-600">Get a professional URL instantly</p>
                </div>
              </div>
            </div>
          )}

          {step === 'details' && uploadedFile && (
            <div className="p-6">
              {/* File Preview */}
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl mb-6">
                {getFileIcon(uploadedFile.name)}
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{uploadedFile.name}</h3>
                  <p className="text-sm text-slate-600">
                    {formatFileSize(uploadedFile.size)} • {getFileType(uploadedFile.name).toUpperCase()}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ready
                </Badge>
              </div>

              {/* Minimal Form - Only 2-3 Required Fields */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-medium text-slate-900">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-slate-600 mb-2">This will be the main heading on your page</p>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Q4 Business Review 2024"
                    className="text-base"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-medium text-slate-900">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-slate-600 mb-2">Brief description of what viewers will find</p>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g., Comprehensive quarterly performance analysis and strategic outlook for 2025"
                    rows={3}
                    className="text-base resize-none"
                  />
                </div>

                <div>
                  <Label htmlFor="authorName" className="text-base font-medium text-slate-900">
                    Your Name <span className="text-slate-400">(Optional)</span>
                  </Label>
                  <p className="text-sm text-slate-600 mb-2">Will be displayed as the author</p>
                  <Input
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                    placeholder="e.g., Sarah Chen"
                    className="text-base"
                  />
                </div>

                {/* Smart Preview */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Smart Features Included
                  </h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>✓ Automatic file preview generation</p>
                    <p>✓ Professional styling and layout</p>
                    <p>✓ Download tracking and analytics</p>
                    <p>✓ Responsive design for all devices</p>
                    <p>✓ Shareable link generation</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                <Button 
                  variant="outline" 
                  onClick={resetModal}
                >
                  Choose Different File
                </Button>
                
                <Button 
                  onClick={handleUpload}
                  disabled={!formData.title || !formData.description || isUploading}
                  size="lg"
                >
                  {isUploading ? (
                    <>Processing... {uploadProgress}%</>
                  ) : (
                    <>
                      Create Site
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Site Created Successfully!</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Your professional file sharing page is ready. Share the link with anyone to give them instant access to your content.
              </p>
              
              <div className="bg-slate-50 rounded-xl p-4 mb-8">
                <h4 className="font-medium text-slate-900 mb-2">Your site includes:</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>📄 Interactive file preview</p>
                  <p>📊 Download and view analytics</p>
                  <p>🔗 Professional shareable link</p>
                  <p>📱 Mobile-optimized viewing</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleComplete}
                  size="lg"
                  className="w-full"
                >
                  View Your Site
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={resetModal}
                  className="w-full"
                >
                  Create Another Site
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}