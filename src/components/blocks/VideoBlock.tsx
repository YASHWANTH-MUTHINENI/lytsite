import React, { useState } from "react";
import { useEnhancedTheme } from "../../contexts/EnhancedThemeContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { CompactFeatures } from "../features/CompactFeatures";
import { 
  Download, 
  Eye,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  RotateCcw,
  Settings,
  Share2,
  Heart,
  Video as VideoIcon
} from "lucide-react";

export interface ProjectSettings {
  enableFavorites?: boolean;
  enableComments?: boolean;
  enableApprovals?: boolean;
}

interface VideoBlockProps {
  title: string;
  url: string;
  poster?: string;
  duration?: string;
  onDownload?: () => void;
  metadata?: {
    size: string;
    format: string;
    resolution?: string;
    bitrate?: string;
  };
  projectId?: string;
  settings?: ProjectSettings;
}

export default function VideoBlock({ 
  title, 
  url, 
  poster, 
  duration, 
  onDownload,
  metadata,
  projectId,
  settings
}: VideoBlockProps) {
  const { theme } = useEnhancedTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Mock duration in seconds for demo
  const totalDuration = 180; // 3 minutes

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (position: number) => {
    setCurrentTime(position);
  };

  const skipTime = (seconds: number) => {
    const newTime = Math.max(0, Math.min(totalDuration, currentTime + seconds));
    setCurrentTime(newTime);
  };

  const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <section 
      className="py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-6 pb-8 sm:pb-12 lg:pb-20"
      style={{ backgroundColor: theme.colors.backgroundSecondary }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6 lg:mb-0">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: theme.colors.warning }}
              >
                <VideoIcon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.colors.surface }} />
              </div>
              <Badge 
                className="px-3 py-1 text-sm font-medium"
                style={{ 
                  backgroundColor: theme.colors.warning + '20',
                  color: theme.colors.warning 
                }}
              >
                Video • {duration || formatTime(totalDuration)}
              </Badge>
            </div>
            <h2 
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2"
              style={{ color: theme.colors.textPrimary }}
            >
              {title}
            </h2>
            {metadata && (
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                <span style={{ color: theme.colors.textSecondary }}>
                  Size: {metadata.size}
                </span>
                <span style={{ color: theme.colors.textSecondary }}>
                  Format: {metadata.format}
                </span>
                {metadata.resolution && (
                  <span style={{ color: theme.colors.textSecondary }}>
                    Resolution: {metadata.resolution}
                  </span>
                )}
                {metadata.bitrate && (
                  <span style={{ color: theme.colors.textSecondary }}>
                    Bitrate: {metadata.bitrate}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
              style={{ borderColor: theme.colors.border }}
            >
              <Heart 
                className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transition-colors ${isLiked ? 'fill-current' : ''}`}
                style={{ color: isLiked ? theme.colors.error : theme.colors.textSecondary }}
              />
              <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
              style={{ borderColor: theme.colors.border }}
            >
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>

            <Button
              size="sm"
              onClick={onDownload}
              className="rounded-xl shadow-md transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
              style={{
                backgroundColor: theme.colors.warning,
                color: theme.colors.surface
              }}
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <Card 
              className="overflow-hidden shadow-2xl"
              style={{ backgroundColor: theme.colors.surface }}
            >
              {/* Video Container */}
              <div 
                className="relative aspect-video bg-black group cursor-pointer"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(isPlaying ? false : true)}
                onClick={handlePlayPause}
              >
                {/* Video Element Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {poster ? (
                    <img 
                      src={poster} 
                      alt="Video poster"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: theme.colors.backgroundTertiary }}
                    >
                      <VideoIcon className="w-24 h-24" style={{ color: theme.colors.textMuted }} />
                    </div>
                  )}
                </div>

                {/* Play Button Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: theme.colors.surface + '90' }}
                    >
                      <Play className="w-8 h-8 ml-1" style={{ color: theme.colors.primary }} />
                    </div>
                  </div>
                )}

                {/* Video Controls */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="p-6 space-y-4">
                    {/* Progress Bar */}
                    <div className="relative">
                      <div 
                        className="h-1 rounded-full cursor-pointer"
                        style={{ backgroundColor: theme.colors.overlay }}
                        onClick={(e: React.MouseEvent) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const position = (e.clientX - rect.left) / rect.width;
                          handleSeek(position * totalDuration);
                        }}
                      >
                        <div 
                          className="h-full rounded-full relative"
                          style={{ 
                            backgroundColor: theme.colors.primary,
                            width: `${(currentTime / totalDuration) * 100}%`
                          }}
                        >
                          <div 
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-lg"
                            style={{ backgroundColor: theme.colors.surface }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Play/Pause */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handlePlayPause();
                          }}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white hover:bg-white/20"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />}
                        </Button>

                        {/* Skip Buttons */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            skipTime(-10);
                          }}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-white hover:bg-white/20"
                        >
                          <SkipBack className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            skipTime(10);
                          }}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-white hover:bg-white/20"
                        >
                          <SkipForward className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>

                        {/* Volume Control - Hidden on very small screens */}
                        <div className="hidden sm:flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              setIsMuted(!isMuted);
                            }}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full text-white hover:bg-white/20"
                          >
                            {isMuted || volume === 0 ? <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" /> : <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                          </Button>
                          
                          <div className="w-16 sm:w-20 hidden md:block">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={isMuted ? 0 : volume}
                              onChange={(e) => handleVolumeChange(Number(e.target.value))}
                              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                              onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        {/* Time Display - Hidden on very small screens */}
                        <div className="text-xs sm:text-sm font-mono hidden sm:block">
                          {formatTime(currentTime)} / {formatTime(totalDuration)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 sm:space-x-2">
                        {/* Playback Speed - Hidden on mobile */}
                        <div className="relative group hidden sm:block">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 text-xs"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          >
                            {playbackSpeed}x
                          </Button>
                          <div className="absolute bottom-full mb-2 right-0 bg-black/90 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex flex-col space-y-1">
                              {playbackSpeeds.map(speed => (
                                <button
                                  key={speed}
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    setPlaybackSpeed(speed);
                                  }}
                                  className={`px-3 py-1 text-xs rounded ${
                                    speed === playbackSpeed ? 'bg-white/20' : 'hover:bg-white/10'
                                  }`}
                                >
                                  {speed}x
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Settings */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 rounded-full text-white hover:bg-white/20"
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>

                        {/* Fullscreen */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setIsFullscreen(!isFullscreen);
                          }}
                          className="w-8 h-8 rounded-full text-white hover:bg-white/20"
                        >
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Video Info */}
            <Card style={{ backgroundColor: theme.colors.surface }}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="w-5 h-5" style={{ color: theme.colors.primary }} />
                  <h3 className="font-semibold" style={{ color: theme.colors.textPrimary }}>
                    Video Info
                  </h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Duration:</span>
                    <span style={{ color: theme.colors.textPrimary }}>{duration || formatTime(totalDuration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Size:</span>
                    <span style={{ color: theme.colors.textPrimary }}>{metadata?.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Format:</span>
                    <span style={{ color: theme.colors.textPrimary }}>{metadata?.format}</span>
                  </div>
                  {metadata?.resolution && (
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Resolution:</span>
                      <span style={{ color: theme.colors.textPrimary }}>{metadata.resolution}</span>
                    </div>
                  )}
                  {metadata?.bitrate && (
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.textSecondary }}>Bitrate:</span>
                      <span style={{ color: theme.colors.textPrimary }}>{metadata.bitrate}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Playback Stats */}
            <Card style={{ backgroundColor: theme.colors.surface }}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4" style={{ color: theme.colors.textPrimary }}>
                  Playback
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Current Time:</span>
                    <span style={{ color: theme.colors.textPrimary }}>{formatTime(currentTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Speed:</span>
                    <span style={{ color: theme.colors.textPrimary }}>{playbackSpeed}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Volume:</span>
                    <span style={{ color: theme.colors.textPrimary }}>{isMuted ? 'Muted' : `${volume}%`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.colors.textSecondary }}>Progress:</span>
                    <span style={{ color: theme.colors.textPrimary }}>
                      {Math.round((currentTime / totalDuration) * 100)}%
                    </span>
                  </div>
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
                    onClick={() => setCurrentTime(0)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restart Video
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-xl"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-xl"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = title;
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Instagram-style integrated features */}
      {projectId && settings && (
        <CompactFeatures
          fileId="video"
          projectId={projectId}
          settings={settings}
          onDownload={onDownload}
        />
      )}
    </section>
  );
}
