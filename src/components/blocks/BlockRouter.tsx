import React from "react";
import HeroBlock from "./HeroBlock";
import SingleImageBlock from "./SingleImageBlock";
import GridGalleryBlock from "./GridGalleryBlock";
import MasonryGalleryBlock from "./MasonryGalleryBlock";
import LightboxGalleryBlock from "./LightboxGalleryBlock";
import GalleryBlock from "./GalleryBlock";
import DynamicPDFBlock from "./DynamicPDFBlock";
import MultiDynamicPDFBlock from "./MultiDynamicPDFBlock";
import VideoBlock from "./VideoBlock";
import ArchiveBlock from "./ArchiveBlock";
import DocumentBlock from "./DocumentBlock";
import { DualQualityFile } from "../../hooks/useDualQuality";

export interface FileMetadata {
  id?: string;
  name: string;
  size: string;
  type: string;
  url?: string;
  thumbnailUrl?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  description?: string;
  // Add presentation-specific data (legacy)
  presentationData?: {
    slides: Array<{
      id: number;
      imageUrl: string;
      thumbnailUrl: string;
      title?: string;
    }>;
    totalSlides: number;
    slideImages: string[];
    pdfUrl?: string;
    embedUrl?: string;
    theme?: string;
  };
}

interface ProjectSettings {
  enableFavorites?: boolean;
  enableComments?: boolean;
  enableApprovals?: boolean;
  enableAnalytics?: boolean;
  enableNotifications?: boolean;
}

interface BlockRouterProps {
  fileType: 'gallery' | 'pdf' | 'video' | 'archive' | 'document' | 'presentation' | 'mixed';
  title: string;
  description?: string;
  files?: FileMetadata[];
  content?: string;
  onDownload?: () => void;
  metadata?: any;
  projectId?: string;
  settings?: ProjectSettings;
}

// Utility function to determine file type from file extension or MIME type
export const getFileType = (fileName: string, mimeType?: string): 'gallery' | 'pdf' | 'video' | 'archive' | 'document' | 'presentation' => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // PDF files (highest priority)
  if (extension === 'pdf' || mimeType === 'application/pdf') {
    return 'pdf';
  }
  
  // Presentation files (before images/documents to avoid conflicts)
  // Enhanced detection for PowerPoint files
  if (['ppt', 'pptx', 'key', 'odp'].includes(extension) || 
      mimeType?.includes('presentation') || 
      mimeType?.includes('powerpoint') ||
      mimeType === 'application/vnd.ms-powerpoint' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      // Additional MIME type variations that might occur
      mimeType === 'application/mspowerpoint' ||
      mimeType === 'application/powerpoint' ||
      mimeType === 'application/x-mspowerpoint') {
    return 'presentation';
  }
  
  // Image files
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico', 'heic', 'heif', 'avif'].includes(extension) || 
      mimeType?.startsWith('image/')) {
    return 'gallery';
  }
  
  // Video files
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp', 'ogv', 'm4v'].includes(extension) ||
      mimeType?.startsWith('video/')) {
    return 'video';
  }
  
  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'cab', 'iso'].includes(extension) ||
      ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'].includes(mimeType || '')) {
    return 'archive';
  }
  
  // Default to document for text-based files and everything else
  return 'document';
};

// Utility function to get multiple file types from a list of files
export const getMultipleFileTypes = (files: FileMetadata[]): 'gallery' | 'pdf' | 'video' | 'archive' | 'document' | 'presentation' | 'mixed' => {
  if (files.length === 0) return 'document';
  
  const types = new Set(files.map(file => getFileType(file.name, file.type)));
  
  if (types.size === 1) {
    return Array.from(types)[0];
  }
  
  // For mixed types, return 'mixed' to handle them separately
  return 'mixed';
};

export default function BlockRouter({ 
  fileType, 
  title, 
  description,
  files = [],
  content = "",
  onDownload,
  metadata,
  projectId,
  settings 
}: BlockRouterProps) {
  
  // Helper function to convert FileMetadata to DualQualityFile format
  const convertFilesToDualQuality = (files: FileMetadata[]): DualQualityFile[] => {
    return files.map(file => ({
      id: file.id,
      name: file.name,
      type: file.type,
      size: parseFloat(file.size) || 0, // Convert string size to number
      url: file.url
    }));
  };
  
  switch (fileType) {
    case 'gallery':
      // Convert FileMetadata to image URLs for gallery blocks
      const imageUrls = files.map(file => file.url || '').filter(url => url);
      const imageCount = imageUrls.length;
      
      // Single Image → Centered, large display with optional caption/credit
      if (imageCount === 1) {
        const firstFile = files[0];
        return (
          <SingleImageBlock
            title={title}
            fileId={firstFile.id}
            image={imageUrls[0]}
            caption={description}
            credit={metadata?.credit}
            onDownload={onDownload}
            metadata={metadata}
            projectId={projectId}
            settings={settings}
          />
        );
      }
      
      // 2-6 Images → Clean Grid Gallery
      if (imageCount >= 2 && imageCount <= 6) {
        return (
          <GridGalleryBlock
            title={title}
            files={convertFilesToDualQuality(files)}
            onDownload={onDownload}
            metadata={metadata}
            projectId={projectId}
            settings={settings}
          />
        );
      }
      
      // 7-20 Images → Masonry Layout
      if (imageCount >= 7 && imageCount <= 20) {
        return (
          <MasonryGalleryBlock
            title={title}
            files={convertFilesToDualQuality(files)}
            onDownload={onDownload}
            metadata={metadata}
            projectId={projectId}
            settings={settings}
          />
        );
      }
      
      // 20+ Images → Lightbox + Lazy Loading
      if (imageCount > 20) {
        return (
          <LightboxGalleryBlock
            title={title}
            files={convertFilesToDualQuality(files)}
            totalImages={files.length}
            onDownload={onDownload}
            metadata={metadata}
            projectId={projectId}
            settings={settings}
          />
        );
      }
      
      // Fallback to original GalleryBlock for edge cases
      return (
        <GalleryBlock
          title={title}
          files={convertFilesToDualQuality(files)}
          totalImages={files.length}
          onDownload={onDownload}
          metadata={metadata}
          projectId={projectId}
          settings={settings}
        />
      );
      
    case 'pdf':
      // Convert FileMetadata to PDFFile format for MultiPDFBlock
      const pdfFiles = files.filter(file => 
        file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
      ).map((file, index) => ({
        id: file.url || `pdf-${index}`,
        name: file.name,
        url: file.url || '',
        size: file.size,
        pages: metadata?.pages || 1,
        thumbnails: metadata?.thumbnails || [],
        isPitchDeck: file.name.toLowerCase().includes('pitch') || 
                    file.name.toLowerCase().includes('deck') || 
                    file.name.toLowerCase().includes('presentation'),
        coverPage: file.thumbnailUrl,
        metadata: {
          author: metadata?.author,
          created: file.uploadedAt,
          modified: file.uploadedAt
        }
      }));

      // Use MultiDynamicPDFBlock for multiple PDFs
      if (pdfFiles.length > 1) {
        return (
          <MultiDynamicPDFBlock
            files={pdfFiles.map(file => ({
              id: file.id,
              name: file.name,
              url: file.url,
              size: file.size,
              pages: file.pages,
              thumbnails: file.thumbnails
            }))}
            title={title}
            onDownload={(fileId: string) => {
              console.log(`Download PDF: ${fileId}`);
              onDownload?.();
            }}
            className="max-w-6xl mx-auto"
            projectId={projectId}
            settings={settings}
          />
        );
      }

      // Use DynamicPDFBlock for single PDF with better UX (thumbnail first + modal)
      if (pdfFiles.length === 1) {
        return (
          <DynamicPDFBlock
            url={pdfFiles[0].url}
            projectId={projectId}
            settings={settings}
            onDownload={onDownload}
          />
        );
      }

      // Should not reach here since single PDFs are handled above
      return null;
      
    case 'video':
      return (
        <VideoBlock
          title={title}
          url={files[0]?.url || ''}
          poster={files[0]?.thumbnailUrl}
          duration={metadata?.duration}
          onDownload={onDownload}
          metadata={metadata}
          projectId={projectId}
          settings={settings}
        />
      );
      
    case 'archive':
      // Convert FileMetadata to ArchiveFile format
      const archiveFiles = files.map(file => ({
        name: file.name,
        size: file.size,
        type: 'file' as const,
        fileType: getFileTypeCategory(file.name),
        modified: file.uploadedAt,
        url: file.url
      }));
      
      return (
        <ArchiveBlock
          title={title}
          files={archiveFiles}
          totalFiles={files.length}
          onDownload={onDownload}
          metadata={metadata}
          projectId={projectId}
          settings={settings}
        />
      );
      
    case 'mixed':
      // Handle mixed file types by separating them and rendering appropriate blocks
      if (!files) return null;
      
      const imageFiles = files.filter(file => getFileType(file.name, file.type) === 'gallery');
      const nonImageFiles = files.filter(file => getFileType(file.name, file.type) !== 'gallery');
      
      return (
        <div className="space-y-8">
          {/* Render image gallery if there are images */}
          {imageFiles.length > 0 && (
            <BlockRouter
              fileType="gallery"
              title={imageFiles.length === files.length ? title : `${title} - Images`}
              description={description}
              files={imageFiles}
              onDownload={onDownload}
              metadata={metadata}
            />
          )}
          
          {/* Render individual blocks for non-image files */}
          {nonImageFiles.map((file, index) => {
            const fileType = getFileType(file.name, file.type);
            return (
              <div key={`${fileType}-${index}-${file.name}`}>
                <BlockRouter
                  fileType={fileType}
                  title={file.name}
                  description={file.description}
                  files={[file]}
                  onDownload={onDownload}
                  metadata={metadata}
                />
              </div>
            );
          })}
        </div>
      );
      
    case 'presentation':
      // PowerPoint files are converted to PDF by the backend
      const presentationFile = files.find(f => 
        f.type?.includes('presentation') || 
        f.name?.toLowerCase().endsWith('.ppt') || 
        f.name?.toLowerCase().endsWith('.pptx')
      );
      
      if (presentationFile) {
        return (
          <DynamicPDFBlock
            url={presentationFile.url || '#'}
            projectId={projectId}
            settings={settings}
            onDownload={onDownload}
          />
        );
      }
      
      // If no specific presentation file found, use first file as PDF
      return (
        <DynamicPDFBlock
          url={files[0]?.url || '#'}
          projectId={projectId}
          settings={settings}
          onDownload={onDownload}
        />
      );
      
    case 'document':
      return (
        <DocumentBlock
          title={title}
          content={content}
          onDownload={onDownload}
          metadata={metadata}
          projectId={projectId}
          settings={settings}
        />
      );
      
    default:
      // Fallback to document block
      return (
        <DocumentBlock
          title={title}
          content={content}
          onDownload={onDownload}
          metadata={metadata}
          projectId={projectId}
          settings={settings}
        />
      );
  }
}

// Helper function to categorize file types for archive display
const getFileTypeCategory = (fileName: string): 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other' => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico'].includes(extension)) {
    return 'image';
  }
  
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp', 'ogv'].includes(extension)) {
    return 'video';
  }
  
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'].includes(extension)) {
    return 'audio';
  }
  
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'cab', 'iso'].includes(extension)) {
    return 'archive';
  }
  
  if (['txt', 'doc', 'docx', 'pdf', 'rtf', 'odt', 'md', 'html', 'css', 'js', 'ts', 'json', 'xml', 'csv'].includes(extension)) {
    return 'document';
  }
  
  return 'other';
};

// Export utility functions for external use
export { getFileTypeCategory };
