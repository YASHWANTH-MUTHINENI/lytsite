import React from "react";
import HeroBlock from "./HeroBlock";
import SingleImageBlock from "./SingleImageBlock";
import GridGalleryBlock from "./GridGalleryBlock";
import MasonryGalleryBlock from "./MasonryGalleryBlock";
import LightboxGalleryBlock from "./LightboxGalleryBlock";
import GalleryBlock from "./GalleryBlock";
import PDFBlock from "./PDFBlock";
import VideoBlock from "./VideoBlock";
import ArchiveBlock from "./ArchiveBlock";
import DocumentBlock from "./DocumentBlock";

export interface FileMetadata {
  name: string;
  size: string;
  type: string;
  url?: string;
  thumbnailUrl?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  description?: string;
}

interface BlockRouterProps {
  fileType: 'gallery' | 'pdf' | 'video' | 'archive' | 'document' | 'mixed';
  title: string;
  description?: string;
  files?: FileMetadata[];
  content?: string;
  onDownload?: () => void;
  metadata?: any;
}

// Utility function to determine file type from file extension or MIME type
export const getFileType = (fileName: string, mimeType?: string): 'gallery' | 'pdf' | 'video' | 'archive' | 'document' => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Image files
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico'].includes(extension) || 
      mimeType?.startsWith('image/')) {
    return 'gallery';
  }
  
  // PDF files
  if (extension === 'pdf' || mimeType === 'application/pdf') {
    return 'pdf';
  }
  
  // Video files
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp', 'ogv'].includes(extension) ||
      mimeType?.startsWith('video/')) {
    return 'video';
  }
  
  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'cab', 'iso'].includes(extension) ||
      ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'].includes(mimeType || '')) {
    return 'archive';
  }
  
  // Default to document for text-based files
  return 'document';
};

// Utility function to get multiple file types from a list of files
export const getMultipleFileTypes = (files: FileMetadata[]): 'gallery' | 'pdf' | 'video' | 'archive' | 'document' | 'mixed' => {
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
  metadata 
}: BlockRouterProps) {
  
  switch (fileType) {
    case 'gallery':
      // Convert FileMetadata to image URLs for gallery blocks
      const imageUrls = files.map(file => file.url || '').filter(url => url);
      const imageCount = imageUrls.length;
      
      // Single Image → Centered, large display with optional caption/credit
      if (imageCount === 1) {
        return (
          <SingleImageBlock
            title={title}
            image={imageUrls[0]}
            caption={description}
            credit={metadata?.credit}
            onDownload={onDownload}
            metadata={metadata}
          />
        );
      }
      
      // 2-6 Images → Clean Grid Gallery
      if (imageCount >= 2 && imageCount <= 6) {
        return (
          <GridGalleryBlock
            title={title}
            images={imageUrls}
            onDownload={onDownload}
            metadata={metadata}
          />
        );
      }
      
      // 7-20 Images → Masonry Layout
      if (imageCount >= 7 && imageCount <= 20) {
        return (
          <MasonryGalleryBlock
            title={title}
            images={imageUrls}
            onDownload={onDownload}
            metadata={metadata}
          />
        );
      }
      
      // 20+ Images → Lightbox + Lazy Loading
      if (imageCount > 20) {
        return (
          <LightboxGalleryBlock
            title={title}
            images={imageUrls}
            totalImages={files.length}
            onDownload={onDownload}
            metadata={metadata}
          />
        );
      }
      
      // Fallback to original GalleryBlock for edge cases
      return (
        <GalleryBlock
          title={title}
          images={imageUrls}
          totalImages={files.length}
          onDownload={onDownload}
          metadata={metadata}
        />
      );
      
    case 'pdf':
      return (
        <PDFBlock
          title={title}
          url={files[0]?.url || ''}
          pages={metadata?.pages || 1}
          thumbnails={metadata?.thumbnails || []}
          onDownload={onDownload}
          metadata={metadata}
        />
      );
      
    case 'video':
      return (
        <VideoBlock
          title={title}
          url={files[0]?.url || ''}
          poster={files[0]?.thumbnailUrl}
          duration={metadata?.duration}
          onDownload={onDownload}
          metadata={metadata}
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
      
    case 'document':
      return (
        <DocumentBlock
          title={title}
          content={content}
          onDownload={onDownload}
          metadata={metadata}
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
