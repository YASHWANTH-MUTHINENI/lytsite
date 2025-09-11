import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowRight, 
  FileText, 
  Image, 
  User, 
  Calendar,
  ShoppingCart,
  Target,
  Presentation,
  Zap,
  ArrowLeft
} from "lucide-react";

interface TemplatesPageProps {
  onNavigate: (page: string) => void;
}

export default function TemplatesPage({ onNavigate }: TemplatesPageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('homepage')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Lytsite" 
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <span className="text-xl font-semibold text-slate-900 leading-none">Lytsite Templates</span>
            </div>
          </div>
        </div>
      </header>

      {/* Template Selection */}
      <section id="templates" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Choose your template style
            </h1>
            <p className="text-lg text-slate-600">
              Rich, professional templates with minimal setup - just 2-3 inputs needed
            </p>
          </div>
          
          {/* Default Universal Template Highlight */}
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
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">Universal Template</h3>
                      <p className="text-slate-600">Works with any file type</p>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6">
                    Smart, adaptive design that automatically optimizes for your content. Perfect for most use cases with professional styling and built-in analytics.
                  </p>
                  <div className="space-y-2 mb-6">
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
                    Preview Universal Template
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-blue-50 to-teal-50 relative overflow-hidden">
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
                    <div className="flex space-x-1 mb-2">
                      <div className="w-8 h-5 bg-slate-100 rounded border-2 border-primary"></div>
                      <div className="w-8 h-5 bg-slate-100 rounded"></div>
                      <div className="w-8 h-5 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Specialized Templates */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-900 text-center mb-4">Or choose a specialized template</h3>
            <p className="text-slate-600 text-center mb-8">Pre-designed for specific use cases with rich content and professional styling</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
            {/* Client Delivery Template */}
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer group" onClick={() => onNavigate('client-delivery')}>
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative">
                <FileText className="w-10 h-10 text-blue-600" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Client Delivery</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Professional file delivery with previews, project details, and download tracking.
                </p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Preview Template
                </Button>
              </CardContent>
            </Card>

            {/* Photo Gallery Template */}
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer group" onClick={() => onNavigate('photo-gallery')}>
              <div className="aspect-video bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center relative">
                <Image className="w-10 h-10 text-emerald-600" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Photo Gallery</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Stunning masonry grid with lightbox viewing and image metadata.
                </p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Preview Template
                </Button>
              </CardContent>
            </Card>

            {/* Portfolio Resume Template */}
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer group" onClick={() => onNavigate('portfolio-resume')}>
              <div className="aspect-video bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center relative">
                <User className="w-10 h-10 text-purple-600" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Portfolio Resume</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Personal brand showcase with work samples and professional bio.
                </p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Preview Template
                </Button>
              </CardContent>
            </Card>

            {/* Event Template */}
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer group" onClick={() => onNavigate('event-template')}>
              <div className="aspect-video bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center relative">
                <Calendar className="w-10 h-10 text-orange-600" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Event</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Event pages with schedules, speakers, and registration info.
                </p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Preview Template
                </Button>
              </CardContent>
            </Card>

            {/* Product Template */}
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer group" onClick={() => onNavigate('product-template')}>
              <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center relative">
                <ShoppingCart className="w-10 h-10 text-green-600" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Product</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Product showcases with features, pricing, and specifications.
                </p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Preview Template
                </Button>
              </CardContent>
            </Card>

            {/* Case Study Template */}
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer group" onClick={() => onNavigate('case-study-template')}>
              <div className="aspect-video bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center relative">
                <Target className="w-10 h-10 text-indigo-600" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Case Study</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Design and research case studies with process documentation.
                </p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Preview Template
                </Button>
              </CardContent>
            </Card>

            {/* Pitch Template */}
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer group" onClick={() => onNavigate('pitch-template')}>
              <div className="aspect-video bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center relative">
                <Presentation className="w-10 h-10 text-red-600" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Pitch Deck</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Investment and business pitch presentations with metrics.
                </p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                  Preview Template
                </Button>
              </CardContent>
            </Card>

            {/* More Templates Coming */}
            <Card className="overflow-hidden border-dashed border-2 border-slate-300 cursor-pointer group hover:border-primary transition-colors">
              <div className="aspect-video bg-slate-50 flex flex-col items-center justify-center relative">
                <div className="w-10 h-10 rounded-full border-2 border-slate-300 group-hover:border-primary transition-colors flex items-center justify-center mb-2">
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm text-slate-500 group-hover:text-primary transition-colors">More coming soon</span>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Request Template</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Need a specific template? Let us know what you're looking for.
                </p>
                <Button variant="outline" size="sm" className="w-full border-dashed">
                  Request Template
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl p-8 border border-slate-200">
            <h3 className="text-2xl font-semibold text-slate-900 mb-4">
              Ready to create your site?
            </h3>
            <p className="text-slate-600 mb-6">
              Start with any template and customize it with your content in minutes.
            </p>
            <Button 
              size="lg" 
              onClick={() => onNavigate('homepage')}
              className="w-full sm:w-auto"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
