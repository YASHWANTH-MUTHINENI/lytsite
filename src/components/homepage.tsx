import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import MinimalUploadModal from "./minimal-upload-modal";
import Navbar from "./Navbar";
import { AnonymousEngagementTeaser } from "./auth/AnonymousEngagementTeaser";
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
  ExternalLink
} from "lucide-react";

export default function Homepage() {
  const [showTrialModal, setShowTrialModal] = React.useState(false);
  
  const handleUploadSuccess = (templateRoute: string) => {
    window.location.href = `/${templateRoute}`;
  };

  const handleFreeTrialClick = () => {
    setShowTrialModal(true);
    setTimeout(() => {
      setShowTrialModal(false);
    }, 3000); // Auto close after 3 seconds
  };

  return (
    <div className="min-h-screen bg-ocean-gradient dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800 isolate">
      {/* Header */}
      <Navbar />

      {/* Hero Section with Upload Component in Whitespace - Isolated from navbar */}
      <main className="relative pt-6" style={{ zIndex: 10 }}>
      <section className="hero-section relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh] lg:min-h-[85vh]">
            
            {/* Left Side - Hero Content */}
            <div className="flex flex-col justify-center space-y-4 lg:space-y-6 order-2 lg:order-1 lg:py-20">
              <div className="space-y-4 lg:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-sm text-emerald-700 font-medium">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  10 seconds to professional websites
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight lg:leading-[0.9] tracking-tighter">
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
                {/* <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => window.location.href = '/universal-file-template'}
                  className="h-12 lg:h-14 px-6 lg:px-8 font-semibold bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md min-h-[44px] min-w-[44px]"
                >
                  Try Now
                  <ArrowRight className="w-4 lg:w-5 h-4 lg:h-5 ml-2" />
                </Button> */}
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

      {/* Anonymous Engagement Teaser */}
      <section className="py-8 bg-gradient-to-br from-slate-50 to-slate-100/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnonymousEngagementTeaser 
              onSignUpClick={() => {
                // Redirect to sign up or open auth modal
                window.location.href = '/dashboard';
              }}
            />
          </div>
        </div>
      </section>

      {/* Social Proof Cluster */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-slate-100/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Stats Row */}
            <div className="text-center mb-12 lg:mb-16">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
              {/* Main Testimonial */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 opacity-50"></div>
                  
                  <div className="relative">
                    <div className="flex flex-col sm:flex-row items-start gap-4 lg:gap-6">
                      <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0 shadow-md mx-auto sm:mx-0">
                        SM
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start mb-3 space-y-2 sm:space-y-0 sm:space-x-4">
                          <div className="flex items-center space-x-1">
                            {[1,2,3,4,5].map((star) => (
                              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                            Verified User
                          </Badge>
                        </div>
                        <blockquote className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed mb-4 font-medium">
                          "Lytsite completely transformed how I deliver work to clients. What used to take me hours of back-and-forth emails now happens in seconds. The professional presentation makes such a difference — clients are actually impressed by the delivery experience itself."
                        </blockquote>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between space-y-3 sm:space-y-0">
                          <div className="text-center sm:text-left">
                            <p className="font-semibold text-slate-900 text-base sm:text-lg">Navya</p>
                            <p className="text-sm text-slate-500">Freelance UI/UX Designer • 5+ years experience</p>
                          </div>
                          <div className="text-center sm:text-right text-xs text-slate-400">
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
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 mx-auto sm:mx-0">
                    MR
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start space-x-1 mb-2">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-sm text-slate-600 leading-relaxed mb-3">
                      "Perfect for sharing course materials with students. The analytics help me see engagement."
                    </blockquote>
                    <div className="text-center sm:text-left">
                      <p className="font-medium text-slate-900 text-sm">Venkatesh</p>
                      <p className="text-xs text-slate-500">University Professor</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 mx-auto sm:mx-0">
                    ET
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start space-x-1 mb-2">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-sm text-slate-600 leading-relaxed mb-3">
                      "Game changer for client deliveries. Professional presentation that actually impresses people."
                    </blockquote>
                    <div className="text-center sm:text-left">
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
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              More than file transfer. A delivery experience your clients will love.
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transform any file into a professional presentation with features that make sharing feel premium.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Drop → Instant Site */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl mb-6">🚀</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Drop → Instant Site</h3>
              <p className="text-slate-600 leading-relaxed">
                Upload any file and get a professional website in seconds. No configuration, no waiting – just instant results that look amazing.
              </p>
            </div>

            {/* Presentation Not Just Transfer */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl mb-6">🎨</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Presentation Not Just Transfer</h3>
              <p className="text-slate-600 leading-relaxed">
                Transform boring file sharing into beautiful presentations. PDFs become interactive galleries, images get professional layouts.
              </p>
            </div>

            {/* Secure by Default */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl mb-6">🔒</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Secure by Default</h3>
              <p className="text-slate-600 leading-relaxed">
                Password protection, auto-expiry, and HTTPS encryption built in. Share confidently knowing your content is protected.
              </p>
            </div>

            {/* Smart Tracking */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl mb-6">📊</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Smart Tracking</h3>
              <p className="text-slate-600 leading-relaxed">
                Know exactly when your files are viewed, downloaded, and by whom. Get insights that help you follow up at the right time.
              </p>
            </div>

            {/* Timeline & Versioning */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl mb-6">📂</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Timeline & Versioning</h3>
              <p className="text-slate-600 leading-relaxed">
                Keep links current with instant updates. Share once, update forever – your audience always sees the latest version.
              </p>
            </div>

            {/* Bulk Generation */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl mb-6">📑</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Bulk Generation</h3>
              <p className="text-slate-600 leading-relaxed">
                Upload multiple files at once and get individual professional sites for each. Perfect for portfolios, catalogs, and collections.
              </p>
            </div>

            {/* Email-Ready Links */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 lg:col-span-3 md:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="text-4xl">✉️</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Email-Ready Links</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Every shared file gets a beautiful, branded link that looks professional in emails, messages, and social media. 
                    QR codes included for easy mobile sharing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50/20 to-slate-50/40">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Built for Professionals Who Demand Better
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Whether you're delivering creative work, managing client projects, or closing deals – Lytsite transforms how you share.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* For Photographers & Creatives */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="text-4xl mb-6">📸</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">For Photographers & Creatives</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Gallery Previews</h4>
                  <p className="text-slate-600">Showcase photos in a responsive lightbox instead of clunky folders.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Clean Delivery Links</h4>
                  <p className="text-slate-600">Clients click, view, and download instantly.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Timeline Updates <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Pro</span></h4>
                  <p className="text-slate-600">Share new edits without resending links.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">QR Codes</h4>
                  <p className="text-slate-600">Perfect for printing on proof sheets or albums.</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
                <p className="text-sm text-amber-900 dark:text-amber-200">
                  <span className="font-medium">💡 Why it matters:</span> Your clients get a premium experience, not "another Google Drive link."
                </p>
              </div>
            </div>

            {/* For Agencies & Freelancers */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="text-4xl mb-6">🏢</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">For Agencies & Freelancers</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Bulk Site Generation <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Pro</span></h4>
                  <p className="text-slate-600">Upload once + CSV of clients → each gets their own branded delivery page.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Branded Pages</h4>
                  <p className="text-slate-600">Add your logo and colors for professional polish.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Password & Expiry Controls</h4>
                  <p className="text-slate-600">Keep confidential campaigns safe.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Version History <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Pro</span></h4>
                  <p className="text-slate-600">Track project iterations clearly.</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                <p className="text-sm text-green-900 dark:text-green-200">
                  <span className="font-medium">💡 Why it matters:</span> Save hours of manual sending → look polished and premium in front of clients.
                </p>
              </div>
            </div>

            {/* For Sales Teams & Marketers */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="text-4xl mb-6">💼</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">For Sales Teams & Marketers</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">One-Click Pitch Deck Viewer</h4>
                  <p className="text-slate-600">Share decks as live links instead of heavy attachments.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Smart Analytics <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Pro</span></h4>
                  <p className="text-slate-600">Track who opened, what they viewed, and who downloaded.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Personalized Pages <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Pro</span></h4>
                  <p className="text-slate-600">Each lead sees their name/company on the delivery page.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Email-Optimized Links</h4>
                  <p className="text-slate-600">Work in Gmail, Outlook, CRMs without spam issues.</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                <p className="text-sm text-purple-900 dark:text-purple-200">
                  <span className="font-medium">💡 Why it matters:</span> Every share feels personal, and you know exactly which leads are warm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-slate-50/40 to-white">
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
                name: "Priya Sharma",
                role: "Freelance Designer",
                content: "Lytsite has transformed how I deliver work to clients. No more confusing email chains with large attachments.",
                rating: 5
              },
              {
                name: "Rajesh Kumar",
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
              Choose Your Template Style
            </h2>
            <p className="text-lg text-slate-600">
              Professional templates designed for different use cases
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
                    onClick={() => window.location.href = '/universal-file-template'} 
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
                onClick={() => window.location.href = '/templates'}
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
      <section className="py-20 bg-slate-50 dark:bg-slate-800 relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Transform your file sharing experience in seconds. Try our upload tool above or explore our templates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button 
              size="lg"
              className="h-14 px-8 bg-primary text-white hover:bg-primary/90 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
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
              className="h-14 px-8 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-lg transition-all"
              onClick={() => window.location.href = '/templates'}
            >
              View Templates
              <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section py-20 bg-gradient-to-b from-primary/10 to-white">
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

            {/* Clean Pricing Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              
              {/* Free Plan */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
                  <div className="text-3xl font-bold text-slate-900 mb-1">₹0</div>
                  <p className="text-sm text-slate-500">per month</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>2 GB upload size</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>10 GB bandwidth/month</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>7 days expiry</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>File previews</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>QR code sharing</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <X className="w-4 h-4 text-slate-400 mr-3 flex-shrink-0" />
                    <span className="text-slate-500">Password protection</span>
                  </li>
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('https://lytsite.com', '_blank')}
                >
                  Get Started
                </Button>
              </div>

              {/* Standard Plan - Popular */}
              <div className="bg-white rounded-2xl border-2 border-primary p-6 lg:p-8 shadow-lg relative transform scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1">Most Popular</Badge>
                </div>
                
                <div className="text-center mb-6 pt-2">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Standard</h3>
                  <div className="text-3xl font-bold text-slate-900 mb-1">₹749</div>
                  <p className="text-sm text-slate-500">per month</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>10 GB upload size</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>100 GB bandwidth/month</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>30 days expiry</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>Password protection</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>No watermark</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  onClick={handleFreeTrialClick}
                >
                  Start Free Trial
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Pro</h3>
                  <div className="text-3xl font-bold text-slate-900 mb-1">₹2,399</div>
                  <p className="text-sm text-slate-500">per month</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>25 GB upload size</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>500 GB bandwidth/month</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>No expiry</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>2 team members</span>
                  </li>
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/payment'}
                >
                  Upgrade to Pro
                </Button>
              </div>

              {/* Business Plan */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Business</h3>
                  <div className="text-3xl font-bold text-slate-900 mb-1">₹8,199</div>
                  <p className="text-sm text-slate-500">per month</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>100 GB upload size</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>2 TB bandwidth/month</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>White-label + domain</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>Full analytics + API</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>Unlimited team members</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span>Priority support + SLA</span>
                  </li>
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/payment'}
                >
                  Contact Sales
                </Button>
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
              <Button variant="outline" onClick={() => window.location.href = '/faq'}>
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          {/* Main Footer Content */}
          <div className="py-12 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src="/logo.png" 
                    alt="Lytsite" 
                    className="w-8 h-8 object-contain flex-shrink-0"
                  />
                  <span className="text-xl font-bold leading-none">Lytsite</span>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed text-sm">
                  Professional file sharing made simple. Transform how you deliver work to clients with beautiful, secure sharing pages.
                </p>
                {/* <div className="flex space-x-3">
                  <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.99C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                </div> */}
              </div>

              {/* Company Links */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Company</h3>
                <ul className="space-y-3">
                  <li><button onClick={() => window.location.href = '/about-us'} className="text-slate-400 hover:text-white transition-colors text-sm text-left">About Us</button></li>
                  <li><button onClick={() => window.location.href = '/blog'} className="text-slate-400 hover:text-white transition-colors text-sm text-left">Blog</button></li>
                  <li><button onClick={() => window.location.href = '/contact'} className="text-slate-400 hover:text-white transition-colors text-sm text-left">Contact</button></li>
                  <li><button onClick={() => window.location.href = '/faq'} className="text-slate-400 hover:text-white transition-colors text-sm text-left">FAQs</button></li>
                </ul>
              </div>

              {/* Support & Legal */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Support & Legal</h3>
                <ul className="space-y-3">
                  <li><button onClick={() => window.location.href = '/help'} className="text-slate-400 hover:text-white transition-colors text-sm text-left">Help Center</button></li>
                  <li><button onClick={() => window.location.href = '/privacy-policy'} className="text-slate-400 hover:text-white transition-colors text-sm text-left">Privacy Policy</button></li>
                  <li><button onClick={() => window.location.href = '/terms-conditions'} className="text-slate-400 hover:text-white transition-colors text-sm text-left">Terms & Conditions</button></li>
                  <li><button onClick={() => window.location.href = '/refund-cancellation'} className="text-slate-400 hover:text-white transition-colors text-sm text-left">Refund & Cancellation</button></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="py-8 border-t border-slate-800">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="lg:max-w-md">
                <h3 className="font-semibold text-lg mb-2">Stay updated</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Get the latest updates, tips, and product news delivered to your inbox.</p>
              </div>
              <div className="flex flex-col sm:flex-row w-full lg:w-auto lg:max-w-md gap-3">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full h-12 px-4 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-slate-800 transition-all duration-200 text-sm"
                  />
                </div>
                <Button className="h-12 bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 text-white px-6 rounded-lg whitespace-nowrap font-medium transition-all duration-200 shadow-lg hover:shadow-primary/20">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-6 border-t border-slate-800">
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between text-center lg:text-left space-y-4 lg:space-y-0">
              <p className="text-slate-400 text-sm">
                © 2025 Lytsite. All rights reserved. Professional file sharing made simple.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 text-sm">
                <span className="text-slate-400 flex items-center gap-1">
                  <span className="text-orange-400">🔒</span> SOC 2 Compliant
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <span className="text-green-400">🌍</span> GDPR Ready
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <span className="text-yellow-400">⚡</span> 99.9% Uptime
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </main>

      {/* Free Trial Modal */}
      {showTrialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Free Trial Started! 🎉
              </h3>
              <p className="text-gray-600 mb-6">
                Your free trial has been activated and is valid for <strong>14 days</strong>. 
                Enjoy full access to all Standard plan features!
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Trial expires:</strong> {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
              <Button 
                onClick={() => setShowTrialModal(false)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
