import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
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
  Zap
} from "lucide-react";

interface HomepageProps {
  onNavigate: (page: string) => void;
}

export default function Homepage({ onNavigate }: HomepageProps) {
  const [showUploadFlow, setShowUploadFlow] = useState(false);

  const handleTryItFree = () => {
    setShowUploadFlow(true);
  };

  const handleUploadSuccess = (templateRoute: string) => {
    onNavigate(templateRoute);
  };

  return (
    <div className="min-h-screen bg-ocean-gradient">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">Lytsite</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How it works</a>
            <a href="#templates" className="text-slate-600 hover:text-slate-900 transition-colors">Templates</a>
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
        </div>
      </header>

      {/* Hero Section with Upload Component in Whitespace */}
      <section className="relative min-h-screen overflow-hidden bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start min-h-[85vh]">
            
            {/* Left Side - Hero Content */}
            <div className="flex flex-col justify-center space-y-8 lg:py-20">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Stop sending plain files.<br />
                <span className="text-ocean-gradient">Start sharing experiences.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-700 max-w-lg leading-relaxed">
                Lytsite instantly turns your PDFs, images, and docs into sleek, professional mini-sites — designed to impress, ready to share anywhere.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8" onClick={handleTryItFree}>
                  Try It Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => onNavigate('universal-file-template')}>
                  See Demo
                </Button>
              </div>

              {/* Quick Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                <div className="text-center sm:text-left">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto sm:mx-0 mb-3">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-medium text-slate-900 mb-1">Instant Upload</p>
                  <p className="text-sm text-slate-600">Any file type works</p>
                </div>
                <div className="text-center sm:text-left">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto sm:mx-0 mb-3">
                    <Palette className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-medium text-slate-900 mb-1">2-3 Simple Inputs</p>
                  <p className="text-sm text-slate-600">Professional results</p>
                </div>
                <div className="text-center sm:text-left">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto sm:mx-0 mb-3">
                    <Share2 className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-medium text-slate-900 mb-1">Share & Track</p>
                  <p className="text-sm text-slate-600">Analytics included</p>
                </div>
              </div>
            </div>

            {/* Right Side - Upload Component in the Whitespace */}
            <div className="flex items-center justify-center lg:py-20">
              {showUploadFlow ? (
                <div className="w-full max-w-lg">
                  <div className="mb-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowUploadFlow(false)}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                      Back
                    </Button>
                  </div>
                  <MinimalUploadModal onSuccess={handleUploadSuccess} />
                </div>
              ) : (
                <div className="w-full max-w-lg">
                  <Card className="border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 hover:shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Upload className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                        Ready to get started?
                      </h3>
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        Upload any file and watch it transform into a professional website in seconds. No signup required.
                      </p>
                      <Button 
                        onClick={handleTryItFree}
                        size="lg" 
                        className="w-full bg-primary hover:bg-primary/90 text-white h-12"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Start Upload
                      </Button>
                      <p className="text-xs text-slate-500 mt-4">
                        Works with PDFs, images, docs, presentations & more
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
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

      {/* Template Preview Section */}
      <section id="templates" className="py-20 bg-slate-50">
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
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white" onClick={handleTryItFree}>
              <Upload className="w-4 h-4 mr-2" />
              Start with Universal Template
            </Button>
            <p className="text-sm text-slate-600 mt-3">
              Quick start • Works with any file • Professional results in seconds
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Transform your file sharing experience in seconds. No signup required.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-slate-50" onClick={handleTryItFree}>
            Try It Free
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
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
