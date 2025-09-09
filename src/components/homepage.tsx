import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import MinimalUploadModal from "./minimal-upload-modal";
import { 
  Upload, 
  Palette, 
  Share2, 
  ArrowRight, 
  FileText, 
  Image, 
  User, 
  Calendar,
  ShoppingCart,
  Target,
  Presentation,
  Zap,
  BarChart3,
  Shield,
  Lock,
  Eye,
  Link,
  Brush,
  GraduationCap,
  Megaphone,
  Quote,
  Star,
  Check,
  X,
  Menu,
  XIcon,
  ExternalLink
} from "lucide-react";

interface HomepageProps {
  onNavigate: (page: string) => void;
}

export default function Homepage({ onNavigate }: HomepageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleUploadSuccess = (templateRoute: string) => {
    onNavigate(templateRoute);
  };

  return (
    <div className="min-h-screen bg-ocean-gradient">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">Lytsite</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How it works</a>
            <button 
              onClick={() => onNavigate('templates-page')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Templates
            </button>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#feedback" className="text-slate-600 hover:text-slate-900 transition-colors">Feedback</a>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onNavigate('backend-data-test')}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              🧪 Backend Test
            </Button>
            <Button variant="outline" size="sm">Sign In</Button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-lg rounded-lg mt-2 mx-4 z-50">
            <nav className="flex flex-col p-4 space-y-4">
              <a 
                href="#how-it-works" 
                className="text-slate-600 hover:text-slate-900 transition-colors py-2 border-b border-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it works
              </a>
              <button 
                onClick={() => {
                  onNavigate('templates-page');
                  setMobileMenuOpen(false);
                }}
                className="text-left text-slate-600 hover:text-slate-900 transition-colors py-2 border-b border-slate-100"
              >
                Templates
              </button>
              <a 
                href="#pricing" 
                className="text-slate-600 hover:text-slate-900 transition-colors py-2 border-b border-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#feedback" 
                className="text-slate-600 hover:text-slate-900 transition-colors py-2 border-b border-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Feedback
              </a>
              <div className="pt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    onNavigate('backend-data-test');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-orange-600 hover:text-orange-700 font-medium"
                >
                  🧪 Backend Test
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with Upload Component in Whitespace */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh] lg:min-h-[85vh]">
            
            {/* Left Side - Hero Content */}
            <div className="flex flex-col justify-center space-y-4 lg:space-y-6 order-2 lg:order-1 lg:py-20">
              <div className="space-y-4 lg:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-sm text-emerald-700 font-medium">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  10 seconds to professional websites
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight lg:leading-[0.9] tracking-tighter">
                  <div className="space-y-1">
                    <div>Stop sending</div>
                    <div>ZIPs.</div>
                    <div>Start sending</div>
                    <div><span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">websites</span></div>
                  </div>
                </h1>
                
                <p className="text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl font-light italic">
                  Transform your files into professional, secure websites that impress clients and colleagues — no technical skills required.
                </p>
              </div>
              
              {/* Social Proof & Trust */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-xs lg:text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 lg:w-5 h-4 lg:h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.99 9 11 5.16-1.01 9-5.45 9-11V7l-10-5z"/>
                    </svg>
                    <span className="font-medium">Powered by Cloudflare</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 lg:w-5 h-4 lg:h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.11 7 14 7.9 14 9C14 10.11 13.11 11 12 11C10.9 11 10 10.11 10 9C10 7.9 10.9 7 12 7M18 14.2C16.34 15.37 14.22 16 12 16C9.78 16 7.66 15.37 6 14.2V13C6 10.79 8.79 8 12 8S18 10.79 18 13V14.2Z"/>
                    </svg>
                    <span className="font-medium">Enterprise Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 lg:w-5 h-4 lg:h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z"/>
                    </svg>
                    <span className="font-medium">GDPR Compliant</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs lg:text-sm text-slate-400">
                  <span className="font-medium">Trusted by professionals</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2 lg:pt-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => onNavigate('universal-file-template')}
                  className="h-12 lg:h-14 px-6 lg:px-8 font-semibold bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  View Live Demo
                  <ArrowRight className="w-4 lg:w-5 h-4 lg:h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right Side - Upload Component */}
            <div className="flex items-center justify-center order-1 lg:order-2 lg:py-20">
              <div className="w-full max-w-lg relative">
                {/* Background decoration */}
                <div className="absolute -inset-2 lg:-inset-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-xl lg:shadow-2xl shadow-slate-200/50">
                  <MinimalUploadModal onSuccess={handleUploadSuccess} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Cluster */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-slate-100/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Stats Row */}
            <div className="text-center mb-12 lg:mb-16">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">10k+</div>
                  <div className="text-sm text-slate-600">Files shared</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">500+</div>
                  <div className="text-sm text-slate-600">Happy users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">99.9%</div>
                  <div className="text-sm text-slate-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">24/7</div>
                  <div className="text-sm text-slate-600">Support</div>
                </div>
              </div>
              
              <p className="text-sm text-slate-500 mb-6 font-medium">Trusted by professionals worldwide</p>
              
              {/* Industry Logos */}
              <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 opacity-70">
                <div className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
                  <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <Brush className="w-4 lg:w-5 h-4 lg:h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Designers</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
                  <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-4 lg:w-5 h-4 lg:h-5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium">Educators</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
                  <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 lg:w-5 h-4 lg:h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Businesses</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
                  <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-4 lg:w-5 h-4 lg:h-5 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium">Marketers</span>
                </div>
              </div>
            </div>

            {/* Featured Testimonials Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Main Testimonial */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                  
                  <div className="relative">
                    <div className="flex items-start gap-4 lg:gap-6">
                      <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 shadow-md">
                        SM
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="flex items-center space-x-1 mr-4">
                            {[1,2,3,4,5].map((star) => (
                              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                            Verified User
                          </Badge>
                        </div>
                        <blockquote className="text-lg lg:text-xl text-slate-700 leading-relaxed mb-4 font-medium">
                          "Lytsite completely transformed how I deliver work to clients. What used to take me hours of back-and-forth emails now happens in seconds. The professional presentation makes such a difference — clients are actually impressed by the delivery experience itself."
                        </blockquote>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900 text-lg">Sarah Mitchell</p>
                            <p className="text-sm text-slate-500">Freelance UI/UX Designer • 5+ years experience</p>
                          </div>
                          <div className="text-right text-xs text-slate-400">
                            <div>Saves 3+ hours per project</div>
                            <div>40+ happy clients</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Testimonials */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    MR
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1 mb-2">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-sm text-slate-600 leading-relaxed mb-3">
                      "Perfect for sharing course materials with students. The analytics help me see engagement."
                    </blockquote>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Mike Rodriguez</p>
                      <p className="text-xs text-slate-500">University Professor</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    ET
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1 mb-2">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-sm text-slate-600 leading-relaxed mb-3">
                      "Game changer for client deliveries. Professional presentation that actually impresses people."
                    </blockquote>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Emma Thompson</p>
                      <p className="text-xs text-slate-500">Marketing Agency Owner</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="text-center">
              <div className="inline-flex items-center gap-6 px-6 py-3 bg-white rounded-full border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="font-medium">SOC 2 Compliant</span>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">End-to-End Encryption</span>
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">GDPR Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain → Outcome Feature Blocks */}
      <section className="py-20 bg-gradient-to-b from-slate-100/30 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Card 1: Files get lost */}
              <div 
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all duration-200 cursor-pointer group"
                onClick={() => {
                  // Track: feature.card_clicked (files-lost)
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                    <span className="text-red-600 font-medium">Pain:</span> Files get lost in messy email threads.
                  </p>
                  <p className="text-slate-900 font-medium text-sm leading-relaxed">
                    <span className="text-emerald-600">Outcome:</span> Share one short link + QR that opens a polished mini-site.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-xs text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors">
                    How it works →
                  </span>
                </div>
              </div>

              {/* Card 2: Clients need previews */}
              <div 
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all duration-200 cursor-pointer group"
                onClick={() => {
                  // Track: feature.card_clicked (previews)
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Image className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                    <span className="text-red-600 font-medium">Pain:</span> Clients need previews, not raw ZIPs.
                  </p>
                  <p className="text-slate-900 font-medium text-sm leading-relaxed">
                    <span className="text-emerald-600">Outcome:</span> Preview gallery + PDF viewer — password-controlled if needed.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-xs text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors">
                    How it works →
                  </span>
                </div>
              </div>

              {/* Card 3: Don't want to manage site */}
              <div 
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all duration-200 cursor-pointer group"
                onClick={() => {
                  // Track: feature.card_clicked (no-management)
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                    <span className="text-red-600 font-medium">Pain:</span> I don't want to manage a website.
                  </p>
                  <p className="text-slate-900 font-medium text-sm leading-relaxed">
                    <span className="text-emerald-600">Outcome:</span> One template, auto-layout, instant publish — no dev required.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-xs text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors">
                    How it works →
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600">
              Three simple steps. Just 2-3 inputs. Professional results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">1. Drop Your File</h3>
              <p className="text-slate-600">
                Upload any file - PDFs, documents, presentations, images, or archives. We handle the rest automatically.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">2. Add 2-3 Details</h3>
              <p className="text-slate-600">
                Just enter a title, description, and optionally your name. Everything else is automatically optimized for professional presentation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">3. Share & Track</h3>
              <p className="text-slate-600">
                Get an instant professional website with analytics, interactive previews, and download tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-white to-slate-50/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-medium mb-4">
              Everything you need to share beautifully
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From instant publishing to professional templates, we've got you covered.
            </p>
          </div>
          
          <Tabs defaultValue="sharing" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              <TabsTrigger value="sharing" className="text-sm">Instant Sharing</TabsTrigger>
              <TabsTrigger value="templates" className="text-sm">Templates</TabsTrigger>
              <TabsTrigger value="security" className="text-sm">Security</TabsTrigger>
              <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sharing" className="space-y-8">
              <Card>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Drag & Drop</h3>
                        <p className="text-slate-600">Any file type, any size up to your plan limit</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">5-Second Publishing</h3>
                        <p className="text-slate-600">Instant mini-site generation with zero configuration</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Link className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Smart Links</h3>
                        <p className="text-slate-600">QR codes + human-readable short links</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-8">
              <Card>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Palette className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Auto-Wrap Files</h3>
                        <p className="text-slate-600">PDFs, images, and ZIPs become galleries, brochures, or countdown pages</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="font-medium text-primary">15+</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Professional Templates</h3>
                        <p className="text-slate-600">Beautiful, responsive designs for every use case</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">One-Click Updates</h3>
                        <p className="text-slate-600">Keep your shared links current with instant updates</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-8">
              <Card>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Password Protection</h3>
                        <p className="text-slate-600">Secure your content with password protection and auto-expiry</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">GDPR Compliant</h3>
                        <p className="text-slate-600">Automatic deletion and privacy-first approach</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="font-medium text-primary text-xs">HTTPS</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Secure by Default</h3>
                        <p className="text-slate-600">HTTPS encryption + optional DDoS protection</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-8">
              <Card>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Track Everything</h3>
                        <p className="text-slate-600">Views, clicks, location, device, and more</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Export & Webhooks</h3>
                        <p className="text-slate-600">CSV exports, webhook alerts, and lead capture</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="font-medium text-primary text-sm">PRO</span>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Pro & Business</h3>
                        <p className="text-slate-600">Advanced analytics available on paid plans</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Target Segments Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50/20 to-slate-50/40">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-medium mb-4">
              Built for Anyone Who Shares Files
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Whether you're a creative professional or running a business, Lytsite makes sharing beautiful.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brush,
                title: "Creators",
                description: "Portfolios, client deliveries, and creative showcases made simple.",
                examples: "Designers • Photographers • Artists"
              },
              {
                icon: GraduationCap,
                title: "Educators & Students",
                description: "Assignments, handouts, and project presentations that engage.",
                examples: "Teachers • Students • Researchers"
              },
              {
                icon: Megaphone,
                title: "SMB Marketers",
                description: "Campaigns, catalogs, and landing pages that convert.",
                examples: "Agencies • Startups • Local Business"
              },
              {
                icon: Calendar,
                title: "Event Organizers",
                description: "RSVP pages, launches, and countdown experiences that wow.",
                examples: "Event Planners • Communities • Nonprofits"
              }
            ].map((segment, index) => {
              const Icon = segment.icon;
              return (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">{segment.title}</h3>
                      <p className="text-slate-600 mb-3">{segment.description}</p>
                      <p className="text-sm text-slate-500">{segment.examples}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Secondary segments */}
          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">And many more...</p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-white rounded-full border border-slate-200 text-sm text-slate-700">Developers</span>
              <span className="px-4 py-2 bg-white rounded-full border border-slate-200 text-sm text-slate-700">Corporate Teams</span>
              <span className="px-4 py-2 bg-white rounded-full border border-slate-200 text-sm text-slate-700">Consultants</span>
              <span className="px-4 py-2 bg-white rounded-full border border-slate-200 text-sm text-slate-700">Freelancers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50/40 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-medium mb-4">
              Every Link Markets Itself
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              With every shared mini-site carrying our "Made with Lytsite" badge, 
              your audience discovers us naturally — creating a viral growth loop.
            </p>
            
            {/* Badge Example */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
              <div className="w-4 h-4 rounded bg-primary"></div>
              <span className="text-sm text-slate-500">Made with Lytsite</span>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                name: "Sarah Chen",
                role: "Freelance Designer",
                content: "Lytsite has transformed how I deliver work to clients. No more confusing email chains with large attachments.",
                rating: 5
              },
              {
                name: "Michael Rodriguez",
                role: "High School Teacher",
                content: "My students love the QR codes! Makes sharing homework and projects so much easier.",
                rating: 5
              },
              {
                name: "Emma Thompson",
                role: "Marketing Manager",
                content: "The analytics are incredible. We can finally track engagement on our campaign materials.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  <Quote className="w-8 h-8 text-slate-300 mb-4" />
                  
                  <p className="text-slate-600 mb-4">"{testimonial.content}"</p>
                  
                  <div>
                    <p className="font-medium text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Growth Stats */}
          <div className="text-center">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-2xl font-medium text-primary mb-2">10k+</div>
                <div className="text-sm text-slate-500">Mini-sites created</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-primary mb-2">50k+</div>
                <div className="text-sm text-slate-500">QR codes generated</div>
              </div>
              <div>
                <div className="text-2xl font-medium text-primary mb-2">500+</div>
                <div className="text-sm text-slate-500">Daily sign-ups</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Preview Section */}
      <section id="templates" className="py-20 bg-gradient-to-b from-white to-slate-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Universal Template - Works with Any File
            </h2>
            <p className="text-lg text-slate-600">
              Smart, adaptive design that automatically optimizes for your content
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="overflow-hidden border-2 border-primary/20 relative">
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-primary text-white">
                  <Zap className="w-3 h-3 mr-1" />
                  Recommended
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 bg-white">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-ocean-gradient rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">Universal Template</h3>
                      <p className="text-slate-600">Works with any file type</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Interactive file previews & navigation
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Built-in analytics & download tracking
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      Professional author info & branding
                    </div>
                  </div>
                  <Button 
                    onClick={() => onNavigate('universal-file-template')} 
                    size="lg" 
                    className="w-full"
                  >
                    Preview Template
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-ocean-50 to-teal-50 relative overflow-hidden">
                  <div className="absolute inset-4 bg-white rounded-lg shadow-lg border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-red-50 rounded"></div>
                        <div className="w-16 h-2 bg-slate-200 rounded"></div>
                      </div>
                      <div className="w-12 h-4 bg-green-50 rounded border border-green-200"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="col-span-2 aspect-[4/3] bg-slate-100 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-8 bg-primary/10 rounded"></div>
                        <div className="h-6 bg-slate-100 rounded"></div>
                        <div className="h-6 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-8 h-5 bg-slate-100 rounded border-2 border-primary"></div>
                      <div className="w-8 h-5 bg-slate-100 rounded"></div>
                      <div className="w-8 h-5 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <Button 
                onClick={() => onNavigate('templates-page')}
                variant="outline"
                size="lg"
                className="bg-white hover:bg-slate-50 border-2 border-primary text-primary hover:text-primary"
              >
                View All Templates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-slate-600 mt-3">
              Upload your file in the box above • Works with any file • Professional results in seconds
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-blue-700 to-blue-900 relative">
        <div className="absolute inset-0 bg-blue-800/80"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-sm">
            Ready to get started?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto drop-shadow-sm">
            Transform your file sharing experience in seconds. Try our upload tool above or explore our templates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button 
              size="lg"
              className="h-14 px-8 bg-white text-blue-700 hover:bg-gray-50 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              onClick={() => {
                document.querySelector('section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start Creating Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="h-14 px-8 border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold text-lg transition-all"
              onClick={() => onNavigate('templates')}
            >
              View Templates
              <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-primary/10 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Choose the perfect plan for your file sharing needs. Start free and upgrade as you grow.
              </p>
            </div>

            {/* Responsive Pricing Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left p-3 lg:p-6 font-semibold text-slate-900 min-w-[160px] lg:min-w-[200px]">
                        <span className="text-sm lg:text-base">Features</span>
                      </th>
                      <th className="text-center p-3 lg:p-6 font-semibold text-slate-900 min-w-[100px] lg:min-w-[140px]">
                        <div>
                          <div className="font-bold text-base lg:text-lg">Free</div>
                          <div className="text-xs lg:text-sm font-normal text-slate-600">$0/month</div>
                        </div>
                      </th>
                      <th className="text-center p-3 lg:p-6 font-semibold text-slate-900 min-w-[100px] lg:min-w-[140px] relative">
                        <div className="absolute -top-2 lg:-top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-white text-xs px-2 py-1">Popular</Badge>
                        </div>
                        <div className="pt-2 lg:pt-0">
                          <div className="font-bold text-base lg:text-lg">Standard</div>
                          <div className="text-xs lg:text-sm font-normal text-slate-600">$9/month</div>
                        </div>
                      </th>
                      <th className="text-center p-3 lg:p-6 font-semibold text-slate-900 min-w-[100px] lg:min-w-[140px]">
                        <div>
                          <div className="font-bold text-base lg:text-lg">Pro</div>
                          <div className="text-xs lg:text-sm font-normal text-slate-600">$29/month</div>
                        </div>
                      </th>
                      <th className="text-center p-3 lg:p-6 font-semibold text-slate-900 min-w-[100px] lg:min-w-[140px]">
                        <div>
                          <div className="font-bold text-base lg:text-lg">Business</div>
                          <div className="text-xs lg:text-sm font-normal text-slate-600">$99/month</div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">Upload Size</td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm lg:text-base">2 GB</td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm lg:text-base">10 GB</td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm lg:text-base">25 GB</td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm lg:text-base">100 GB</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">Bandwidth / Month</td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm lg:text-base">10 GB</td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm lg:text-base">100 GB</td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm lg:text-base">500 GB</td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm lg:text-base">2 TB</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">Expiry</td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm lg:text-base">7 days</td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm lg:text-base">30 days</td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-xs lg:text-base">No expiry (optional)</td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm lg:text-base">No expiry</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">Watermark</td>
                      <td className="p-2 lg:p-4 text-center">
                        <div className="flex items-center justify-center">
                          <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600" />
                          <span className="ml-1 text-xs text-slate-600 hidden lg:inline">Lytsite branding</span>
                        </div>
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">Password Protection</td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">File Previews</td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">QR Code Sharing</td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">Custom Branding</td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <div className="flex flex-col items-center">
                          <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600" />
                          <span className="text-xs text-slate-600 mt-1 hidden lg:inline">white-label + domain</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">Analytics</td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <div className="flex flex-col items-center">
                          <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600" />
                          <span className="text-xs text-slate-600 mt-1 hidden sm:inline">Basic</span>
                        </div>
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <div className="flex flex-col items-center">
                          <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600" />
                          <span className="text-xs text-slate-600 mt-1 hidden sm:inline">Advanced</span>
                        </div>
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <div className="flex flex-col items-center">
                          <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600" />
                          <span className="text-xs text-slate-600 mt-1 hidden sm:inline">Full</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">Versioning</td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">Bulk Generation</td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <div className="flex flex-col items-center">
                          <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600" />
                          <span className="text-xs text-slate-600 mt-1 hidden sm:inline">+ API</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">Email Integration</td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm">Limited</td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm">Full</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">Team Features</td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center">
                        <X className="w-3 lg:w-4 h-3 lg:h-4 text-red-500 mx-auto" />
                      </td>
                      <td className="p-2 lg:p-4 text-center text-slate-700 text-sm">2 members</td>
                      <td className="p-2 lg:p-4 text-center">
                        <div className="flex flex-col items-center">
                          <Check className="w-3 lg:w-4 h-3 lg:h-4 text-green-600" />
                          <span className="text-xs text-slate-600 mt-1 hidden sm:inline">Unlimited</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2 lg:p-4 font-medium text-slate-900 text-sm lg:text-base">Support</td>
                      <td className="p-2 lg:p-4 text-center text-slate-600 text-sm">Community</td>
                      <td className="p-2 lg:p-4 text-center text-slate-600 text-sm">Standard</td>
                      <td className="p-2 lg:p-4 text-center text-slate-600 text-sm">Priority</td>
                      <td className="p-2 lg:p-4 text-center text-slate-600 text-sm">Priority + SLA</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50">
                      <td className="p-3 lg:p-6"></td>
                      <td className="p-3 lg:p-6 text-center">
                        <Button variant="outline" className="w-full text-sm lg:text-base">
                          Get Started
                        </Button>
                      </td>
                      <td className="p-3 lg:p-6 text-center">
                        <Button className="w-full bg-primary text-white hover:bg-primary/90 text-sm lg:text-base">
                          Start Free Trial
                        </Button>
                      </td>
                      <td className="p-3 lg:p-6 text-center">
                        <Button variant="outline" className="w-full text-sm lg:text-base">
                          Upgrade to Pro
                        </Button>
                      </td>
                      <td className="p-3 lg:p-6 text-center">
                        <Button variant="outline" className="w-full text-sm lg:text-base">
                          Contact Sales
                        </Button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16 text-center">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Frequently asked questions
              </h3>
              <p className="text-slate-600 mb-6">
                Have questions about our pricing? We're here to help.
              </p>
              <Button variant="outline">
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Upload className="w-3 h-3 text-white" />
              </div>
              <span className="text-white font-medium">Lytsite</span>
            </div>
            <div className="flex items-center space-x-6 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400">
            <p>© 2025 Lytsite. Professional file sharing made simple.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
