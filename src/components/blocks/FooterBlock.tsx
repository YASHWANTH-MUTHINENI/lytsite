import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useEnhancedTheme } from "../../contexts/EnhancedThemeContext";
import { 
  Mail, 
  Globe, 
  Twitter, 
  Linkedin, 
  Github, 
  Download, 
  MessageCircle,
  ExternalLink,
  Zap
} from "lucide-react";

interface ContactInfo {
  email?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
}

interface FooterBlockProps {
  creatorName: string;
  contactInfo: ContactInfo;
  primaryCTA?: {
    text: string;
    action: () => void;
    variant?: 'default' | 'outline';
  };
  secondaryCTA?: {
    text: string;
    action: () => void;
  };
  showLytsiteBranding?: boolean;
  onNavigateHome?: () => void;
}

export default function FooterBlock({
  creatorName,
  contactInfo,
  primaryCTA = {
    text: "Get in touch",
    action: () => window.location.href = `mailto:${contactInfo.email}`
  },
  secondaryCTA,
  showLytsiteBranding = true,
  onNavigateHome
}: FooterBlockProps) {
  const { theme } = useEnhancedTheme();
  
  const socialLinks = [
    { icon: Mail, url: contactInfo.email ? `mailto:${contactInfo.email}` : null, label: "Email" },
    { icon: Globe, url: contactInfo.website, label: "Website" },
    { icon: Twitter, url: contactInfo.twitter, label: "Twitter" },
    { icon: Linkedin, url: contactInfo.linkedin, label: "LinkedIn" },
    { icon: Github, url: contactInfo.github, label: "GitHub" }
  ].filter(link => link.url);

  return (
    <>
      {/* Spacer section for visual separation */}
      <div 
        className="py-8"
        style={{ backgroundColor: theme.colors.backgroundSecondary }}
      />
      
      <footer 
        className="py-20 px-6"
        style={{ 
          backgroundColor: theme.colors.background,
          borderTop: `2px solid ${theme.colors.border}`,
          position: 'relative'
        }}
      >
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-5 blur-3xl"
            style={{ backgroundColor: theme.colors.primary }}
          />
          <div 
            className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full opacity-5 blur-3xl"
            style={{ backgroundColor: theme.colors.accent }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
        {/* Creator Info & CTAs */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <h3 
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ 
                color: theme.colors.textPrimary,
                textShadow: theme.mode === 'dark' ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
              }}
            >
              Connect with {creatorName}
            </h3>
            <p 
              className="text-lg max-w-2xl mx-auto leading-relaxed font-medium"
              style={{ 
                color: theme.colors.textSecondary,
                textShadow: theme.mode === 'dark' ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'
              }}
            >
              Have questions or want to work together? I'd love to hear from you.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              onClick={primaryCTA.action}
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.surface
              }}
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              {primaryCTA.text}
            </Button>
            
            {secondaryCTA && (
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                onClick={secondaryCTA.action}
                style={{ 
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.textPrimary
                }}
              >
                <Download className="w-5 h-5 mr-3" style={{ color: theme.colors.textSecondary }} />
                {secondaryCTA.text}
              </Button>
            )}
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex justify-center space-x-3">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-12 h-12 p-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      if (link.url) {
                        window.open(link.url, '_blank');
                      }
                    }}
                    title={link.label}
                    style={{ 
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.textPrimary
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: theme.colors.textSecondary }} />
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* Lytsite Branding */}
        {showLytsiteBranding && (
          <div 
            className="text-center pt-8 border-t"
            style={{ borderColor: theme.colors.border }}
          >
            <div className="flex items-center justify-center space-x-3 mb-2">
              <img 
                src="/logo.png" 
                alt="Lytsite" 
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <span 
                className="text-base font-medium leading-none"
                style={{ color: theme.colors.textSecondary }}
              >
                Powered by{" "}
                <button
                  onClick={onNavigateHome}
                  className="font-bold hover:underline transition-colors"
                  style={{ color: theme.colors.primary }}
                >
                  Lytsite
                </button>
              </span>
            </div>
            <p 
              className="text-sm font-medium"
              style={{ color: theme.colors.textSecondary }}
            >
              Professional file sharing made simple
            </p>
          </div>
        )}
      </div>
    </footer>
    </>
  );
}