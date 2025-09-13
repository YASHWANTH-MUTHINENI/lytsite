import React from "react";
import { useEnhancedTheme } from "../../contexts/EnhancedThemeContext";

interface HeroBlockProps {
  title: string;        // Universal Input 1: What it is
  subLine: string;      // Universal Input 2: Context (From/To/For/Version/etc.)
  tagLine: string;      // Universal Input 3: Personal note/callout/custom field
}

export default function HeroBlock({ 
  title, 
  subLine, 
  tagLine
}: HeroBlockProps) {
  const { theme, heroLayout } = useEnhancedTheme();

  // Render different layouts based on heroLayout
  if (heroLayout === 'centered') {
    return (
      <section 
        className="relative py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 overflow-hidden"
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at center, ${theme.colors.primary}15 0%, transparent 70%)`
            }}
          />
        </div>

        {/* Centered Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight"
              style={{ 
                color: theme.colors.textPrimary,
                lineHeight: '1.1'
              }}
            >
              {title}
            </h1>
            
            <div 
              className="w-24 h-1 mx-auto rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
            />
            
            <p 
              className="text-xl sm:text-2xl md:text-3xl font-medium"
              style={{ color: theme.colors.textSecondary }}
            >
              {subLine}
            </p>
            
            <p 
              className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: theme.colors.textMuted }}
            >
              {tagLine}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (heroLayout === 'split') {
    return (
      <section 
        className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden"
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* Split Layout */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="text-left">
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight"
                style={{ 
                  color: theme.colors.textPrimary,
                  animation: 'fadeInUp 0.8s ease-out'
                }}
              >
                {title}
              </h1>
              <div className="mb-3">
                <p 
                  className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold"
                  style={{ 
                    color: theme.colors.textSecondary,
                    animation: 'fadeInUp 0.8s ease-out 0.2s both'
                  }}
                >
                  {subLine}
                </p>
              </div>
              <div className="mb-6">
                <p 
                  className="text-sm sm:text-base md:text-lg font-normal leading-relaxed"
                  style={{ 
                    color: theme.colors.textMuted,
                    animation: 'fadeInUp 0.8s ease-out 0.4s both'
                  }}
                >
                  {tagLine}
                </p>
              </div>
            </div>
            
            {/* Right: Visual Element */}
            <div className="relative">
              <div 
                className="aspect-[4/3] rounded-2xl border-2 overflow-hidden"
                style={{ 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.backgroundSecondary
                }}
              >
                {/* Image placeholder */}
                <div className="w-full h-full relative flex items-center justify-center">
                  {/* Pattern background */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `repeating-linear-gradient(
                        45deg,
                        ${theme.colors.primary}20,
                        ${theme.colors.primary}20 10px,
                        transparent 10px,
                        transparent 20px
                      )`
                    }}
                  />
                  
                  {/* Centered placeholder content */}
                  <div className="relative z-10 text-center space-y-4">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                      style={{ backgroundColor: theme.colors.primary, opacity: 0.3 }}
                    >
                      <svg 
                        className="w-8 h-8"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                        style={{ color: theme.colors.primary }}
                      >
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p 
                      className="text-sm font-medium"
                      style={{ color: theme.colors.textMuted }}
                    >
                      Your Image Here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `
        }} />
      </section>
    );
  }

  if (heroLayout === 'featured') {
    return (
      <section 
        className="relative py-20 sm:py-24 md:py-28 lg:py-32 px-4 sm:px-6 overflow-hidden"
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* Featured Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}20 0%, ${theme.colors.background} 100%)`
            }}
          />
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-5"
               style={{ backgroundColor: theme.colors.primary }} />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-5"
               style={{ backgroundColor: theme.colors.primaryLight }} />
        </div>

        {/* Featured Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div className="mb-8">
            <div 
              className="inline-block px-6 py-3 rounded-full border"
              style={{ 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.primary
              }}
            >
              Featured Presentation
            </div>
          </div>
          
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight"
            style={{ 
              color: theme.colors.textPrimary,
              animation: 'fadeInUp 0.8s ease-out'
            }}
          >
            {title}
          </h1>
          <div className="mb-4">
            <p 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold"
              style={{ 
                color: theme.colors.textSecondary,
                animation: 'fadeInUp 0.8s ease-out 0.2s both'
              }}
            >
              {subLine}
            </p>
          </div>
          <div className="mb-8">
            <p 
              className="text-base sm:text-lg md:text-xl font-normal max-w-3xl mx-auto leading-relaxed"
              style={{ 
                color: theme.colors.textMuted,
                animation: 'fadeInUp 0.8s ease-out 0.4s both'
              }}
            >
              {tagLine}
            </p>
          </div>
        </div>

        {/* CSS Animations */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `
        }} />
      </section>
    );
  }

  // Default: Minimal Layout (current layout)
  return (
    <section 
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Clean Professional Background */}
      <div className="absolute inset-0">
        {/* Minimal accent line only */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-24 h-0.5 opacity-30"
             style={{ backgroundColor: theme.colors.primary }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Main Title - Clean and professional */}
        <h1 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight tracking-tight px-2"
          style={{ 
            color: theme.colors.textPrimary,
            animation: 'fadeInUp 0.8s ease-out'
          }}
        >
          {title}
        </h1>

        {/* Sub-line / Context - Clean and readable */}
        <div className="mb-2 sm:mb-3">
          <p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold px-2"
            style={{ 
              color: theme.colors.textSecondary,
              animation: 'fadeInUp 0.8s ease-out 0.2s both'
            }}
          >
            {subLine}
          </p>
        </div>

        {/* Tagline / Note - Simple and clean */}
        <div className="mb-6 sm:mb-8">
          <p 
            className="text-sm sm:text-base md:text-lg font-normal max-w-2xl mx-auto leading-relaxed px-4"
            style={{ 
              color: theme.colors.textMuted,
              animation: 'fadeInUp 0.8s ease-out 0.4s both'
            }}
          >
            {tagLine}
          </p>
        </div>

        {/* Professional Accent Line */}
        <div className="flex justify-center">
          <div 
            className="w-16 h-0.5 rounded-full"
            style={{ 
              backgroundColor: theme.colors.primary,
              animation: 'fadeInUp 0.8s ease-out 0.6s both'
            }}
          />
        </div>
      </div>

      {/* CSS Animations - Added to global styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
    </section>
  );
}
