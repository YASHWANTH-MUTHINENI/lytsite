import React, { useState } from "react";
import { useEnhancedTheme } from "../../contexts/EnhancedThemeContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { CompactFeatures } from "../features/CompactFeatures";
import { 
  Download, 
  Eye,
  Archive,
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Share2,
  Heart,
  FileText,
  Image,
  Video,
  Music
} from "lucide-react";

interface ArchiveFile {
  name: string;
  size: string;
  type: 'file' | 'folder';
  fileType?: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  modified?: string;
  children?: ArchiveFile[];
  url?: string;
}

export interface ProjectSettings {
  enableFavorites?: boolean;
  enableComments?: boolean;
  enableApprovals?: boolean;
}

interface ArchiveBlockProps {
  title: string;
  files: ArchiveFile[];
  totalFiles: number;
  onDownload?: () => void;
  metadata?: {
    size: string;
    format: string;
    compressed?: string;
    ratio?: string;
  };
  projectId?: string;
  settings?: ProjectSettings;
}

const getFileIcon = (fileType?: string) => {
  switch (fileType) {
    case 'document': return <FileText className="w-4 h-4" />;
    case 'image': return <Image className="w-4 h-4" />;
    case 'video': return <Video className="w-4 h-4" />;
    case 'audio': return <Music className="w-4 h-4" />;
    case 'archive': return <Archive className="w-4 h-4" />;
    default: return <File className="w-4 h-4" />;
  }
};

const getFileColor = (theme: any, fileType?: string) => {
  switch (fileType) {
    case 'document': return theme.colors.info;
    case 'image': return theme.colors.success;
    case 'video': return theme.colors.warning;
    case 'audio': return theme.colors.accent;
    case 'archive': return theme.colors.textSecondary;
    default: return theme.colors.textMuted;
  }
};

export default function ArchiveBlock({ 
  title, 
  files, 
  totalFiles, 
  onDownload,
  metadata,
  projectId,
  settings
}: ArchiveBlockProps) {
  const { theme } = useEnhancedTheme();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'type' | 'date'>('name');
  const [isLiked, setIsLiked] = useState(false);

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const toggleFileSelection = (filePath: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(filePath)) {
      newSelected.delete(filePath);
    } else {
      newSelected.add(filePath);
    }
    setSelectedFiles(newSelected);
  };

  const renderFileTree = (fileList: ArchiveFile[], level: number = 0, parentPath: string = "") => {
    return fileList.map((file, index) => {
      const filePath = `${parentPath}/${file.name}`;
      const isExpanded = expandedFolders.has(filePath);
      const isSelected = selectedFiles.has(filePath);

      return (
        <div key={`${filePath}-${index}`} className="select-none">
          <div 
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
              isSelected ? 'ring-2 ring-offset-2' : ''
            }`}
            style={{ 
              paddingLeft: `${level * 20 + 12}px`,
              backgroundColor: isSelected ? theme.colors.primaryLight : theme.colors.surface,
              ...(level > 0 && { marginLeft: `${level * 8}px` })
            }}
            onClick={() => {
              if (file.type === 'folder') {
                toggleFolder(filePath);
              } else {
                toggleFileSelection(filePath);
              }
            }}
          >
            {/* Expand/Collapse Icon */}
            {file.type === 'folder' && (
              <div className="mr-2 w-4 h-4 flex items-center justify-center">
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" style={{ color: theme.colors.textSecondary }} />
                ) : (
                  <ChevronRight className="w-3 h-3" style={{ color: theme.colors.textSecondary }} />
                )}
              </div>
            )}

            {/* File/Folder Icon */}
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-sm"
              style={{ 
                backgroundColor: file.type === 'folder' 
                  ? theme.colors.warning + '20' 
                  : getFileColor(theme, file.fileType) + '20',
                color: file.type === 'folder' 
                  ? theme.colors.warning 
                  : getFileColor(theme, file.fileType)
              }}
            >
              {file.type === 'folder' ? (
                isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />
              ) : (
                getFileIcon(file.fileType)
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p 
                    className="font-medium truncate"
                    style={{ color: theme.colors.textPrimary }}
                  >
                    {file.name}
                  </p>
                  <div className="flex items-center space-x-3 text-xs mt-1">
                    <span style={{ color: theme.colors.textSecondary }}>
                      {file.size}
                    </span>
                    {file.modified && (
                      <span style={{ color: theme.colors.textMuted }}>
                        {file.modified}
                      </span>
                    )}
                    {file.fileType && file.type === 'file' && (
                      <Badge 
                        className="px-2 py-0.5 text-xs"
                        style={{ 
                          backgroundColor: getFileColor(theme, file.fileType) + '20',
                          color: getFileColor(theme, file.fileType)
                        }}
                      >
                        {file.fileType}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Instagram-style Features for Individual Files */}
                {file.type === 'file' && (
                  <div className="flex items-center space-x-2 ml-4">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CompactFeatures 
                        fileId={`archive-file-${file.name}-${index}`}
                        projectId={projectId || 'archive-project'}
                        settings={settings || {
                          enableFavorites: true,
                          enableComments: true,
                          enableApprovals: true
                        }}
                      />
                    </div>
                    {file.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          window.open(file.url, '_blank');
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        // Handle download single file
                      }}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Render children if folder is expanded */}
          {file.type === 'folder' && isExpanded && file.children && (
            <div className="ml-2">
              {renderFileTree(file.children, level + 1, filePath)}
            </div>
          )}
        </div>
      );
    });
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                style={{ backgroundColor: theme.colors.textSecondary }}
              >
                <Archive className="w-6 h-6" style={{ color: theme.colors.surface }} />
              </div>
              <Badge 
                className="px-3 py-1 text-sm font-medium"
                style={{ 
                  backgroundColor: theme.colors.textSecondary + '20',
                  color: theme.colors.textSecondary 
                }}
              >
                Archive • {totalFiles} files
              </Badge>
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
                <span style={{ color: theme.colors.textSecondary }}>
                  Format: {metadata.format}
                </span>
                {metadata.compressed && (
                  <span style={{ color: theme.colors.textSecondary }}>
                    Compressed: {metadata.compressed}
                  </span>
                )}
                {metadata.ratio && (
                  <span style={{ color: theme.colors.textSecondary }}>
                    Compression: {metadata.ratio}
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
              size="sm"
              onClick={onDownload}
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme.colors.textSecondary,
                color: theme.colors.surface
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Archive
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* File Browser */}
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
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-lg border text-sm min-w-[250px] focus:outline-none focus:ring-2 focus:ring-offset-1"
                      style={{
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        color: theme.colors.textPrimary
                      }}
                    />
                  </div>

                  {/* Sort Options */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                    style={{
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                      color: theme.colors.textPrimary
                    }}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="size">Sort by Size</option>
                    <option value="type">Sort by Type</option>
                    <option value="date">Sort by Date</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedFiles.size > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                    >
                      Download Selected ({selectedFiles.size})
                    </Button>
                  )}
                </div>
              </div>

              {/* File List */}
              <div className="max-h-[600px] overflow-y-auto">
                <div className="p-4 space-y-1">
                  {searchQuery ? (
                    // Show filtered results
                    filteredFiles.length > 0 ? (
                      filteredFiles.map((file, index) => (
                        <div key={index}>
                          {/* Simplified file display for search results */}
                          <div 
                            className="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
                            style={{ backgroundColor: theme.colors.backgroundSecondary }}
                            onClick={() => toggleFileSelection(file.name)}
                          >
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-sm"
                              style={{ 
                                backgroundColor: getFileColor(theme, file.fileType) + '20',
                                color: getFileColor(theme, file.fileType)
                              }}
                            >
                              {getFileIcon(file.fileType)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium" style={{ color: theme.colors.textPrimary }}>
                                {file.name}
                              </p>
                              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                                {file.size}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Search className="w-12 h-12 mx-auto mb-4" style={{ color: theme.colors.textMuted }} />
                        <p style={{ color: theme.colors.textSecondary }}>
                          No files found matching "{searchQuery}"
                        </p>
                      </div>
                    )
                  ) : (
                    // Show full file tree
                    <div className="space-y-1">
                      {renderFileTree(files)}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Archive Info */}
            <Card style={{ backgroundColor: theme.colors.surface }}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="w-5 h-5" style={{ color: theme.colors.primary }} />
                  <h3 className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                    Archive Info
                  </h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Files:</span>
                    <span style={{ color: theme.colors.textPrimary }}>{totalFiles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Size:</span>
                    <span style={{ color: theme.colors.textPrimary }}>{metadata?.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Format:</span>
                    <span style={{ color: theme.colors.textPrimary }}>{metadata?.format}</span>
                  </div>
                  {metadata?.compressed && (
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Compressed:</span>
                      <span style={{ color: theme.colors.textPrimary }}>{metadata.compressed}</span>
                    </div>
                  )}
                  {metadata?.ratio && (
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Ratio:</span>
                      <span style={{ color: theme.colors.textPrimary }}>{metadata.ratio}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selection Info */}
            {selectedFiles.size > 0 && (
              <Card style={{ backgroundColor: theme.colors.surface }}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4" style={{ color: theme.colors.textPrimary }}>
                    Selected Files
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Count:</span>
                      <span style={{ color: theme.colors.textPrimary }}>{selectedFiles.size}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-xl"
                      onClick={() => setSelectedFiles(new Set())}
                    >
                      Clear Selection
                    </Button>
                    <Button
                      size="sm"
                      className="w-full rounded-xl"
                      style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.surface
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Selected
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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
                    onClick={() => {
                      setExpandedFolders(new Set(files.map(f => f.name)));
                    }}
                  >
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Expand All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-xl"
                    onClick={() => setExpandedFolders(new Set())}
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    Collapse All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-xl"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter by Type
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
