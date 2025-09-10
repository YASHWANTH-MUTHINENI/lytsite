import React, { useState } from 'react';
import EnhancedPDFBlock from '../components/blocks/EnhancedPDFBlock';
import MultiPDFBlock from '../components/blocks/MultiPDFBlock';
import { usePDFManager } from '../hooks/usePDFManager';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Upload, FileText, Loader2 } from 'lucide-react';

export default function PDFThumbnailExample() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Use the PDF manager to process files and generate thumbnails
  const {
    files: processedFiles,
    isProcessing,
    processingProgress,
    currentProcessingFile,
    errors,
    totalPages,
    totalSize,
    pitchDecks,
    documents
  } = usePDFManager({
    files: selectedFiles,
    shouldGenerateThumbnails: true,
    extractCoverPage: true,
    autoDetectPitchDeck: true
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pdfFiles = files.filter(file => 
      file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );
    
    if (pdfFiles.length > 0) {
      setSelectedFiles(pdfFiles);
    } else {
      alert('Please select PDF files only');
    }
  };

  const handleDownload = (fileId: string) => {
    const file = processedFiles.find(f => f.id === fileId);
    if (file && file.url.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">PDF Thumbnail Generator Demo</h1>
        <p className="text-gray-600 mb-6">
          Upload PDF files to see automatic thumbnail generation and enhanced viewing experience
        </p>
      </div>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload PDF Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept="application/pdf,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
            />
            <label 
              htmlFor="pdf-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <FileText className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Choose PDF Files
                </p>
                <p className="text-sm text-gray-500">
                  Multiple files supported • Thumbnails auto-generated
                </p>
              </div>
            </label>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="font-medium text-blue-800">
                  Processing PDFs and generating thumbnails...
                </span>
              </div>
              <div className="text-sm text-blue-700 mb-2">
                Current: {currentProcessingFile}
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Processing Summary */}
          {processedFiles.length > 0 && !isProcessing && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{processedFiles.length}</div>
                  <div className="text-sm text-green-700">Files Processed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{totalPages}</div>
                  <div className="text-sm text-green-700">Total Pages</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{pitchDecks.length}</div>
                  <div className="text-sm text-green-700">Presentations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{totalSize}</div>
                  <div className="text-sm text-green-700">Total Size</div>
                </div>
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Processing Errors:</h4>
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-700">
                  {error.fileId}: {error.error}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDF Viewers */}
      {processedFiles.length > 0 && !isProcessing && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">PDF Viewers with Thumbnails</h2>
          
          {/* Multiple PDFs - Use MultiPDFBlock */}
          {processedFiles.length > 1 ? (
            <Card>
              <CardHeader>
                <CardTitle>Multiple PDF Viewer</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <MultiPDFBlock
                  files={processedFiles}
                  onDownload={handleDownload}
                  onShare={(fileId) => console.log('Share:', fileId)}
                  showThumbnails={true}
                  autoPlay={false}
                />
              </CardContent>
            </Card>
          ) : (
            /* Single PDF - Use EnhancedPDFBlock */
            processedFiles.map((file) => (
              <Card key={file.id}>
                <CardHeader>
                  <CardTitle>Enhanced PDF Viewer</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <EnhancedPDFBlock
                    title={file.name}
                    url={file.url}
                    pages={file.pages}
                    thumbnails={file.thumbnails}
                    onDownload={() => handleDownload(file.id)}
                    onShare={() => console.log('Share:', file.id)}
                    metadata={{
                      size: file.size,
                      author: file.metadata?.author,
                      created: file.metadata?.created
                    }}
                    showThumbnailFirst={true}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">🔄 Automatic Processing</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• PDF.js renders each page to canvas</li>
                <li>• First 5-10 pages converted to thumbnails</li>
                <li>• Cover page extracted automatically</li>
                <li>• Pitch decks auto-detected</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📱 Responsive Design</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Mobile: 70vh height for optimal scrolling</li>
                <li>• Desktop: 80vh height, max 800px</li>
                <li>• Thumbnail preview + expand modal</li>
                <li>• Touch-friendly navigation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
