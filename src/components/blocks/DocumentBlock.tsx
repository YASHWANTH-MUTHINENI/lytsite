import React, { useState } from "react";
import { useEnhancedTheme } from "../../contexts/EnhancedThemeContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { CompactFeatures } from "../features/CompactFeatures";
import { 
  Download, 
  Share2, 
  Heart,
  FileText,
  Search,
  ZoomIn,
  ZoomOut,
  Copy,
  Eye,
  EyeOff,
  Maximize2,
  Type,
  FileSearch,
  Languages,
  BookOpen,
  Printer
} from "lucide-react";

export interface ProjectSettings {
  enableFavorites?: boolean;
  enableComments?: boolean;
  enableApprovals?: boolean;
}

interface DocumentBlockProps {
  title: string;
  content: string;
  onDownload?: () => void;
  metadata?: {
    size: string;
    format: string;
    encoding?: string;
    lines?: number;
    words?: number;
    characters?: number;
    language?: string;
  };
  projectId?: string;
  settings?: ProjectSettings;
}

export default function DocumentBlock({ 
  title, 
  content, 
  onDownload,
  metadata,
  projectId,
  settings
}: DocumentBlockProps) {
  const { theme } = useEnhancedTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [isLiked, setIsLiked] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wrapText, setWrapText] = useState(true);
  const [highlightSearch, setHighlightSearch] = useState(true);
  const [viewMode, setViewMode] = useState<'raw' | 'preview'>('preview');
  const [showInlinePreview, setShowInlinePreview] = useState(false);

  const lines = content.split('\n');
  const searchMatches = searchQuery ? 
    lines.map((line, index) => ({
      lineNumber: index + 1,
      line,
      matches: line.toLowerCase().includes(searchQuery.toLowerCase())
    })).filter(item => item.matches) : [];

  const highlightText = (text: string, query: string) => {
    if (!query || !highlightSearch) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span 
          key={index}
          className="px-1 py-0.5 rounded font-medium"
          style={{ 
            backgroundColor: theme.colors.warning + '40',
            color: theme.colors.textPrimary
          }}
        >
          {part}
        </span>
      ) : part
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
  };

  const getLanguageColor = (lang?: string) => {
    switch (lang?.toLowerCase()) {
      case 'javascript':
      case 'js': return '#f7df1e';
      case 'typescript':
      case 'ts': return '#3178c6';
      case 'python': return '#306998';
      case 'java': return '#ed8b00';
      case 'html': return '#e34f26';
      case 'css': return '#1572b6';
      case 'json': return '#000000';
      case 'markdown':
      case 'md': return '#083fa1';
      case 'xml': return '#0060ac';
      case 'sql': return '#336791';
      default: return theme.colors.textSecondary;
    }
  };

  return (
    <section 
      className="py-6 sm:py-12 px-3 sm:px-6 pb-8 sm:pb-20"
      style={{ backgroundColor: theme.colors.backgroundSecondary }}
    >
      <div className="max-w-6xl mx-auto">
        
        {!showInlinePreview ? (
          // Card View - Default State
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Document Preview Card */}
            <div className="lg:col-span-8 order-1">
              <Card className="overflow-hidden shadow-xl border-0" style={{ backgroundColor: theme.colors.surface }}>
                
                {/* Card Header */}
                <div className="p-3 sm:p-6 border-b" style={{ borderColor: theme.colors.border }}>
                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 sm:gap-3">
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                        style={{ backgroundColor: getLanguageColor(metadata?.language) }}
                      >
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.colors.surface }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 
                          className="text-base sm:text-xl font-bold mb-2 sm:mb-1 leading-tight"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          {title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-xs sm:text-sm">
                          <Badge 
                            className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs"
                            style={{ 
                              backgroundColor: theme.colors.info + '20',
                              color: theme.colors.info 
                            }}
                          >
                            Text Document
                          </Badge>
                          {metadata?.language && (
                            <Badge 
                              className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs"
                              style={{ 
                                backgroundColor: getLanguageColor(metadata.language) + '20',
                                color: getLanguageColor(metadata.language)
                              }}
                            >
                              {metadata.language.toUpperCase()}
                            </Badge>
                          )}
                          <span style={{ color: theme.colors.textMuted }}>
                            {metadata?.size}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsLiked(!isLiked)}
                        className="rounded-lg px-2 sm:px-3 h-8"
                        style={{ 
                          borderColor: theme.colors.border,
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.textPrimary
                        }}
                      >
                        <Heart 
                          className={`w-4 h-4 sm:mr-1 ${isLiked ? 'fill-current' : ''}`}
                          style={{ color: isLiked ? theme.colors.error : theme.colors.textSecondary }}
                        />
                        <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onDownload}
                        className="rounded-lg px-2 sm:px-3 h-8"
                        style={{ 
                          borderColor: theme.colors.info,
                          backgroundColor: theme.colors.info + '10',
                          color: theme.colors.info
                        }}
                      >
                        <Download className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="p-3 sm:p-6">
                  <div 
                    className="relative rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 min-h-[240px] sm:min-h-[300px] border border-dashed cursor-pointer transition-all hover:border-solid"
                    style={{ 
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border
                    }}
                    onClick={() => setShowInlinePreview(true)}
                  >
                    {/* Preview Content */}
                    <div className="space-y-1.5 sm:space-y-3">
                      {content.split('\n').slice(0, 12).map((line, index) => (
                        <div 
                          key={index}
                          className="flex text-xs sm:text-sm opacity-70 hover:opacity-100 transition-opacity"
                        >
                          <span 
                            className="w-5 sm:w-8 text-right pr-2 sm:pr-3 select-none flex-shrink-0"
                            style={{ color: theme.colors.textMuted }}
                          >
                            {index + 1}
                          </span>
                          <span 
                            className="font-mono leading-relaxed min-w-0 break-words"
                            style={{ color: theme.colors.textPrimary }}
                          >
                            {line.length > 50 ? line.substring(0, 50) + '...' : line || ' '}
                          </span>
                        </div>
                      ))}
                      {content.split('\n').length > 12 && (
                        <div className="text-center pt-2 sm:pt-4">
                          <span 
                            className="text-xs sm:text-sm italic"
                            style={{ color: theme.colors.textMuted }}
                          >
                            +{content.split('\n').length - 12} more lines...
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg pointer-events-none" />
                    
                    {/* Click to Preview */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/5 rounded-lg">
                      <Button
                        size="lg"
                        className="shadow-xl gap-2"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.surface
                        }}
                      >
                        <BookOpen className="w-5 h-5" />
                        <span className="hidden sm:inline">Open Preview</span>
                        <span className="sm:hidden">Preview</span>
                      </Button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowInlinePreview(true)}
                      className="flex-1 sm:flex-none text-xs sm:text-sm min-w-0 h-8"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(content)}
                      className="flex-1 sm:flex-none text-xs sm:text-sm min-w-0 h-8"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:flex-none text-xs sm:text-sm min-w-0 h-8"
                    >
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-4 order-2">
              
              {/* Quick Actions */}
              <Card style={{ backgroundColor: theme.colors.surface }}>
                <CardContent className="p-3 sm:p-6">
                  <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: theme.colors.textPrimary }}>
                    Quick Actions
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-sm py-2.5 h-10 hover:scale-[1.02] transition-transform"
                      onClick={() => setShowInlinePreview(true)}
                      style={{
                        borderColor: theme.colors.primary + '40',
                        backgroundColor: theme.colors.primary + '05'
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-3 flex-shrink-0" style={{ color: theme.colors.primary }} />
                      <span style={{ color: theme.colors.textPrimary }}>Full Preview</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-sm py-2.5 h-10 hover:scale-[1.02] transition-transform"
                      onClick={onDownload}
                      style={{
                        borderColor: theme.colors.success + '40',
                        backgroundColor: theme.colors.success + '05'
                      }}
                    >
                      <Download className="w-4 h-4 mr-3 flex-shrink-0" style={{ color: theme.colors.success }} />
                      <span style={{ color: theme.colors.textPrimary }}>Download File</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-sm py-2.5 h-10 hover:scale-[1.02] transition-transform"
                      onClick={() => {
                        navigator.clipboard.writeText(content);
                        // You could add a toast notification here
                      }}
                      style={{
                        borderColor: theme.colors.info + '40',
                        backgroundColor: theme.colors.info + '05'
                      }}
                    >
                      <Copy className="w-4 h-4 mr-3 flex-shrink-0" style={{ color: theme.colors.info }} />
                      <span style={{ color: theme.colors.textPrimary }}>Copy Content</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-sm py-2.5 h-10 hover:scale-[1.02] transition-transform"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: title,
                            text: `Check out this document: ${title}`,
                            url: window.location.href
                          });
                        } else {
                          // Fallback for browsers that don't support Web Share API
                          navigator.clipboard.writeText(window.location.href);
                        }
                      }}
                      style={{
                        borderColor: theme.colors.warning + '40',
                        backgroundColor: theme.colors.warning + '05'
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-3 flex-shrink-0" style={{ color: theme.colors.warning }} />
                      <span style={{ color: theme.colors.textPrimary }}>Share Document</span>
                    </Button>
                    
                    {/* Additional Quick Actions */}
                    <div className="border-t pt-3 mt-3" style={{ borderColor: theme.colors.border }}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-xs py-2 h-8 opacity-75 hover:opacity-100"
                        onClick={() => window.print()}
                      >
                        <Printer className="w-3 h-3 mr-3 flex-shrink-0" style={{ color: theme.colors.textMuted }} />
                        <span style={{ color: theme.colors.textMuted }}>Print Document</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-xs py-2 h-8 opacity-75 hover:opacity-100"
                        onClick={() => setIsLiked(!isLiked)}
                      >
                        <Heart 
                          className={`w-3 h-3 mr-3 flex-shrink-0 ${isLiked ? 'fill-current' : ''}`}
                          style={{ color: isLiked ? theme.colors.error : theme.colors.textMuted }}
                        />
                        <span style={{ color: theme.colors.textMuted }}>
                          {isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
                        </span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Inline Preview Mode
          <div className="space-y-6">
            
            {/* Preview Header */}
            <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8">
                <Button
                  variant="outline"
                  onClick={() => setShowInlinePreview(false)}
                  className="rounded-lg w-fit px-4 py-2 h-10"
                  size="sm"
                >
                  ← Back to Card
                </Button>
                <div className="min-w-0">
                  <h2 
                    className="text-xl sm:text-2xl font-bold leading-tight mb-1"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {title}
                  </h2>
                  <p className="text-sm" style={{ color: theme.colors.textMuted }}>
                    Full document preview
                  </p>
                </div>
              </div>
            </div>

            {/* Full Document Viewer */}
            <Card className="overflow-hidden shadow-xl" style={{ backgroundColor: theme.colors.surface }}>
              
              {/* Toolbar */}
              <div 
                className="flex flex-col space-y-3 px-3 sm:px-6 py-3 sm:py-4 border-b lg:flex-row lg:items-center lg:justify-between lg:space-y-0"
                style={{ 
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border
                }}
              >
                {/* View Mode Toggle */}
                <div className="flex rounded-lg border overflow-hidden w-full lg:w-auto"
                     style={{ borderColor: theme.colors.border }}>
                  <Button
                    variant={viewMode === 'preview' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('preview')}
                    className="rounded-none px-3 sm:px-4 flex-1 lg:flex-none text-xs sm:text-sm h-8"
                    style={viewMode === 'preview' ? {
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.surface
                    } : {}}
                  >
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant={viewMode === 'raw' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('raw')}
                    className="rounded-none px-3 sm:px-4 flex-1 lg:flex-none text-xs sm:text-sm h-8"
                    style={viewMode === 'raw' ? {
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.surface
                    } : {}}
                  >
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Raw
                  </Button>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between lg:justify-start lg:space-x-2">
                  <span className="text-xs sm:text-sm text-center" style={{ color: theme.colors.textMuted }}>
                    Font Size
                  </span>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                      disabled={fontSize <= 10}
                      className="p-1 sm:p-2 h-8 w-8"
                    >
                      <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <span 
                      className="text-xs sm:text-sm font-mono min-w-[2.5rem] sm:min-w-[3rem] text-center px-2 py-1 rounded"
                      style={{ 
                        color: theme.colors.textSecondary,
                        backgroundColor: theme.colors.background
                      }}
                    >
                      {fontSize}px
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                      disabled={fontSize >= 24}
                      className="p-1 sm:p-2 h-8 w-8"
                    >
                      <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-auto">
                {viewMode === 'preview' ? (
                  <div className="p-3 sm:p-6">
                    <pre 
                      className={`${wrapText ? 'whitespace-pre-wrap' : 'whitespace-pre'} leading-relaxed overflow-x-auto`}
                      style={{ 
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        fontSize: `${fontSize}px`,
                        color: theme.colors.textPrimary,
                        backgroundColor: 'transparent'
                      }}
                    >
                      {content.split('\n').map((line, index) => (
                        <div key={index} className="flex">
                          {showLineNumbers && (
                            <span 
                              className="select-none pr-2 sm:pr-4 text-right flex-shrink-0"
                              style={{ 
                                color: theme.colors.textMuted,
                                minWidth: '1.5rem',
                                fontSize: `${Math.max(10, fontSize - 2)}px`
                              }}
                            >
                              {index + 1}
                            </span>
                          )}
                          <span className="min-w-0 break-words flex-1">{line}</span>
                        </div>
                      ))}
                    </pre>
                  </div>
                ) : (
                  <div className="p-3 sm:p-6">
                    <textarea
                      value={content}
                      readOnly
                      className="w-full h-[350px] sm:h-[450px] lg:h-[500px] resize-none focus:outline-none"
                      style={{
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        fontSize: `${fontSize}px`,
                        color: theme.colors.textPrimary,
                        backgroundColor: 'transparent',
                        border: 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Instagram-style integrated features */}
      {projectId && settings && (
        <CompactFeatures
          fileId="document"
          projectId={projectId}
          settings={settings}
          onDownload={onDownload}
        />
      )}
    </section>
  );
}
