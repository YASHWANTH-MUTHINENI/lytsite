import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Upload, Menu, X, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '', name: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isSignUp ? 'Sign Up:' : 'Login:', loginData);
    setShowLoginModal(false);
    setLoginData({ email: '', password: '', name: '' });
    setIsSignUp(false);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Forgot password for:', forgotEmail);
    setForgotSubmitted(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSubmitted(false);
      setForgotEmail('');
    }, 3000);
  };

  const handleForgotClick = () => {
    setShowLoginModal(false);
    setShowForgotModal(true);
  };

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
    // Handle Google OAuth here
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
    // Handle Google OAuth here
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
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
                onClick={() => navigate('/templates')}
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
                onClick={() => navigate('/feedback')}
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors focus-visible"
              >
                Feedback
              </button>
            </nav>
            
            {/* Right - Sign In Button */}
            <div className="hidden md:flex items-center flex-shrink-0">
              <Button 
                variant="default" 
                size="sm" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => setShowLoginModal(true)}
              >
                Sign In
              </Button>
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
                  navigate('/templates');
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
                  navigate('/feedback');
                  setMobileMenuOpen(false);
                }}
                className="block text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors py-3 text-lg font-medium border-b border-slate-100 dark:border-slate-700 w-full text-left"
              >
                Feedback
              </button>
              
              <div className="pt-4">
                <Button 
                  variant="default"
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setShowLoginModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Notion-style Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-8 pb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {isSignUp ? 'Create account' : 'Welcome back'}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {isSignUp ? 'Sign up for a new account' : 'Sign in to your account'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setIsSignUp(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                {/* Name field for signup */}
                {isSignUp && (
                  <div>
                    <Input
                      type="text"
                      name="name"
                      required
                      value={loginData.name}
                      onChange={handleLoginInputChange}
                      placeholder="Full name"
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg bg-gray-50"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <Input
                    type="email"
                    name="email"
                    required
                    value={loginData.email}
                    onChange={handleLoginInputChange}
                    placeholder="Email address"
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg bg-gray-50"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                    placeholder="Password"
                    className="h-12 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Remember & Forgot (only for login) */}
                {!isSignUp && (
                  <div className="flex items-center justify-between text-sm pt-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-gray-600">Remember me</span>
                    </label>
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handleForgotClick();
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot password?
                    </a>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors mt-4"
                >
                  {isSignUp ? 'Sign up' : 'Sign in'}
                </Button>
              </form>

              {/* Google Auth Section (for both login and signup) */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={isSignUp ? handleGoogleSignup : handleGoogleSignIn}
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isSignUp ? 'Continue with Google' : 'Sign in with Google'}
              </Button>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t">
              <p className="text-center text-sm text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isSignUp ? 'Sign in' : 'Sign up for free'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              {!forgotSubmitted ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">Reset password</h2>
                      <p className="text-gray-500 text-sm mt-1">Enter your email to get a reset link</p>
                    </div>
                    <button
                      onClick={() => setShowForgotModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg bg-gray-50"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
                    >
                      Send reset link
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => {
                        setShowForgotModal(false);
                        setShowLoginModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      ← Back to sign in
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Reset link sent! 📧
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We've sent a password reset link to <strong>{forgotEmail}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Check your email and click the link to reset your password.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
