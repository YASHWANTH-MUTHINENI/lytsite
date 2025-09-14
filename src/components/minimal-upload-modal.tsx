import React, { useState, useRef, useEffect } from "react";
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

import { PDFThumbnailGenerator } from "../utils/pdfThumbnailGenerator";
// Phase 2: Import chunked upload system
import { ChunkedUploader } from '../hooks/useChunkedUpload';
// Direct Chunked Upload: Import direct chunked upload system
import { useDirectChunkedUpload, shouldUseDirectChunkedUpload } from '../hooks/useDirectChunkedUpload';
// Simplified Direct Upload: Import simplified direct upload system
import { useDirectUpload } from '../hooks/useSimpleDirectUpload';
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

// Upload stages for better UX feedback
const uploadStages = [
  { id: 'analyzing', message: "Analyzing files...", progress: 10 },
  { id: 'processing', message: "Processing content...", progress: 30 },
  { id: 'uploading', message: "Uploading to storage...", progress: 60 },
  { id: 'generating', message: "Generating website...", progress: 80 },
  { id: 'finalizing', message: "Finalizing your site...", progress: 95 }
];

// Educational tips during upload
const uploadTips = [
  "💡 Your files are automatically optimized for web performance",
  "🔒 All uploads are encrypted with enterprise-grade security", 
  "📱 Your site will work perfectly on desktop, tablet, and mobile",
  "⚡ Powered by Cloudflare's global network for maximum speed",
  "🎨 Professional themes are applied automatically",
  "📊 Built-in analytics help you track visitor engagement",
  "🌐 Custom domains can be added to any plan",
  "🔄 Version history keeps your files safe and accessible"
];

interface UploadResult {
  success: boolean;
  slug?: string;
  url?: string;
  error?: string;
}

// Simple PowerPoint file detection
const isPowerPointFile = (file: File): boolean => {
  const powerPointTypes = [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow'
  ];
  const powerPointExtensions = ['.ppt', '.pptx', '.pps', '.ppsx'];
  
  return powerPointTypes.includes(file.type) || 
         powerPointExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
};

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

// Global storage for file data (used by PDF viewer)
const fileDataStore = new Map<string, ArrayBuffer>();

// Expose to window for PDF viewer access
if (typeof window !== 'undefined') {
  (window as any).fileDataStore = fileDataStore;
}

// Enhanced file processing with thumbnail generation
const processFileWithThumbnails = async (file: File): Promise<any> => {
  console.log('Processing file:', file.name, 'MIME type:', file.type);
  
  // Create file URL - use special handling for PDFs
  let fileUrl;
  
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    // For PDFs, read as ArrayBuffer and store it
    const fileData = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
    
    // Create unique ID and store a copy of the data to prevent detachment
    const fileId = `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const clonedData = fileData.slice(); // Create a copy to prevent ArrayBuffer detachment
    fileDataStore.set(fileId, clonedData);
    fileUrl = `preview://${fileId}`;
  } else {
    fileUrl = URL.createObjectURL(file);
  }

  let thumbnailUrl: string | undefined = undefined;
  let pages: number | undefined = undefined;

  // Generate thumbnails for PDFs
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    try {
      const thumbnails = await PDFThumbnailGenerator.generateThumbnails(fileUrl, {
        scale: 0.3,
        maxPages: 1, // Just generate cover thumbnail for upload preview
        quality: 0.8,
        format: 'jpeg'
      });
      
      if (thumbnails.length > 0) {
        thumbnailUrl = thumbnails[0].dataUrl;
      }

      // Get page count
      try {
        const pdf = await import('react-pdf').then(mod => mod.pdfjs.getDocument(fileUrl).promise);
        pages = pdf.numPages;
      } catch (error) {
        console.warn('Could not get PDF page count:', error);
      }
    } catch (error) {
      console.warn('Could not generate PDF thumbnail:', error);
    }
  }

  // PowerPoint files are handled by backend AWS LibreOffice conversion
  if (isPowerPointFile(file)) {
    console.log('PowerPoint file detected:', file.name, '- Will be converted to PDF by backend AWS service');
  }

  // Generate thumbnails for images (resize for consistent display)
  if (file.type.startsWith('image/')) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img') as HTMLImageElement;
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          const maxSize = 200;
          const ratio = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve();
        };
        img.onerror = reject;
        img.src = fileUrl;
      });
    } catch (error) {
      console.warn('Could not generate image thumbnail:', error);
    }
  }

  return {
    name: file.name,
    size: formatFileSize(file.size),
    type: file.type,
    url: fileUrl,
    thumbnailUrl,
    pages,
    uploadedAt: new Date().toISOString().split('T')[0],
    uploadedBy: "Anonymous",
    description: `${file.name} - ${formatFileSize(file.size)}`
  };
};

// Transform user data for UniversalFileTemplate with enhanced processing
const getTemplateData = async (formData: any, uploadedFiles: File[]) => {
  // Process files with thumbnail generation
  const processedFiles = await Promise.all(
    uploadedFiles.map(file => processFileWithThumbnails(file))
  );

  return {
    title: formData.title || "My Files",
    subLine: formData.description || "File delivery",
    tagLine: formData.authorName ? `By ${formData.authorName}` : "Shared with Lytsite",
    heroImage: null,
    files: processedFiles,
    contactInfo: {
      email: "",
      website: "",
      linkedin: ""
    }
  };
};

// Helper function to format file size for client delivery

export default function MinimalUploadModal({ onSuccess }: MinimalUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [currentFile, setCurrentFile] = useState<{ name: string; index: number; total: number } | null>(null);
  const [uploadTip, setUploadTip] = useState('');
  const [isOptimisticSuccess, setIsOptimisticSuccess] = useState(false);
  const [step, setStep] = useState<'upload' | 'template' | 'details' | 'preview' | 'success'>('upload');
  const [selectedTemplate, setSelectedTemplate] = useState('universal');
  const [showFilesModal, setShowFilesModal] = useState(false);
  
  // Minimal form data - only 2-3 inputs required
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    authorName: '', // Optional - can be auto-filled from user profile
    // Client delivery specific fields
    projectName: '',
    clientName: '',
    deliveryDate: '',
    status: '',
    contactEmail: '',
    contactPhone: '',
    contactWebsite: ''
  });
  
  // Additional state for Cloudflare integration
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [projectSlug, setProjectSlug] = useState<string>('');
  
  // Password and expiry state
  const [password, setPassword] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [templateData, setTemplateData] = useState<any>(null);
  const [isProcessingTemplate, setIsProcessingTemplate] = useState(false);
  
  // Phase 2: Track upload method for UI feedback
  const [uploadMethod, setUploadMethod] = useState<'regular' | 'chunked' | 'direct' | 'direct-chunked' | null>(null);
  
  // Copy feedback state
  const [isCopied, setIsCopied] = useState(false);
  
// Helper function to check if any uploaded file is a PowerPoint
const hasPowerPointFiles = (files: File[]) => {
  return files.some(file => 
    file.type.includes('presentation') || 
    file.name.toLowerCase().endsWith('.pptx') || 
    file.name.toLowerCase().endsWith('.ppt')
  );
};

// Process template data when files or form data changes
useEffect(() => {
  const processTemplateData = async () => {
    if (uploadedFiles.length > 0 && step === 'preview') {
      setIsProcessingTemplate(true);
      try {
        // Only UniversalFileTemplate is supported
        const data = await getTemplateData(formData, uploadedFiles);
        setTemplateData(data);
      } catch (error) {
        console.error('Error processing template data:', error);
      } finally {
        setIsProcessingTemplate(false);
      }
    }
  };

  processTemplateData();
}, [uploadedFiles, formData, step, selectedTemplate]);
  
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

  // Smart upload handler with optimistic UI
  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    // OPTIMISTIC UI: Immediately show success screen
    setStep('success');
    setIsOptimisticSuccess(true);
    
    // Generate optimistic placeholder data
    const optimisticUrl = `https://lytsite.com/${Math.random().toString(36).substr(2, 8)}`;
    setGeneratedUrl(optimisticUrl);
    
    // Generate optimistic QR code
    try {
      const qrDataUrl = await QRCode.toDataURL(optimisticUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff',
        },
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (qrError) {
      console.log('Optimistic QR generation skipped');
    }
    
    // Start tips rotation during background upload
    let tipIndex = 0;
    setUploadTip(uploadTips[tipIndex]);
    const tipInterval = setInterval(() => {
      tipIndex = (tipIndex + 1) % uploadTips.length;
      setUploadTip(uploadTips[tipIndex]);
    }, 4000);

    try {
      // Smart upload selection priority:
      // 1. Direct-to-Storage (fastest - bypasses Worker)
      // 2. Chunked (for large files when direct upload not available)
      // 3. Regular (fallback)
      
      // Smart upload method selection with 4-tier priority:
      // 1. Direct Chunked Upload: For very large files (>100MB) with chunking
      // 2. Direct Upload: For medium-large files that benefit from bypassing Worker
      // 3. Chunked Upload: For medium files (>50MB) that need parallel processing  
      // 4. Regular Upload: For smaller files (<50MB) using standard Worker processing
      
      const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
      const shouldUseDirectChunked = shouldUseDirectChunkedUpload(uploadedFiles);
      const hasLargeFiles = uploadedFiles.some(file => file.size > 50 * 1024 * 1024 && file.size < 100 * 1024 * 1024); // 50-100MB
      const shouldUseDirect = !shouldUseDirectChunked && (hasLargeFiles || totalSize > 100 * 1024 * 1024);
      const shouldUseChunked = !shouldUseDirectChunked && !shouldUseDirect && ChunkedUploader.shouldUseChunkedUpload(uploadedFiles);
      
      // Set upload method for UI feedback
      let uploadPromise;
      if (shouldUseDirectChunked) {
        setUploadMethod('direct-chunked');
        console.log(`Upload strategy: DIRECT-CHUNKED for ${uploadedFiles.length} files (${formatFileSize(totalSize)})`);
        console.log(`Direct Chunked Mode: Maximum speed + reliability for very large files`);
        uploadPromise = handleDirectChunkedUpload();
      } else if (shouldUseDirect) {
        setUploadMethod('direct');
        console.log(`Upload strategy: DIRECT-TO-STORAGE for ${uploadedFiles.length} files (${formatFileSize(totalSize)})`);
        console.log(`Direct Storage Mode: Bypass Worker for maximum speed`);
        uploadPromise = handleDirectUpload();
      } else if (shouldUseChunked) {
        setUploadMethod('chunked');
        console.log(`Upload strategy: CHUNKED for ${uploadedFiles.length} files (${formatFileSize(totalSize)})`);
        console.log(`Chunked Mode: Parallel chunk processing active`);
        uploadPromise = handleChunkedUpload();
      } else {
        setUploadMethod('regular');
        console.log(`Upload strategy: REGULAR for ${uploadedFiles.length} files (${formatFileSize(totalSize)})`);
        console.log(`Regular Mode: Standard Worker upload`);
        uploadPromise = handleRegularUpload();
      }

      // Wait for background upload to complete
      await uploadPromise;
      
      // Upload completed! Remove optimistic state
      setIsOptimisticSuccess(false);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
      // Reset to upload step on error
      setStep('upload');
      setIsOptimisticSuccess(false);
    } finally {
      clearInterval(tipInterval);
      setIsUploading(false);
      setUploadMethod(null);
      setUploadStage('');
      setUploadTip('');
      setUploadProgress(100);
    }
  };

  // Phase 2: Chunked upload for large files (>50MB)
  const handleChunkedUpload = async () => {
    const uploader = new ChunkedUploader({
      onProgress: (progress, fileIndex) => {
        // Update overall progress based on all files
        const overallProgress = uploader.getOverallProgress();
        // During actual upload, show real progress between 30-90%
        const realProgress = 30 + (overallProgress * 0.6); // Map 0-100% to 30-90%
        setUploadProgress(Math.min(realProgress, 90));
        
        // Keep the upload stage message active during real progress
        if (overallProgress > 0) {
          setUploadStage("Uploading to storage...");
        }
      },
      onFileComplete: (fileIndex, fileId) => {
        console.log(`File ${fileIndex} (${fileId}) uploaded successfully`);
      },
      onError: (error, fileIndex) => {
        console.error(`Upload error for file ${fileIndex}:`, error);
        throw new Error(error);
      }
    });

    // Initialize upload session
    await uploader.initializeUpload(uploadedFiles, {
      title,
      description,
      template: selectedTemplate,
      authorName,
      password: password || undefined,
      expiryDate: expiryDate || undefined
    });

    // Start chunked upload
    const result = await uploader.startUpload();
    
    setUploadProgress(100);
    
    // Store results
    setGeneratedUrl(result.url);
    setProjectSlug(result.slug);
    
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
  };

  // Direct-to-Storage upload using simplified direct upload
  const { uploadFiles: directUploadFiles, result: directResult, isUploading: isDirectUploading, optimizationProgress } = useDirectUpload();
  
  // Direct Chunked Upload for very large files
  const { uploadFiles: directChunkedUploadFiles, result: directChunkedResult, isUploading: isDirectChunkedUploading } = useDirectChunkedUpload();
  
  const handleDirectUpload = async () => {
    try {
      // Simulate realistic progress for direct upload
      let currentProgress = 30;
      const progressInterval = setInterval(() => {
        currentProgress += Math.random() * 12 + 8; // Faster increments for direct upload
        if (currentProgress > 88) currentProgress = 88;
        setUploadProgress(currentProgress);
      }, 600);

      const result = await directUploadFiles(uploadedFiles, {
        title,
        description,
        template: selectedTemplate,
        authorName,
        password: password || undefined,
        expiryDate: expiryDate || undefined
      });

      clearInterval(progressInterval);

      if (result.success && result.url && result.slug) {
        setGeneratedUrl(result.url);
        setProjectSlug(result.slug);
        setUploadProgress(100);
        
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
        throw new Error(result.error || 'Direct upload failed');
      }
    } catch (error) {
      console.error('Direct upload error:', error);
      throw error;
    }
  };

  // Direct Chunked Upload for very large files
  const handleDirectChunkedUpload = async () => {
    try {
      // Simulate progress for chunked upload with more detailed updates
      let currentProgress = 30;
      const progressInterval = setInterval(() => {
        currentProgress += Math.random() * 8 + 4; // Steady progress for chunked
        if (currentProgress > 87) currentProgress = 87;
        setUploadProgress(currentProgress);
      }, 400);

      const result = await directChunkedUploadFiles(uploadedFiles, {
        title,
        description,
        template: selectedTemplate,
        authorName,
        password: password || undefined,
        expiryDate: expiryDate || undefined
      });

      clearInterval(progressInterval);

      if (result.success && result.url && result.slug) {
        setGeneratedUrl(result.url);
        setProjectSlug(result.slug);
        setUploadProgress(100);
        
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
        throw new Error(result.error || 'Direct chunked upload failed');
      }
    } catch (error) {
      console.error('Direct chunked upload error:', error);
      throw error;
    }
  };

  // Phase 1: Regular upload for smaller files (≤50MB)
  const handleRegularUpload = async () => {
    // Process files to extract presentation data and other metadata
    const processedFiles = await Promise.all(
      uploadedFiles.map(file => processFileWithThumbnails(file))
    );
    
    // Create FormData with files and metadata
    const uploadFormData = new FormData();
    
    uploadedFiles.forEach(file => {
      uploadFormData.append('files', file);
    });
    
    uploadFormData.append('title', title);
    uploadFormData.append('description', description);
    uploadFormData.append('template', selectedTemplate);
    uploadFormData.append('authorName', authorName);
    
    // Add processed file metadata
    uploadFormData.append('filesMetadata', JSON.stringify(
      processedFiles.map(processedFile => ({
        name: processedFile.name,
        type: processedFile.type,
        size: processedFile.size
      }))
    ));
    
    // Add password and expiry if set
    if (password) {
      uploadFormData.append('password', password);
    }
    if (expiryDate) {
      uploadFormData.append('expiryDate', expiryDate);
    }
    
    // Start realistic progress tracking
    let currentProgress = 30; // Start after processing stage
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 10 + 5; // Increment 5-15% randomly
      if (currentProgress > 85) currentProgress = 85; // Cap before completion
      setUploadProgress(currentProgress);
    }, 800);
    
    // Make upload request to Cloudflare Worker
    const response = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: uploadFormData,
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
    setFormData({ 
      title: '', 
      description: '', 
      authorName: '', 
      projectName: '',
      clientName: '',
      deliveryDate: '',
      status: '',
      contactEmail: '',
      contactPhone: '',
      contactWebsite: ''
    });
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
                {isProcessingTemplate || !templateData ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Processing files and generating thumbnails...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    {/* PowerPoint Notice Banner */}
                    {hasPowerPointFiles(uploadedFiles) && (
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 px-4 py-3 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <FileText className="w-4 h-4 text-orange-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-orange-900">
                              PowerPoint files will be converted to PDF
                            </p>
                            <p className="text-xs text-orange-700">
                              Your .pptx/.ppt files will be automatically converted to PDF using our AWS LibreOffice service. Users will view them as PDFs with full download options.
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="inline-flex items-center px-2 py-1 bg-orange-100 border border-orange-300 rounded-full text-xs text-orange-800 font-medium">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AWS Conversion
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Template Preview */}
                    <div className="flex-1 overflow-y-auto">
                     
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-6 py-3 sm:py-4 bg-white border-t border-gray-200 flex-shrink-0 gap-3 sm:gap-0">
                {/* Upload Method Indicator */}
                {uploadMethod && (
                  <div className="flex items-center justify-center mb-2 sm:mb-0">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                      uploadMethod === 'direct-chunked'
                        ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border border-purple-200'
                        : uploadMethod === 'direct'
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200'
                        : uploadMethod === 'chunked' 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}>
                      {uploadMethod === 'direct-chunked' ? (
                        <>
                          <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mr-2 animate-pulse"></span>
                          Ultra-Fast Chunked Mode
                        </>
                      ) : uploadMethod === 'direct' ? (
                        <>
                          <span className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-2 animate-pulse"></span>
                          Direct Storage Mode
                        </>
                      ) : uploadMethod === 'chunked' ? (
                        <>
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                          Fast Mode Active
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                          Standard Upload
                        </>
                      )}
                    </div>
                  </div>
                )}
                
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
                        <span className="hidden sm:inline">
                          {uploadStage || `Publishing${
                            uploadMethod === 'direct-chunked' ? ' (Ultra-Fast Chunked)' :
                            uploadMethod === 'direct' ? ' (Direct Storage)' :
                            uploadMethod === 'chunked' ? ' (Fast Mode)' : ''
                          }...`}
                        </span>
                        <span className="sm:hidden">{uploadStage ? uploadStage.split(' ').slice(0, 2).join(' ') : 'Publishing'}</span>
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
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 text-center">
                      💡 <strong>PowerPoint files</strong> will be automatically converted to PDF for universal compatibility and easier viewing
                    </p>
                  </div>
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
                              {isPowerPointFile(file) && (
                                <p className="text-xs text-blue-600 mt-1">
                                  ✨ Will be converted to PDF for easier viewing
                                </p>
                              )}
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

                  {/* Client Delivery Specific Fields removed */}
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
            <div className="relative p-6 text-center">
              {/* Optimistic Success Content */}
              <div className={`transition-all duration-500 ${isOptimisticSuccess ? 'filter blur-sm opacity-70' : 'filter blur-0 opacity-100'}`}>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">Lytsite Created Successfully!</h3>
                <p className="text-slate-600 mb-4 max-w-md mx-auto text-sm">
                  Your professional file sharing site is live! Share the link to give anyone instant access to your content.
                </p>
                
                {generatedUrl && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-left">
                        <p className="text-xs font-medium text-slate-700 mb-1">Your Lytsite URL:</p>
                        <p className="text-xs text-blue-600 font-mono break-all">{generatedUrl}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(generatedUrl);
                            setIsCopied(true);
                            setTimeout(() => setIsCopied(false), 2000);
                          } catch (err) {
                            console.error('Failed to copy link:', err);
                          }
                        }}
                        className="ml-3 h-8 w-8 p-0"
                      >
                        {isCopied ? (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* QR Code Display */}
                {qrCodeDataUrl && (
                  <div className="bg-white border border-slate-200 rounded-xl p-3 mb-4 max-w-xs mx-auto">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <QrCode className="w-3 h-3 mr-1 text-slate-600" />
                        <p className="text-xs font-medium text-slate-700">QR Code</p>
                      </div>
                      <img 
                        src={qrCodeDataUrl} 
                        alt="QR Code for Lytsite" 
                        className="w-24 h-24 mx-auto mb-2 rounded-lg"
                      />
                      <p className="text-xs text-slate-500">Scan to access on mobile</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={handleComplete}
                  size="default"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Your Lytsite
                </Button>
                
                {generatedUrl && (
                  <Button 
                    variant="outline"
                    size="default"
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
                  className="w-full text-slate-600 h-8 text-sm"
                >
                  Create Another Site
                </Button>
              </div>

              {/* Optimistic Loading Overlay */}
              {isOptimisticSuccess && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl animate-in fade-in duration-300">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="text-lg font-medium text-slate-700">Almost done...</span>
                    </div>
                    <p className="text-sm text-slate-500 max-w-xs">
                      {uploadTip || 'Finalizing your professional site...'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}