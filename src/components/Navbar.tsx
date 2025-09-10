import React, { useState } from "react";
import { Button } from "./ui/button";
import { Upload, Menu, X } from "lucide-react";

interface NavbarProps {
  onNavigate: (page: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 relative">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left - Logo/Branding */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900 dark:text-white">Lytsite</span>
            </div>
            
            {/* Center - Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 flex-grow justify-center">
              <a 
                href="#how-it-works" 
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors focus-visible"
              >
                How it works
              </a>
              <button 
                onClick={() => onNavigate('templates-page')}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors focus-visible"
              >
                Templates
              </button>
              <a 
                href="#pricing" 
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors focus-visible"
              >
                Pricing
              </a>
              <a 
                href="#feedback" 
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors focus-visible"
              >
                Feedback
              </a>
            </nav>
            
            {/* Right - Sign In Button */}
            <div className="hidden md:flex items-center flex-shrink-0">
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 shadow-2xl border-t border-slate-200 dark:border-slate-700" style={{ zIndex: 60 }}>
            <nav className="container mx-auto px-4 py-6 space-y-4">
              <a 
                href="#how-it-works" 
                className="block text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors py-3 text-lg font-medium border-b border-slate-100 dark:border-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it works
              </a>
              <button 
                onClick={() => {
                  onNavigate('templates-page');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors py-3 text-lg font-medium border-b border-slate-100 dark:border-slate-700"
              >
                Templates
              </button>
              <a 
                href="#pricing" 
                className="block text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors py-3 text-lg font-medium border-b border-slate-100 dark:border-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#feedback" 
                className="block text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors py-3 text-lg font-medium border-b border-slate-100 dark:border-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Feedback
              </a>
              
              <div className="pt-4">
                <Button 
                  variant="default"
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <style jsx>{`
        .mobile-menu-btn {
          display: flex;
        }
        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
