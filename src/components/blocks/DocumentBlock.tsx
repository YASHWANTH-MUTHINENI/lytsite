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
      className="py-12 px-6 pb-20"
      style={{ backgroundColor: theme.colors.backgroundSecondary }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: getLanguageColor(metadata?.language) }}
              >
                <FileText className="w-6 h-6" style={{ color: theme.colors.surface }} />
              </div>
              <div className="flex items-center space-x-2">
                <Badge 
                  className="px-3 py-1 text-sm font-medium"
                  style={{ 
                    backgroundColor: theme.colors.info + '20',
                    color: theme.colors.info 
                  }}
                >
                  Document • {metadata?.format || 'TEXT'}
                </Badge>
                {metadata?.language && (
                  <Badge 
                    className="px-3 py-1 text-sm font-medium"
                    style={{ 
                      backgroundColor: getLanguageColor(metadata.language) + '20',
                      color: getLanguageColor(metadata.language)
                    }}
                  >
                    {metadata.language.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
            <h2 
              className="text-3xl lg:text-4xl font-bold mb-2"
              style={{ color: theme.colors.textPrimary }}
            >
              {title}
            </h2>
            {metadata && (
              <div className="flex flex-wrap gap-4 text-sm">
                <span style={{ color: theme.colors.textSecondary }}>
                  Size: {metadata.size}
                </span>
                {metadata.lines && (
                  <span style={{ color: theme.colors.textSecondary }}>
                    Lines: {metadata.lines.toLocaleString()}
                  </span>
                )}
                {metadata.words && (
                  <span style={{ color: theme.colors.textSecondary }}>
                    Words: {metadata.words.toLocaleString()}
                  </span>
                )}
                {metadata.characters && (
                  <span style={{ color: theme.colors.textSecondary }}>
                    Characters: {metadata.characters.toLocaleString()}
                  </span>
                )}
                {metadata.encoding && (
                  <span style={{ color: theme.colors.textSecondary }}>
                    Encoding: {metadata.encoding}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105"
              style={{ borderColor: theme.colors.border }}
            >
              <Heart 
                className={`w-4 h-4 mr-2 transition-colors ${isLiked ? 'fill-current' : ''}`}
                style={{ color: isLiked ? theme.colors.error : theme.colors.textSecondary }}
              />
              {isLiked ? 'Liked' : 'Like'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105"
              style={{ borderColor: theme.colors.border }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105"
              style={{ borderColor: theme.colors.border }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>

            <Button
              size="sm"
              onClick={onDownload}
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme.colors.info,
                color: theme.colors.surface
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Document Viewer */}
          <div className="lg:col-span-3">
            <Card 
              className="overflow-hidden shadow-lg"
              style={{ backgroundColor: theme.colors.surface }}
            >
              {/* Toolbar */}
              <div 
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{ 
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border
                }}
              >
                <div className="flex items-center space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <Search 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: theme.colors.textMuted }}
                    />
                    <input
                      type="text"
                      placeholder="Search in document..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-lg border text-sm min-w-[250px] focus:outline-none focus:ring-2 focus:ring-offset-1"
                      style={{
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        color: theme.colors.textPrimary,
                        focusRingColor: theme.colors.primary
                      }}
                    />
                    {searchQuery && (
                      <div className="absolute top-full left-0 mt-1 text-xs px-2 py-1 rounded bg-opacity-90"
                           style={{ 
                             backgroundColor: theme.colors.backgroundSecondary,
                             color: theme.colors.textSecondary 
                           }}>
                        {searchMatches.length} matches found
                      </div>
                    )}
                  </div>

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
                </div>

                <div className="flex items-center space-x-2">
                  {/* Font Size Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                      className="w-8 h-8 p-0 rounded"
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
                      className="w-8 h-8 p-0 rounded"
                      disabled={fontSize >= 24}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Display Options */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLineNumbers(!showLineNumbers)}
                    className="w-8 h-8 p-0 rounded"
                    title="Toggle line numbers"
                  >
                    <Type 
                      className="w-4 h-4" 
                      style={{ opacity: showLineNumbers ? 1 : 0.5 }}
                    />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setWrapText(!wrapText)}
                    className="w-8 h-8 p-0 rounded"
                    title="Toggle text wrapping"
                  >
                    <Maximize2 
                      className="w-4 h-4" 
                      style={{ 
                        opacity: wrapText ? 0.5 : 1,
                        transform: wrapText ? 'rotate(0deg)' : 'rotate(90deg)'
                      }}
                    />
                  </Button>
                </div>
              </div>

              {/* Document Content */}
              <div className="max-h-[700px] overflow-auto">
                {viewMode === 'preview' ? (
                  <div className="p-6">
                    <pre 
                      className={`${wrapText ? 'whitespace-pre-wrap' : 'whitespace-pre'} leading-relaxed`}
                      style={{ 
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                        fontSize: `${fontSize}px`,
                        color: theme.colors.textPrimary,
                        backgroundColor: 'transparent'
                      }}
                    >
                      {searchQuery ? (
                        lines.map((line, index) => (
                          <div key={index} className="flex">
                            {showLineNumbers && (
                              <span 
                                className="select-none pr-4 text-right"
                                style={{ 
                                  color: theme.colors.textMuted,
                                  minWidth: '3rem',
                                  backgroundColor: line.toLowerCase().includes(searchQuery.toLowerCase()) 
                                    ? theme.colors.warning + '10' : 'transparent'
                                }}
                              >
                                {index + 1}
                              </span>
                            )}
                            <span 
                              className={line.toLowerCase().includes(searchQuery.toLowerCase()) 
                                ? 'px-2 py-0.5 rounded-sm' : ''}
                              style={line.toLowerCase().includes(searchQuery.toLowerCase()) 
                                ? { backgroundColor: theme.colors.warning + '10' } : {}}
                            >
                              {highlightText(line, searchQuery)}
                            </span>
                          </div>
                        ))
                      ) : (
                        lines.map((line, index) => (
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
                        ))
                      )}
                    </pre>
                  </div>
                ) : (
                  <div className="p-6">
                    <textarea
                      value={content}
                      readOnly
                      className="w-full h-[600px] resize-none focus:outline-none"
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Info */}
            <Card style={{ backgroundColor: theme.colors.surface }}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <FileSearch className="w-5 h-5" style={{ color: theme.colors.primary }} />
                  <h3 className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                    Document Info
                  </h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Format:</span>
                    <span style={{ color: theme.colors.textPrimary }}>{metadata?.format || 'TEXT'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Size:</span>
                    <span style={{ color: theme.colors.textPrimary }}>{metadata?.size}</span>
                  </div>
                  {metadata?.lines && (
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Lines:</span>
                      <span style={{ color: theme.colors.textPrimary }}>{metadata.lines.toLocaleString()}</span>
                    </div>
                  )}
                  {metadata?.words && (
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Words:</span>
                      <span style={{ color: theme.colors.textPrimary }}>{metadata.words.toLocaleString()}</span>
                    </div>
                  )}
                  {metadata?.characters && (
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Characters:</span>
                      <span style={{ color: theme.colors.textPrimary }}>{metadata.characters.toLocaleString()}</span>
                    </div>
                  )}
                  {metadata?.encoding && (
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Encoding:</span>
                      <span style={{ color: theme.colors.textPrimary }}>{metadata.encoding}</span>
                    </div>
                  )}
                  {metadata?.language && (
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Language:</span>
                      <Badge 
                        className="px-2 py-0.5 text-xs"
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
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchQuery && searchMatches.length > 0 && (
              <Card style={{ backgroundColor: theme.colors.surface }}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4" style={{ color: theme.colors.textPrimary }}>
                    Search Results
                  </h3>
                  <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                    {searchMatches.slice(0, 10).map((match, index) => (
                      <div 
                        key={index}
                        className="p-2 rounded cursor-pointer transition-colors"
                        style={{ backgroundColor: theme.colors.backgroundSecondary }}
                        onClick={() => {
                          // Scroll to line logic would go here
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-xs" style={{ color: theme.colors.textMuted }}>
                            Line {match.lineNumber}
                          </span>
                        </div>
                        <p 
                          className="truncate"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          {match.line.substring(0, 50)}...
                        </p>
                      </div>
                    ))}
                    {searchMatches.length > 10 && (
                      <p className="text-center text-xs" style={{ color: theme.colors.textMuted }}>
                        +{searchMatches.length - 10} more matches
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Display Options */}
            <Card style={{ backgroundColor: theme.colors.surface }}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4" style={{ color: theme.colors.textPrimary }}>
                  Display Options
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      Line Numbers
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLineNumbers(!showLineNumbers)}
                      className="w-8 h-8 p-0"
                    >
                      {showLineNumbers ? (
                        <Eye className="w-4 h-4" style={{ color: theme.colors.success }} />
                      ) : (
                        <EyeOff className="w-4 h-4" style={{ color: theme.colors.textMuted }} />
                      )}
                    </Button>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      Word Wrap
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setWrapText(!wrapText)}
                      className="w-8 h-8 p-0"
                    >
                      {wrapText ? (
                        <Eye className="w-4 h-4" style={{ color: theme.colors.success }} />
                      ) : (
                        <EyeOff className="w-4 h-4" style={{ color: theme.colors.textMuted }} />
                      )}
                    </Button>
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
                      Highlight Search
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHighlightSearch(!highlightSearch)}
                      className="w-8 h-8 p-0"
                    >
                      {highlightSearch ? (
                        <Eye className="w-4 h-4" style={{ color: theme.colors.success }} />
                      ) : (
                        <EyeOff className="w-4 h-4" style={{ color: theme.colors.textMuted }} />
                      )}
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card style={{ backgroundColor: theme.colors.surface }}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4" style={{ color: theme.colors.textPrimary }}>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-xl"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-xl"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Document
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-xl"
                  >
                    <Languages className="w-4 h-4 mr-2" />
                    Translate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
