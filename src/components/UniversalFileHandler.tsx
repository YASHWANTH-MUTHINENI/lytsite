import React, { useState } from 'react';
import { useFileManager, FileType, ProcessedFile } from '../hooks/useFileManager';
import DynamicPDFBlock from './blocks/DynamicPDFBlock';
import SingleImageBlock from './blocks/SingleImageBlock';
import DocumentBlock from './blocks/DocumentBlock';
import VideoBlock from './blocks/VideoBlock';
import MultiDynamicPDFBlock from './blocks/MultiDynamicPDFBlock';
import FileHandlingBlock from './blocks/FileHandlingBlock';
import ArchiveBlock from './blocks/ArchiveBlock';
import GalleryBlock from './blocks/GalleryBlock';

interface ProjectSettings {
  enableFavorites?: boolean;
  enableComments?: boolean;
  enableApprovals?: boolean;
}

interface UniversalFileHandlerProps {
  files: File[];
  onClose?: () => void;
  title?: string;
  showUploadProgress?: boolean;
  projectId?: string;
  settings?: ProjectSettings;
}

export const UniversalFileHandler: React.FC<UniversalFileHandlerProps> = ({
  files,
  onClose,
  title = 'Files',
  showUploadProgress = true,
  projectId,
  settings
}) => {
  const {
    files: processedFiles,
    isProcessing,
    processingProgress,
    currentProcessingFile,
    errors,
    primaryFileType,
    filesByType,
  } = useFileManager({
    files,
    generateThumbnails: true,
    extractContent: true
  });

  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  // If still processing, show progress
  if (isProcessing && showUploadProgress) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="mb-2">
          <p>Processing {currentProcessingFile || 'files'}...</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{processingProgress}% complete</p>
        </div>
      </div>
    );
  }

  // Helper to get active file
  const getActiveFile = (): ProcessedFile | null => {
    if (!activeFileId && processedFiles.length > 0) {
      return processedFiles[0];
    }
    return processedFiles.find(f => f.id === activeFileId) || null;
  };

  const activeFile = getActiveFile();

  // Show specific handlers based on primary type
  const renderFileHandler = () => {
    // Special case: single file
    if (processedFiles.length === 1) {
      const file = processedFiles[0];
      switch (file.type) {
        case 'pdf':
          return (
            <DynamicPDFBlock 
              url={file.url}
              projectId={projectId}
              settings={settings}
            />
          );
        case 'image':
          return (
            <SingleImageBlock 
              image={file.url} 
              title={file.name}
              metadata={{
                size: file.size,
                format: file.extension.toUpperCase(),
                dimensions: file.metadata.dimensions || 'Unknown'
              }}
              projectId={projectId}
              settings={settings}
            />
          );
        case 'document':
          return (
            <DocumentBlock 
              title={file.name} 
              content={file.metadata.content || 'Document content not available for preview.'} 
              metadata={{
                size: file.size,
                format: file.extension.toUpperCase(),
                encoding: 'UTF-8'
              }}
              projectId={projectId}
              settings={settings}
            />
          );
        case 'video':
          return (
            <VideoBlock 
              url={file.url} 
              title={file.name}
              metadata={{
                size: file.size,
                format: file.extension.toUpperCase()
              }}
              projectId={projectId}
              settings={settings}
            />
          );
        default:
          return <FileHandlingBlock 
            files={[{
              id: file.id,
              type: file.type as any,
              name: file.name,
              size: file.size,
              url: file.url,
              thumbnails: file.thumbnails
            }]} 
            projectId={projectId}
            settings={settings}
          />;
      }
    }

    // Multiple files of same type
    switch (primaryFileType) {
      case 'pdf':
        return <MultiDynamicPDFBlock 
          files={filesByType.pdf.map(f => ({
            id: f.id || f.name,
            name: f.name,
            url: f.url,
            size: f.size,
            pages: (f as any).pages
          }))} 
          projectId={projectId}
          settings={settings}
        />;
      case 'image':
        return (
          <GalleryBlock 
            title="Image Gallery"
            files={filesByType.image.map(f => ({ 
              id: f.id, 
              name: f.name, 
              url: f.url 
            }))} 
            totalImages={filesByType.image.length}
            metadata={{
              size: filesByType.image.reduce((acc, f) => {
                const sizeMB = parseFloat(f.size.replace(' MB', ''));
                return acc + (isNaN(sizeMB) ? 0 : sizeMB);
              }, 0).toFixed(1) + ' MB',
              format: 'Mixed Images'
            }}
            projectId={projectId}
            settings={settings}
          />
        );
      case 'mixed':
        // Handle mixed file types with a specialized view
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Your Files ({processedFiles.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {processedFiles.map(file => (
                  <div 
                    key={file.id} 
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${activeFileId === file.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-400'}`}
                    onClick={() => setActiveFileId(file.id)}
                  >
                    <div className="aspect-square bg-gray-100 rounded flex items-center justify-center mb-2 overflow-hidden">
                      {file.coverImage ? (
                        <img src={file.coverImage} alt={file.name} className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-4xl text-gray-400">
                          {file.type === 'pdf' && '📄'}
                          {file.type === 'image' && '🖼️'}
                          {file.type === 'document' && '📝'}
                          {file.type === 'presentation' && '🎭'}
                          {file.type === 'spreadsheet' && '📊'}
                          {file.type === 'archive' && '🗄️'}
                          {file.type === 'video' && '🎬'}
                          {file.type === 'audio' && '🎵'}
                          {file.type === 'other' && '📎'}
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium truncate">{file.name}</h3>
                    <p className="text-xs text-gray-500">{file.size} • {file.extension.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview section for the selected file */}
            {activeFile && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Preview: {activeFile.name}</h3>
                <div className="bg-white rounded-lg overflow-hidden">
                  {activeFile.type === 'pdf' && (
                    <DynamicPDFBlock 
                      url={activeFile.url}
                    />
                  )}
                  {activeFile.type === 'image' && (
                    <SingleImageBlock 
                      image={activeFile.url} 
                      title={activeFile.name}
                      metadata={{
                        size: activeFile.size,
                        format: activeFile.extension.toUpperCase(),
                        dimensions: activeFile.metadata.dimensions || 'Unknown'
                      }}
                    />
                  )}
                  {activeFile.type === 'document' && (
                    <DocumentBlock 
                      title={activeFile.name} 
                      content={activeFile.metadata.content || 'Document content not available for preview.'}
                      metadata={{
                        size: activeFile.size,
                        format: activeFile.extension.toUpperCase(),
                        encoding: 'UTF-8'
                      }}
                    />
                  )}
                  {activeFile.type === 'video' && (
                    <VideoBlock 
                      url={activeFile.url} 
                      title={activeFile.name}
                      metadata={{
                        size: activeFile.size,
                        format: activeFile.extension.toUpperCase()
                      }}
                    />
                  )}
                  {(['presentation', 'spreadsheet', 'archive', 'audio', 'other'].includes(activeFile.type)) && (
                    <div className="p-8 text-center">
                      <div className="text-4xl mb-4">
                        {activeFile.type === 'presentation' && '🎭'}
                        {activeFile.type === 'spreadsheet' && '📊'}
                        {activeFile.type === 'archive' && '🗄️'}
                        {activeFile.type === 'audio' && '🎵'}
                        {activeFile.type === 'other' && '📎'}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{activeFile.name}</h3>
                      <p className="text-gray-600 mb-4">{activeFile.size} • {activeFile.extension.toUpperCase()}</p>
                      <button
                        onClick={() => window.open(activeFile.url, '_blank')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                      >
                        Open File
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <FileHandlingBlock 
          files={processedFiles.map(file => ({
            ...file,
            type: file.type === 'presentation' ? 'document' as const : file.type as any
          }))} 
          projectId={projectId}
          settings={settings}
        />;
    }
  };

  // Show errors if any
  if (errors.length > 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Error Processing Files</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">The following errors occurred:</h3>
          <ul className="list-disc pl-5 mt-2">
            {errors.map((error, index) => (
              <li key={index} className="text-red-700">{error.error}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Render appropriate handler
  return (
    <div className="bg-white rounded-lg">
      {renderFileHandler()}
    </div>
  );
};

// Add a factory function for easy creation
export const createFileHandler = (files: File[], projectId?: string, settings?: ProjectSettings) => {
  return <UniversalFileHandler files={files} projectId={projectId} settings={settings} />;
};