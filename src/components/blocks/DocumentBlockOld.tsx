import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
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
}

export default function DocumentBlock({ 
  title, 
  content, 
  onDownload,
  metadata 
}: DocumentBlockProps) {
  const { theme } = useTheme();
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
      className="py-8 sm:py-12 px-4 sm:px-6 pb-12 sm:pb-20"
      style={{ backgroundColor: theme.colors.backgroundSecondary }}
    >
      <div className="max-w-6xl mx-auto">
        
        {!showInlinePreview ? (
          // Card View - Default State
          <div className="grid md:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Document Preview Card */}
            <div className="md:col-span-8">
              <Card className="overflow-hidden shadow-xl border-0" style={{ backgroundColor: theme.colors.surface }}>
                
                {/* Card Header */}
                <div className="p-6 border-b" style={{ borderColor: theme.colors.border }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: getLanguageColor(metadata?.language) }}
                      >
                        <FileText className="w-6 h-6" style={{ color: theme.colors.surface }} />
                      </div>
                      <div>
                        <h2 
                          className="text-xl font-bold mb-1"
                          style={{ color: theme.colors.textPrimary }}
                        >
                          {title}
                        </h2>
                        <div className="flex items-center space-x-3 text-sm">
                          <Badge 
                            className="px-2 py-1"
                            style={{ 
                              backgroundColor: theme.colors.info + '20',
                              color: theme.colors.info 
                            }}
                          >
                            {metadata?.format || 'TEXT'}
                          </Badge>
                          {metadata?.language && (
                            <Badge 
                              className="px-2 py-1"
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
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsLiked(!isLiked)}
                        className="rounded-lg"
                        style={{ 
                          borderColor: theme.colors.border,
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.textPrimary
                        }}
                      >
                        <Heart 
                          className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`}
                          style={{ color: isLiked ? theme.colors.error : theme.colors.textSecondary }}
                        />
                        {isLiked ? 'Liked' : 'Like'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onDownload}
                        className="rounded-lg"
                        style={{ 
                          borderColor: theme.colors.info,
                          backgroundColor: theme.colors.info + '10',
                          color: theme.colors.info
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="p-6">
                  <div 
                    className="relative rounded-lg p-4 mb-6 min-h-[300px] border border-dashed cursor-pointer transition-all hover:border-solid"
                    style={{ 
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border
                    }}
                    onClick={() => setShowInlinePreview(true)}
                  >
                    {/* Preview Content */}
                    <div className="space-y-3">
                      {content.split('\n').slice(0, 12).map((line, index) => (
                        <div 
                          key={index}
                          className="flex text-sm opacity-70 hover:opacity-100 transition-opacity"
                        >
                          <span 
                            className="w-8 text-right pr-3 select-none"
                            style={{ color: theme.colors.textMuted }}
                          >
                            {index + 1}
                          </span>
                          <span 
                            className="font-mono"
                            style={{ color: theme.colors.textPrimary }}
                          >
                            {line.length > 80 ? line.substring(0, 80) + '...' : line}
                          </span>
                        </div>
                      ))}
                      {content.split('\n').length > 12 && (
                        <div className="text-center pt-4">
                          <span 
                            className="text-sm italic"
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
                        className="shadow-xl"
                        style={{
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.surface
                        }}
                      >
                        <BookOpen className="w-5 h-5 mr-2" />
                        Open Preview
                      </Button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowInlinePreview(true)}
                      className="flex-1 sm:flex-none"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(content)}
                      className="flex-1 sm:flex-none"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="md:col-span-4 space-y-6">
              
              {/* Document Stats */}
              <Card style={{ backgroundColor: theme.colors.surface }}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileSearch className="w-5 h-5" style={{ color: theme.colors.primary }} />
                    <h3 className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                      Document Info
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div>
                        <span className="block" style={{ color: theme.colors.textMuted }}>Format</span>
                        <span className="font-medium" style={{ color: theme.colors.textPrimary }}>
                          {metadata?.format || 'TEXT'}
                        </span>
                      </div>
                      <div>
                        <span className="block" style={{ color: theme.colors.textMuted }}>Size</span>
                        <span className="font-medium" style={{ color: theme.colors.textPrimary }}>
                          {metadata?.size}
                        </span>
                      </div>
                      {metadata?.lines && (
                        <div>
                          <span className="block" style={{ color: theme.colors.textMuted }}>Lines</span>
                          <span className="font-medium" style={{ color: theme.colors.textPrimary }}>
                            {metadata.lines.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {metadata?.words && (
                        <div>
                          <span className="block" style={{ color: theme.colors.textMuted }}>Words</span>
                          <span className="font-medium" style={{ color: theme.colors.textPrimary }}>
                            {metadata.words.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {metadata?.characters && (
                        <div>
                          <span className="block" style={{ color: theme.colors.textMuted }}>Characters</span>
                          <span className="font-medium" style={{ color: theme.colors.textPrimary }}>
                            {metadata.characters.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {metadata?.language && (
                        <div>
                          <span className="block" style={{ color: theme.colors.textMuted }}>Language</span>
                          <Badge 
                            className="text-xs"
                            style={{ 
                              backgroundColor: getLanguageColor(metadata.language) + '20',
                              color: getLanguageColor(metadata.language)
                            }}
                          >
                            {metadata.language.toUpperCase()}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card style={{ backgroundColor: theme.colors.surface }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4" style={{ color: theme.colors.textPrimary }}>
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowInlinePreview(true)}
                    >
                      <BookOpen className="w-4 h-4 mr-3" />
                      Full Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={onDownload}
                    >
                      <Download className="w-4 h-4 mr-3" />
                      Download File
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigator.clipboard.writeText(content)}
                    >
                      <Copy className="w-4 h-4 mr-3" />
                      Copy Content
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <Share2 className="w-4 h-4 mr-3" />
                      Share Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Inline Preview Mode
          <div className="space-y-6">
            
            {/* Preview Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowInlinePreview(false)}
                  className="rounded-lg"
                >
                  ← Back to Card
                </Button>
                <div>
                  <h2 
                    className="text-2xl font-bold"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {title}
                  </h2>
                  <p style={{ color: theme.colors.textMuted }}>
                    Full document preview
                  </p>
                </div>
              </div>
            </div>

            {/* Full Document Viewer */}
            <Card className="overflow-hidden shadow-xl" style={{ backgroundColor: theme.colors.surface }}>
              
              {/* Toolbar */}
              <div 
                className="flex flex-col space-y-3 px-3 sm:px-6 py-3 sm:py-4 border-b sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
                style={{ 
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border
                }}
              >
                {/* View Mode Toggle */}
                <div className="flex rounded-lg border overflow-hidden"
                     style={{ borderColor: theme.colors.border }}>
                  <Button
                    variant={viewMode === 'preview' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('preview')}
                    className="rounded-none px-4"
                    style={viewMode === 'preview' ? {
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.surface
                    } : {}}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant={viewMode === 'raw' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode('raw')}
                    className="rounded-none px-4"
                    style={viewMode === 'raw' ? {
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.surface
                    } : {}}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Raw
                  </Button>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                    disabled={fontSize <= 10}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span 
                    className="text-sm font-mono min-w-[3rem] text-center"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {fontSize}px
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                    disabled={fontSize >= 24}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[600px] overflow-auto">
                {viewMode === 'preview' ? (
                  <div className="p-6">
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
                              className="select-none pr-4 text-right"
                              style={{ 
                                color: theme.colors.textMuted,
                                minWidth: '3rem'
                              }}
                            >
                              {index + 1}
                            </span>
                          )}
                          <span>{line}</span>
                        </div>
                      ))}
                    </pre>
                  </div>
                ) : (
                  <div className="p-6">
                    <textarea
                      value={content}
                      readOnly
                      className="w-full h-[500px] resize-none focus:outline-none"
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
    </section>
  );
}
