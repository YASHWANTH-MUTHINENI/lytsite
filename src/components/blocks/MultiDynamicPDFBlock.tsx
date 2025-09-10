import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ChevronLeft, ChevronRight, Download, Eye, FileText, Grid, List } from 'lucide-react';
import DynamicPDFBlock from './DynamicPDFBlock';

interface MultiDynamicPDFBlockProps {
  files: Array<{
    id: string;
    name: string;
    url: string;
    size: string;
    pages?: number;
    thumbnails?: string[];
  }>;
  title?: string;
  className?: string;
  onDownload?: (fileId: string) => void;
}

type ViewMode = 'grid' | 'list' | 'preview';

export default function MultiDynamicPDFBlock({ 
  files, 
  title, 
  className = '',
  onDownload 
}: MultiDynamicPDFBlockProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const selectedFileData = selectedFile ? files.find(f => f.id === selectedFile) : null;

  // Navigate through files in preview mode
  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : files.length - 1;
    setCurrentIndex(newIndex);
    setSelectedFile(files[newIndex].id);
  };

  const goToNext = () => {
    const newIndex = currentIndex < files.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedFile(files[newIndex].id);
  };

  const openPreview = (fileId: string) => {
    const index = files.findIndex(f => f.id === fileId);
    setCurrentIndex(index);
    setSelectedFile(fileId);
    setViewMode('preview');
  };

  const closePreview = () => {
    setSelectedFile(null);
    setViewMode('grid');
  };

  if (viewMode === 'preview' && selectedFileData) {
    return (
      <div className={`w-full ${className}`}>
        {/* Preview Header */}
        <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={closePreview}
            >
              ← Back to Grid
            </Button>
            
            <div>
              <h3 className="font-semibold text-lg">{selectedFileData.name}</h3>
              <p className="text-sm text-muted-foreground">
                {currentIndex + 1} of {files.length} PDFs • {selectedFileData.size}
                {selectedFileData.pages && ` • ${selectedFileData.pages} pages`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={files.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={files.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {onDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(selectedFileData.id)}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* PDF Preview */}
        <DynamicPDFBlock
          url={selectedFileData.url}
          className="max-w-full"
        />
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{files.length} PDF{files.length !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span>
              {files.reduce((total, file) => {
                const pages = file.pages || 0;
                return total + pages;
              }, 0)} total pages
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <Card key={file.id} className="group hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate mb-1">{file.name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                      <span>{file.size}</span>
                      {file.pages && (
                        <>
                          <span>•</span>
                          <span>{file.pages} pages</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openPreview(file.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      
                      {onDownload && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDownload(file.id)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {files.map((file) => (
            <Card key={file.id} className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{file.name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <span>{file.size}</span>
                        {file.pages && (
                          <>
                            <span>•</span>
                            <span>{file.pages} pages</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPreview(file.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    
                    {onDownload && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownload(file.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
