import React, { useState, useEffect } from "react";
import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Upload, Menu, X, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { ConversionNotificationCenter } from "./notifications/ConversionNotificationCenter";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);



  // Auth Section Component
  const AuthSection = () => {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
      return (
        <div className="hidden md:flex items-center flex-shrink-0">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      );
    }

    if (isSignedIn) {
      return (
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <Link
            to="/dashboard"
            className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
        </div>
      );
    }

    return (
      <div className="hidden md:flex items-center gap-2 flex-shrink-0">
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
            Sign Up
          </Button>
        </SignUpButton>
      </div>
    );
  };

  // Mobile Auth Section Component
  const MobileAuthSection = () => {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
      return <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>;
    }

    if (isSignedIn) {
      return (
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="block px-3 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 mt-4">
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
            <User className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="default" size="sm" className="w-full justify-start bg-primary hover:bg-primary/90" onClick={() => setMobileMenuOpen(false)}>
            <User className="w-4 h-4 mr-2" />
            Sign Up
          </Button>
        </SignUpButton>
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 relative">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left - Logo/Branding */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="Lytsite" 
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <span className="text-xl font-semibold text-slate-900 dark:text-white leading-none">Lytsite</span>
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
                onClick={() => window.location.href = '/templates'}
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
              <button 
                onClick={() => window.location.href = '/feedback'}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors focus-visible"
              >
                Feedback
              </button>
            </nav>
            
            {/* Right - Notifications & Auth */}
            <div className="flex items-center gap-3">
              <ConversionNotificationCenter 
                onSignUpClick={() => window.location.href = '/dashboard'}
              />
              <AuthSection />
            </div>
            
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                className="flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
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
                  window.location.href = '/templates';
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
              <button 
                onClick={() => {
                  window.location.href = '/feedback';
                  setMobileMenuOpen(false);
                }}
                className="block text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors py-3 text-lg font-medium border-b border-slate-100 dark:border-slate-700 w-full text-left"
              >
                Feedback
              </button>
              
              <div className="pt-4">
                <MobileAuthSection />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
