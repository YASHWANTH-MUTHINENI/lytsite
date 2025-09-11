import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Upload, Palette, Share2, ArrowRight, FileText, Image, User, QrCode } from "lucide-react";

interface HomepageProps {
  onNavigate: (page: string) => void;
}

export default function Homepage({ onNavigate }: HomepageProps) {
  return (
    <div className="min-h-screen bg-ocean-gradient">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Lytsite" 
              className="w-8 h-8 object-contain flex-shrink-0"
            />
            <span className="text-xl font-semibold text-slate-900 leading-none">Lytsite</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How it works</a>
            <a href="#templates" className="text-slate-600 hover:text-slate-900 transition-colors">Templates</a>
            <a href="#feedback" className="text-slate-600 hover:text-slate-900 transition-colors">Feedback</a>
            <Button variant="outline" size="sm">Sign In</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Drop files.{" "}
            <span className="text-ocean-gradient">Get a website.</span>{" "}
            Instantly.
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Turn your raw file transfers into beautiful, professional mini-websites. 
            Perfect for client deliveries, portfolios, and project showcases.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
              Try It Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
          
          {/* Hero Image */}
          <div className="relative mx-auto max-w-4xl">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1748665194498-21a7e3d8ff19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBsYXB0b3B8ZW58MXx8fHwxNzU3MjI3Mjc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern workspace with laptop"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600">
              Three simple steps to transform your files into a beautiful website
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">1. Drop Files</h3>
              <p className="text-slate-600">
                Drag and drop your files directly into Lytsite. No accounts or setup required.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">2. Choose Template</h3>
              <p className="text-slate-600">
                Pick from client delivery, photo gallery, or portfolio resume templates.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">3. Share</h3>
              <p className="text-slate-600">
                Get an instant shareable link and QR code for your new mini-website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Template Previews */}
      <section id="templates" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Choose your template
            </h2>
            <p className="text-lg text-slate-600">
              Professional designs for every use case
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Client Delivery Template */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('client-delivery')}>
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Client Delivery</h3>
                <p className="text-slate-600 mb-4">
                  Professional file delivery with previews and download functionality.
                </p>
                <Button variant="outline" className="w-full">
                  Preview Template
                </Button>
              </CardContent>
            </Card>

            {/* Photo Gallery Template */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('photo-gallery')}>
              <div className="aspect-video bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                <Image className="w-12 h-12 text-emerald-600" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Photo Gallery</h3>
                <p className="text-slate-600 mb-4">
                  Stunning masonry grid with lightbox for events and portfolios.
                </p>
                <Button variant="outline" className="w-full">
                  Preview Template
                </Button>
              </CardContent>
            </Card>

            {/* Portfolio Resume Template */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('portfolio-resume')}>
              <div className="aspect-video bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
                <User className="w-12 h-12 text-purple-600" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Portfolio Resume</h3>
                <p className="text-slate-600 mb-4">
                  Personal brand showcase with skills, work samples, and contact info.
                </p>
                <Button variant="outline" className="w-full">
                  Preview Template
                </Button>
              </CardContent>
            </Card>
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
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-slate-50">
            Try It Free
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Help us improve Lytsite
              </h2>
              <p className="text-lg text-slate-600">
                Your feedback helps us build the best file-to-website experience
              </p>
            </div>
            
            <Card>
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      What would you like to see improved?
                    </label>
                    <Textarea 
                      placeholder="Share your thoughts, feature requests, or any issues you've encountered..."
                      className="min-h-32"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email (optional)
                    </label>
                    <Input 
                      type="email"
                      placeholder="your@email.com"
                    />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Submit Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
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
            <p>© 2025 Lytsite. Making file sharing beautiful.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}