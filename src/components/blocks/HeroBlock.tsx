import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

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
  const { theme } = useTheme();

  return (
    <section 
      className="relative py-20 px-6 overflow-hidden"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Clean background - no animations */}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main Title */}
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
          style={{ 
            color: theme.colors.textPrimary,
            textShadow: theme.mode === 'dark' ? '0 2px 4px rgba(0, 0, 0, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          {title}
        </h1>

        {/* Sub-line / Context */}
        <div className="mb-3">
          <p 
            className="text-lg md:text-xl lg:text-2xl font-semibold"
            style={{ 
              color: theme.colors.textSecondary,
              textShadow: theme.mode === 'dark' ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'
            }}
          >
            {subLine}
          </p>
        </div>

        {/* Tagline / Note */}
        <div className="mb-8">
          <p 
            className="text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed"
            style={{ 
              color: theme.colors.textSecondary,
              textShadow: theme.mode === 'dark' ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'
            }}
          >
            {tagLine}
          </p>
        </div>
      </div>
    </section>
  );
}
